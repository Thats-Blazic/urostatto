import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "stroke"> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * Instagram ikona u istom stilu kao Lucide (u novijim verzijama Lucide-a
 * brend ikone su uklonjene, pa je ovde ista geometrija kao originalna).
 */
export function InstagramIcon({ size = 24, strokeWidth = 1.75, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/** Monogram „D" — znak studija (isti oblik kao favicon). */
export function BrandMark({ size = 30, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 7h6.5a9 9 0 0 1 0 18H9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="25.5" cy="6.5" r="2" fill="var(--color-blood)" />
    </svg>
  );
}
