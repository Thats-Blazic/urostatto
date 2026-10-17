import { contact, siteConfig } from "@/config/site";
import type { BookingValues } from "@/lib/booking/validation";

/** 2030-01-31 → 31.01.2030. */
function formatDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : iso;
}

/** Tekst poruke koju klijent šalje studiju (WhatsApp / Viber / SMS). */
export function buildBookingMessage(values: BookingValues, hasReferencePhoto: boolean): string {
  const lines = [
    `Zdravo! Šaljem zahtev za termin preko sajta ${siteConfig.name}.`,
    "",
    `Ime i prezime: ${values.fullName.trim()}`,
    `Telefon: ${values.phone.trim()}`,
    values.email.trim() ? `Email: ${values.email.trim()}` : null,
    `Stil: ${values.style}`,
    `Deo tela: ${values.bodyPart}`,
    `Veličina: ${values.size}`,
    `Željeni datum: ${formatDate(values.date)}`,
    "",
    "Ideja:",
    values.idea.trim(),
  ];
  if (hasReferencePhoto) {
    lines.push("", "Referentnu fotografiju šaljem u narednoj poruci.");
  }
  return lines.filter((line): line is string => line !== null).join("\n");
}

export interface MessageLinks {
  whatsapp: string;
  viber: string;
  sms: string;
}

/** Linkovi ka aplikacijama za poruke. Viber ne podržava unapred popunjen tekst, pa se tekst kopira. */
export function buildMessageLinks(message: string): MessageLinks | null {
  const number = contact.messagingNumber;
  if (!number) return null;
  return {
    whatsapp: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    viber: `viber://chat?number=%2B${number}`,
    sms: `sms:+${number}?&body=${encodeURIComponent(message)}`,
  };
}
