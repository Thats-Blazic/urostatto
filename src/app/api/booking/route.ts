import { connection } from "next/server";
import { referenceFileRules } from "@/config/booking";
import { deliverBooking, getDeliveryProvider, type BookingReference } from "@/lib/booking/delivery";
import {
  validateBooking,
  validateReferenceFile,
  type BookingValues,
} from "@/lib/booking/validation";

/** Ukupna gornja granica tela zahteva: fajl + polja. */
const MAX_BODY_BYTES = referenceFileRules.maxBytes + 256 * 1024;

/** Jednostavno ograničenje učestalosti (u memoriji; za više instanci koristi Redis/Upstash). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Provera stvarnog sadržaja slike (ne verujemo samo MIME tipu iz browsera). */
function matchesImageSignature(bytes: Uint8Array, mime: string): boolean {
  if (mime === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47].every((byte, index) => bytes[index] === byte);
  }
  if (mime === "image/webp") {
    const riff = String.fromCharCode(...bytes.slice(0, 4));
    const webp = String.fromCharCode(...bytes.slice(8, 12));
    return riff === "RIFF" && webp === "WEBP";
  }
  return false;
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

/** Forma proverava ovde da li je slanje aktivirano. */
export async function GET() {
  await connection();
  return json({ enabled: getDeliveryProvider() !== null }, 200);
}

export async function POST(request: Request) {
  if (getDeliveryProvider() === null) {
    return json(
      {
        ok: false,
        code: "not_configured",
        message: "Slanje zahteva trenutno nije aktivirano. Zahtev NIJE poslat.",
      },
      503,
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return json({ ok: false, code: "rate_limited", message: "Previše pokušaja. Pokušaj ponovo za nekoliko minuta." }, 429);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, code: "too_large", message: "Zahtev je prevelik." }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, code: "bad_request", message: "Zahtev nije ispravno formatiran." }, 400);
  }

  // Honeypot: pravi korisnici ovo polje nikad ne vide niti popunjavaju.
  if (text(form, "website").trim() !== "") {
    return json({ ok: false, code: "rejected", message: "Zahtev nije prihvaćen." }, 400);
  }

  const values: BookingValues = {
    fullName: text(form, "fullName"),
    phone: text(form, "phone"),
    email: text(form, "email"),
    style: text(form, "style"),
    bodyPart: text(form, "bodyPart"),
    size: text(form, "size"),
    idea: text(form, "idea"),
    date: text(form, "date"),
    confirm: text(form, "confirm") === "true",
  };

  const rawFile = form.get("reference");
  const file = rawFile instanceof File && rawFile.size > 0 ? rawFile : null;

  const errors = validateBooking(values, file);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, code: "validation", message: "Proveri označena polja.", errors }, 400);
  }

  let reference: BookingReference | null = null;
  if (file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const fileError = validateReferenceFile({ name: file.name, size: bytes.byteLength, type: file.type });
    if (fileError || !matchesImageSignature(bytes, file.type)) {
      return json(
        {
          ok: false,
          code: "validation",
          message: "Proveri označena polja.",
          errors: { reference: fileError ?? "Fajl nije ispravna fotografija." },
        },
        400,
      );
    }
    reference = {
      name: file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 100) || "referenca",
      type: file.type,
      size: bytes.byteLength,
      base64: Buffer.from(bytes).toString("base64"),
    };
  }

  const { confirm: _confirm, ...publicValues } = values;
  void _confirm;

  try {
    await deliverBooking({
      values: {
        ...publicValues,
        fullName: publicValues.fullName.trim(),
        phone: publicValues.phone.trim(),
        email: publicValues.email.trim(),
        idea: publicValues.idea.trim(),
      },
      reference,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[booking] Slanje nije uspelo:", error);
    return json(
      { ok: false, code: "delivery_failed", message: "Slanje nije uspelo. Pokušaj ponovo ili nas kontaktiraj direktno." },
      502,
    );
  }

  return json(
    {
      ok: true,
      message: "Hvala ti! Javljamo ti se uskoro.",
    },
    200,
  );
}
