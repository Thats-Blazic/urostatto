import { cn } from "@/lib/cn";

interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
}

/** Mali uredničk-stil naslov sekcije: „02 ———— Radovi". */
export function SectionLabel({ index, label, className }: SectionLabelProps) {
  return (
    <p className={cn("flex items-center gap-4 text-xs font-medium uppercase tracking-[0.3em] text-ash", className)}>
      <span className="text-blood">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-white/25 sm:w-16" />
      <span>{label}</span>
    </p>
  );
}
