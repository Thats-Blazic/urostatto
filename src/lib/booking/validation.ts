import {
  bodyPartOptions,
  fieldLimits,
  referenceFileRules,
  sizeOptions,
  styleOptions,
} from "@/config/booking";

/**
 * Validacija zahteva za termin.
 * Deli je formular (klijent) i API ruta (server) — pravila su na jednom mestu.
 */

export type BookingField =
  | "fullName"
  | "phone"
  | "email"
  | "style"
  | "bodyPart"
  | "size"
  | "idea"
  | "date"
  | "reference"
  | "confirm";

export interface BookingValues {
  fullName: string;
  phone: string;
  email: string;
  style: string;
  bodyPart: string;
  size: string;
  idea: string;
  date: string;
  confirm: boolean;
}

export type BookingErrors = Partial<Record<BookingField, string>>;

export interface FileLike {
  name: string;
  size: number;
  type: string;
}

export const emptyBookingValues: BookingValues = {
  fullName: "",
  phone: "",
  email: "",
  style: "",
  bodyPart: "",
  size: "",
  idea: "",
  date: "",
  confirm: false,
};

/** Današnji datum (YYYY-MM-DD) po beogradskom vremenu. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Belgrade" }).format(new Date());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[0-9\s().\-/]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateReferenceFile(file: FileLike | null | undefined): string | undefined {
  if (!file) return undefined;
  if (!referenceFileRules.mimeTypes.includes(file.type)) {
    return `Dozvoljeni formati su ${referenceFileRules.extensions}.`;
  }
  if (file.size > referenceFileRules.maxBytes) {
    return `Fotografija je prevelika. Maksimalna veličina je ${referenceFileRules.maxMb} MB.`;
  }
  if (file.size === 0) {
    return "Izabrani fajl je prazan.";
  }
  return undefined;
}

export function validateField(
  field: BookingField,
  values: BookingValues,
  file?: FileLike | null,
): string | undefined {
  switch (field) {
    case "fullName": {
      const value = values.fullName.trim();
      if (!value) return "Upiši ime i prezime.";
      if (value.length < fieldLimits.nameMin) return "Ime je prekratko.";
      if (value.length > fieldLimits.nameMax) return `Ime može imati najviše ${fieldLimits.nameMax} karaktera.`;
      return undefined;
    }
    case "phone": {
      const value = values.phone.trim();
      if (!value) return "Upiši broj telefona.";
      const digits = value.replace(/\D/g, "");
      if (!PHONE_CHARS_RE.test(value) || digits.length < 7 || digits.length > 15) {
        return "Unesi ispravan broj telefona (npr. +381 60 123 4567).";
      }
      return undefined;
    }
    case "email": {
      const value = values.email.trim();
      if (!value) return undefined; // opciono
      if (value.length > 120 || !EMAIL_RE.test(value)) return "Unesi ispravnu email adresu.";
      return undefined;
    }
    case "style":
      if (!values.style) return "Izaberi željeni stil.";
      if (!(styleOptions as readonly string[]).includes(values.style)) return "Izaberi stil sa liste.";
      return undefined;
    case "bodyPart":
      if (!values.bodyPart) return "Izaberi deo tela.";
      if (!(bodyPartOptions as readonly string[]).includes(values.bodyPart)) return "Izaberi deo tela sa liste.";
      return undefined;
    case "size":
      if (!values.size) return "Izaberi približnu veličinu.";
      if (!(sizeOptions as readonly string[]).includes(values.size)) return "Izaberi veličinu sa liste.";
      return undefined;
    case "idea": {
      const value = values.idea.trim();
      if (!value) return "Opiši svoju ideju.";
      if (value.length < fieldLimits.ideaMin) {
        return `Opis je prekratak — napiši bar ${fieldLimits.ideaMin} karaktera.`;
      }
      if (value.length > fieldLimits.ideaMax) return `Opis može imati najviše ${fieldLimits.ideaMax} karaktera.`;
      return undefined;
    }
    case "date": {
      if (!values.date) return "Izaberi željeni datum.";
      if (!DATE_RE.test(values.date) || Number.isNaN(Date.parse(values.date))) return "Unesi ispravan datum.";
      if (values.date < todayISO()) return "Datum ne može biti u prošlosti.";
      return undefined;
    }
    case "reference":
      return validateReferenceFile(file);
    case "confirm":
      return values.confirm ? undefined : "Potvrdi da su uneti podaci ispravni.";
  }
}

export const bookingFields: BookingField[] = [
  "fullName",
  "phone",
  "email",
  "style",
  "bodyPart",
  "size",
  "idea",
  "date",
  "reference",
  "confirm",
];

export function validateBooking(values: BookingValues, file?: FileLike | null): BookingErrors {
  const errors: BookingErrors = {};
  for (const field of bookingFields) {
    const message = validateField(field, values, file);
    if (message) errors[field] = message;
  }
  return errors;
}
