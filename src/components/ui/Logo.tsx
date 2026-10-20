import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/** Logo / naziv studija. Tekst se menja u src/config/site.ts, a znak je public/logo.png. */
export function Logo({ className, onClick }: LogoProps) {
  const [first, second] = siteConfig.nameParts;
  return (
    <a
      href="#pocetna"
      onClick={onClick}
      aria-label={`${siteConfig.name} — na vrh stranice`}
      className={cn("group inline-flex items-center gap-3 text-bone", className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={591}
        height={671}
        priority
        className="h-10 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110"
      />
      <span className="font-display text-lg leading-none tracking-[0.18em] sm:text-xl">
        <span className="font-semibold">{first}</span>{" "}
        <span className="font-light text-ash transition-colors group-hover:text-blood">{second}</span>
      </span>
    </a>
  );
}
