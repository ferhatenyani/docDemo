"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Calendar } from "./Calendar";
import { useLocale, useT } from "@/lib/i18n";

interface Props {
  value?: string;
  onChange: (d: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: string;
  locale?: "fr" | "ar";
  disabled?: boolean;
}

function displayFormat(d: string, locale: "fr" | "ar"): string {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(date);
}

export function DatePicker({ value, onChange, placeholder, className, minDate, locale, disabled }: Props) {
  const t = useT();
  const storeLocale = useLocale();
  const loc = locale ?? storeLocale;
  const ph = placeholder ?? t("choose") + " " + t("date").toLowerCase();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, [open]);

  return (
    <div ref={root} className={clsx("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center gap-2 w-full h-9 px-2.5 rounded-md bg-white border border-line cursor-pointer",
          "text-left transition-all duration-150",
          "hover:border-line-strong focus:border-brand-500 focus:shadow-ring",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <CalendarDays className="h-3.5 w-3.5 text-ink-400 shrink-0" />
        <span className={clsx("flex-1 text-[13px] truncate tracking-crisp", value ? "text-ink-900" : "text-ink-400")}>
          {value ? displayFormat(value, loc) : ph}
        </span>
        <ChevronDown className={clsx("h-3.5 w-3.5 text-ink-400 transition-transform shrink-0", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 animate-popIn">
          <Calendar
            value={value}
            onChange={(d) => { onChange(d); setOpen(false); }}
            minDate={minDate}
            locale={loc}
            className="shadow-overlay"
          />
        </div>
      )}
    </div>
  );
}
