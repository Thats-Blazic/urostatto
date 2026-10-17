import { Asterisk } from "lucide-react";
import { tattooStyles } from "@/config/styles";

/** Dekorativna traka sa stilovima — razdvaja hero od ostatka stranice. */
export function Marquee() {
  const items = tattooStyles.map((style) => style.name);

  const track = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((name, index) => (
        <li key={`${name}-${hidden}`} className="flex items-center">
          <span
            className={`px-6 font-display text-3xl font-medium uppercase tracking-wide sm:px-10 sm:text-5xl ${
              index % 2 === 1 ? "text-outline-thin [--outline-color:rgb(237_237_237/0.6)]" : "text-bone"
            }`}
          >
            {name}
          </span>
          <Asterisk aria-hidden="true" size={28} strokeWidth={1.5} className="shrink-0 text-blood" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="presentation"
      className="relative overflow-hidden border-y border-white/10 bg-ink py-6 sm:py-8"
    >
      <div className="animate-marquee flex w-max">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
