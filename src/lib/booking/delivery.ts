import type { BookingValues } from "./validation";

/**
 * ============================================================
 *  ISPORUKA ZAHTEVA ZA TERMIN (samo server)
 *
 *  Podržana su dva načina; aktivira se prvi koji je podešen:
 *    1) Email preko Resend-a  → RESEND_API_KEY, BOOKING_TO_EMAIL, BOOKING_FROM_EMAIL
 *    2) Webhook (Make, Zapier, n8n, baza...) → BOOKING_WEBHOOK_URL
 *
 *  Ako nijedan nije podešen, API ruta vraća 503 i forma jasno prikazuje
 *  da slanje nije aktivirano. Novi provajder (baza, SMTP...) dodaj kao
 *  još jednu funkciju ispod i uključi je u `getDeliveryProvider`.
 * ============================================================
 */

export interface BookingReference {
  name: string;
  type: string;
  size: number;
  /** Sadržaj fajla, base64. */
  base64: string;
}

export interface BookingPayload {
  values: Omit<BookingValues, "confirm">;
  reference: BookingReference | null;
  receivedAt: string;
}

export type DeliveryProvider = "resend" | "webhook";

export function getDeliveryProvider(): DeliveryProvider | null {
  if (
    process.env.RESEND_API_KEY &&
    process.env.BOOKING_TO_EMAIL &&
    process.env.BOOKING_FROM_EMAIL
  ) {
    return "resend";
  }
  if (process.env.BOOKING_WEBHOOK_URL) return "webhook";
  return null;
}

function formatText(payload: BookingPayload): string {
  const { values, reference, receivedAt } = payload;
  return [
    "NOVI ZAHTEV ZA TERMIN",
    "(zahtev, ne potvrđena rezervacija)",
    "",
    `Ime i prezime: ${values.fullName}`,
    `Telefon: ${values.phone}`,
    `Email: ${values.email || "—"}`,
    `Željeni stil: ${values.style}`,
    `Deo tela: ${values.bodyPart}`,
    `Približna veličina: ${values.size}`,
    `Željeni datum: ${values.date}`,
    `Referentna fotografija: ${reference ? `${reference.name} (u prilogu)` : "nije priložena"}`,
    "",
    "Opis ideje:",
    values.idea,
    "",
    `Primljeno: ${receivedAt}`,
  ].join("\n");
}

async function sendViaResend(payload: BookingPayload): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.BOOKING_FROM_EMAIL,
      to: [process.env.BOOKING_TO_EMAIL],
      reply_to: payload.values.email || undefined,
      subject: `Zahtev za termin — ${payload.values.fullName}`,
      text: formatText(payload),
      attachments: payload.reference
        ? [{ filename: payload.reference.name, content: payload.reference.base64 }]
        : undefined,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Resend je vratio status ${response.status}`);
  }
}

async function sendViaWebhook(payload: BookingPayload): Promise<void> {
  const response = await fetch(process.env.BOOKING_WEBHOOK_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "booking_request",
      receivedAt: payload.receivedAt,
      ...payload.values,
      reference: payload.reference
        ? {
            name: payload.reference.name,
            type: payload.reference.type,
            size: payload.reference.size,
            // Sadržaj fajla se šalje samo ako ga primalac želi:
            base64: process.env.BOOKING_WEBHOOK_INCLUDE_FILE === "true" ? payload.reference.base64 : undefined,
          }
        : null,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Webhook je vratio status ${response.status}`);
  }
}

export async function deliverBooking(payload: BookingPayload): Promise<void> {
  const provider = getDeliveryProvider();
  if (provider === "resend") return sendViaResend(payload);
  if (provider === "webhook") return sendViaWebhook(payload);
  throw new Error("Nijedan provajder za slanje nije podešen.");
}
