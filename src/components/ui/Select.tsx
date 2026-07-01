"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface Props<T extends string> {
  value: T | undefined;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  leftIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Sélectionner…",
  leftIcon,
  className,
  disabled,
  invalid,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) setActiveIndex(options.findIndex((o) => o.value === value));
  }, [open, options, value]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={clsx(
          "flex items-center gap-2 w-full h-9 px-2.5 rounded-md bg-white border border-line",
          "transition-all duration-150 text-left",
          "hover:border-line-strong focus:border-brand-500 focus:shadow-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          invalid && "border-danger",
        )}
      >
        {leftIcon && <span className="text-ink-400 shrink-0">{leftIcon}</span>}
        <span className={clsx("flex-1 text-[13px] truncate tracking-crisp", selected ? "text-ink-900" : "text-ink-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={clsx("h-3.5 w-3.5 text-ink-400 transition-transform shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-md bg-white border border-line shadow-overlay py-1 animate-popIn"
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-[12px] text-ink-400">Aucune option</div>
          )}
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === activeIndex;
            return (
              <button
                type="button"
                key={o.value}
                disabled={o.disabled}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[13px] cursor-pointer",
                  "transition-colors duration-100",
                  isActive ? "bg-ink-100 text-ink-900" : "text-ink-800",
                  o.disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                <span className={clsx("h-3.5 w-3.5 shrink-0", !isSelected && "invisible")}>
                  <Check className="h-3.5 w-3.5 text-brand-600" />
                </span>
                <span className="flex-1 min-w-0 truncate">{o.label}</span>
                {o.hint && <span className="text-[11px] text-ink-400">{o.hint}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
