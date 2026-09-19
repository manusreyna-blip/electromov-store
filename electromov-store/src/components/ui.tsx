import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-volt-500 text-ink-900 hover:bg-volt-400 active:bg-volt-600 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_24px_-12px_rgba(0,199,118,0.9)]",
  secondary: "bg-white text-ink-800 border border-sand-200 hover:border-ink-800 hover:bg-sand-50",
  ghost: "bg-transparent text-ink-800 hover:bg-sand-100",
  dark: "bg-ink-800 text-white hover:bg-ink-700",
  whatsapp: "bg-[#25D366] text-[#052e16] hover:brightness-105",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

const BASE =
  "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none";

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "volt" | "dark" | "warn";
}) {
  const tones = {
    neutral: "bg-sand-100 text-sand-700 border-sand-200",
    volt: "bg-volt-50 text-volt-800 border-volt-200",
    dark: "bg-ink-800 text-volt-200 border-ink-700",
    warn: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-volt-700">{eyebrow}</p>
      ) : null}
      <As className="text-balance-title text-3xl font-semibold tracking-[-0.03em] text-ink-800 sm:text-4xl">
        {title}
      </As>
      {description ? <p className="mt-4 text-[17px] leading-relaxed text-sand-600">{description}</p> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-sand-200 bg-white shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </div>
  );
}
