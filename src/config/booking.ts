/**
 * ============================================================
 *  ZAKAZIVANJE — opcije u formularu i ograničenja za fajl.
 *  Isti fajl koristi i forma (klijent) i API ruta (server).
 * ============================================================
 */

export const styleOptions = [
  "Blackwork",
  "Realizam",
  "Fine Line",
  "Traditional",
  "Ornamental",
  "Custom Design",
  "Nisam siguran/na — treba mi savet",
] as const;

export const bodyPartOptions = [
  "Šaka / prsti",
  "Podlaktica",
  "Nadlaktica",
  "Rame",
  "Grudi",
  "Rebra",
  "Leđa",
  "Vrat",
  "Butina",
  "List / potkolenica",
  "Stopalo",
  "Drugi deo tela",
] as const;

export const sizeOptions = [
  "Mala (do 5 cm)",
  "Srednja (5–15 cm)",
  "Velika (15–30 cm)",
  "Rukav / leđa / veliki projekat (30 cm+)",
  "Ne znam — treba mi procena",
] as const;

export const referenceFileRules = {
  maxBytes: 5 * 1024 * 1024,
  maxMb: 5,
  mimeTypes: ["image/jpeg", "image/png", "image/webp"] as readonly string[],
  extensions: ".jpg, .jpeg, .png, .webp",
  accept: "image/jpeg,image/png,image/webp",
};

export const bookingProcess = [
  { title: "Pošalji ideju", text: "Opiši šta želiš i priloži referencu ako je imaš." },
  { title: "Dogovor", text: "Javljam ti se da prođemo kroz detalje, veličinu i dizajn." },
  { title: "Potvrda termina", text: "Termin je potvrđen tek kada ti to izričito potvrdim." },
] as const;

export const fieldLimits = {
  nameMin: 2,
  nameMax: 80,
  ideaMin: 15,
  ideaMax: 2000,
} as const;
