"use client";

import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

// ---------- Card ---------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  flush?: boolean;
}

export function Card({
  className, padding = "md", interactive, flush, children, ...rest
}: CardProps) {
  const pad = {
    none: "", sm: "p-3", md: "p-4", lg: "p-5",
  }[padding];
  return (
    <div
      className={clsx(
        "bg-white rounded-lg border border-line",
        !flush && "shadow-xs",
        interactive && "cursor-pointer hover:border-line-strong hover:shadow-card transition-all duration-150",
        pad,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

// ---------- Section header -----------------------------------

interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, actions, eyebrow, className }: SectionHeaderProps) {
  return (
    <div className={clsx("flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h1 className="text-[22px] sm:text-[24px] font-semibold text-ink-900 tracking-tightest leading-tight truncate">{title}</h1>
        {description && <p className="text-[13px] text-ink-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ---------- Badge --------------------------------------------

type Tone = "brand" | "success" | "warning" | "danger" | "neutral" | "info" | "dark";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
  variant?: "soft" | "solid" | "outline";
  dot?: boolean;
}

export function Badge({ tone = "neutral", children, className, size = "md", variant = "soft", dot }: BadgeProps) {
  const soft: Record<Tone, string> = {
    brand: "bg-brand-50 text-brand-700",
    success: "bg-success-soft text-[#0f7a48]",
    warning: "bg-warning-soft text-[#8a5a00]",
    danger: "bg-danger-soft text-[#b91c1c]",
    info: "bg-info-soft text-[#0369a1]",
    neutral: "bg-ink-100 text-ink-700",
    dark: "bg-ink-900 text-white",
  };
  const solid: Record<Tone, string> = {
    brand: "bg-brand-600 text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-danger text-white",
    info: "bg-info text-white",
    neutral: "bg-ink-700 text-white",
    dark: "bg-ink-900 text-white",
  };
  const outline: Record<Tone, string> = {
    brand: "border border-brand-200 text-brand-700 bg-white",
    success: "border border-[#a4d4bf] text-[#0f7a48] bg-white",
    warning: "border border-[#e0c692] text-[#8a5a00] bg-white",
    danger: "border border-[#f0b5b5] text-[#b91c1c] bg-white",
    info: "border border-[#a5cfe6] text-[#0369a1] bg-white",
    neutral: "border border-line text-ink-700 bg-white",
    dark: "border border-ink-800 text-ink-900 bg-white",
  };
  const dotColors: Record<Tone, string> = {
    brand: "bg-brand-600",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-info",
    neutral: "bg-ink-500",
    dark: "bg-ink-900",
  };
  const sz = size === "sm" ? "text-[10px] px-1.5 py-0.5 h-4" : "text-[11px] px-2 py-0.5 h-5";
  const map = variant === "solid" ? solid : variant === "outline" ? outline : soft;
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 rounded-sm font-medium tracking-crisp whitespace-nowrap",
      sz, map[tone], className,
    )}>
      {dot && <span className={clsx("h-1.5 w-1.5 rounded-full", dotColors[tone])} />}
      {children}
    </span>
  );
}

// ---------- Empty state --------------------------------------

interface EmptyProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyProps) {
  return (
    <div className={clsx(
      "flex flex-col items-center justify-center text-center py-12 px-6",
      className,
    )}>
      {icon && (
        <div className="h-11 w-11 rounded-md border border-line bg-white text-ink-400 grid place-items-center mb-3">
          {icon}
        </div>
      )}
      <div className="text-[14px] font-semibold text-ink-800">{title}</div>
      {description && <div className="text-[12px] text-ink-500 mt-1 max-w-sm">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ---------- Skeleton -----------------------------------------

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} />;
}

// ---------- Divider ------------------------------------------

export function Divider({ className }: { className?: string }) {
  return <div className={clsx("h-px w-full bg-line", className)} />;
}

// ---------- Chip --------------------------------------------

export function Chip({
  active, onClick, children, className,
}: { active?: boolean; onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12px] font-medium cursor-pointer",
        "transition-colors duration-150 border tracking-crisp",
        active
          ? "bg-ink-900 text-white border-ink-900"
          : "bg-white text-ink-700 border-line hover:border-line-strong hover:bg-ink-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ---------- Avatar -------------------------------------------

export function Avatar({ name, className, size = 32 }: { name: string; className?: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
  const hue = Math.abs(hashString(name)) % 360;
  const bg = `hsl(${hue}, 40%, 94%)`;
  const fg = `hsl(${hue}, 45%, 30%)`;
  return (
    <div
      className={clsx("rounded-md grid place-items-center font-semibold shrink-0 tracking-crisp", className)}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

// ---------- StatCard -----------------------------------------

export function StatCard({
  label, value, delta, deltaTone, icon, sublabel, href, sparkline, className,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "success" | "danger" | "neutral";
  sublabel?: string;
  icon?: ReactNode;
  href?: string;
  sparkline?: ReactNode;
  className?: string;
}) {
  const dc = deltaTone === "success" ? "text-[#0f7a48] bg-success-soft"
    : deltaTone === "danger" ? "text-[#b91c1c] bg-danger-soft"
    : "text-ink-600 bg-ink-100";

  const inner = (
    <div className={clsx(
      "group h-full bg-white border border-line rounded-lg p-4 shadow-xs",
      href && "cursor-pointer hover:border-line-strong hover:shadow-card transition-all duration-150",
      className,
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="eyebrow">{label}</div>
          <div className="text-[22px] sm:text-[24px] font-semibold text-ink-900 tabular tracking-tightest mt-1.5 leading-none truncate">
            {value}
          </div>
          {sublabel && <div className="text-[11px] text-ink-500 mt-1">{sublabel}</div>}
        </div>
        {icon && (
          <div className="h-8 w-8 rounded-md border border-line bg-surface-muted text-ink-500 grid place-items-center shrink-0">
            {icon}
          </div>
        )}
      </div>
      {(delta || sparkline) && (
        <div className="mt-3 flex items-center justify-between gap-2 min-h-[24px]">
          {delta && (
            <span className={clsx("inline-flex items-center h-5 px-1.5 rounded-sm text-[11px] font-semibold tabular", dc)}>
              {delta}
            </span>
          )}
          {sparkline && <div className="flex-1 min-w-0 h-6">{sparkline}</div>}
        </div>
      )}
    </div>
  );
  return inner;
}
