import { BadgeCheck, PenTool, ScanEye, type LucideIcon } from "lucide-react";

/**
 * ============================================================
 *  O MENI — tekstovi se menjaju ovde.
 *  Pasusi su napisani kao opšti opis pristupa radu; zameni ih
 *  svojom pričom, iskustvom i inspiracijom.
 * ============================================================
 */

export const aboutContent = {
  eyebrow: "Umetnost koja ostaje",
  title: "VIŠE OD TETOVAŽE.",
  paragraphs: [
    "Svaka tetovaža počinje razgovorom. Slušam tvoju priču, razumem šta ti znači i tek onda uzimam olovku u ruke. Ne radim po šablonu — radim ono što pripada samo tebi.",
    "Preciznost, čiste linije i dugotrajan rezultat nisu stvar sreće, već discipline. Svaki dizajn prilagođavam obliku tela, a higijena i sterilan radni prostor su standard, ne opcija.",
  ],
  quote: "Tetovaža je jedina umetnost koju nosiš ceo život.",
  imageAlt: "Tattoo umetnik na poslu u studiju",
  detailImageAlt: "Tinte i oprema u studiju",
};

export interface AboutPillar {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const aboutPillars: AboutPillar[] = [
  {
    icon: PenTool,
    title: "Individualni dizajn",
    text: "Svaki crtež nastaje od nule, prema tvojoj ideji i telu.",
  },
  {
    icon: BadgeCheck,
    title: "Profesionalna izrada",
    text: "Sterilna oprema, provereni materijali i jasna nega posle.",
  },
  {
    icon: ScanEye,
    title: "Posvećenost detaljima",
    text: "Linija po linija, dok rezultat nije savršen.",
  },
];
