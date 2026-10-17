import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { BrandMark } from "./icons";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/** Logo / naziv studija. Tekst se menja u src/config/site.ts. */
export function Logo({ className, onClick }: LogoProps) {
  const [first, second] = siteConfig.nameParts;
  return (
    <a
      href="#pocetna"
      onClick={onClick}
      aria-label={`${siteConfig.name} — na vrh stranice`}
      className={cn("group inline-flex items-center gap-3 text-bone", className)}
    >
      <BrandMark className="shrink-0 transition-transform duration-500 group-hover:rotate-90" />
      <span className="font-display text-lg leading-none tracking-[0.18em] sm:text-xl">
        <span className="font-semibold">{first}</span>{" "}
        <span className="font-light text-ash transition-colors group-hover:text-blood">{second}</span>
      </span>
    </a>
  );
}
