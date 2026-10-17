"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  icon?: LucideIcon;
  /** Ako je prazno i `disabled`, dugme je prikazano kao nedostupno. */
  href?: string | null;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

const base =
  "group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden px-7 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 focus-visible:outline-offset-4";

const variants: Record<Variant, { surface: string; fill: string; hoverText: string }> = {
  primary: {
    surface: "bg-blood text-white",
    fill: "bg-bone",
    hoverText: "group-hover:text-ink",
  },
  outline: {
    surface: "border border-white/30 text-bone",
    fill: "bg-bone",
    hoverText: "group-hover:text-ink",
  },
  ghost: {
    surface: "text-bone",
    fill: "bg-white/10",
    hoverText: "",
  },
};

/** Dugme / link sa „fill" hover animacijom i mikro-interakcijom ikonice. */
export function Button({
  children,
  variant = "primary",
  icon: Icon,
  href,
  onClick,
  type = "button",
  disabled = false,
  external = false,
  className,
  ariaLabel,
  title,
}: ButtonProps) {
  const style = variants[variant];
  const classes = cn(
    base,
    style.surface,
    disabled && "pointer-events-none cursor-not-allowed opacity-40",
    className,
  );

  const content = (
    <>
      {!disabled && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100",
            style.fill,
          )}
        />
      )}
      <span className={cn("relative z-10 flex items-center gap-3 transition-colors duration-500", style.hoverText)}>
        {children}
        {Icon && (
          <Icon
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:-translate-y-0.5"
          />
        )}
      </span>
    </>
  );

  const motionProps = disabled ? {} : { whileTap: { scale: 0.97 } };

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        className={classes}
        aria-label={ariaLabel}
        title={title}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={classes}
      aria-label={ariaLabel}
      title={title}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
