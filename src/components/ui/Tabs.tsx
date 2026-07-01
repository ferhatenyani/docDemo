"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (k: string) => void;
  className?: string;
  variant?: "pill" | "underline" | "segmented";
}

export function Tabs({ tabs, active, onChange, className, variant = "underline" }: Props) {
  if (variant === "underline") {
    return (
      <div className={clsx("flex gap-5 border-b border-line overflow-x-auto no-scrollbar", className)}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={clsx(
              "relative py-2.5 text-[13px] font-medium cursor-pointer transition-colors whitespace-nowrap tracking-crisp",
              active === t.key ? "text-ink-900" : "text-ink-500 hover:text-ink-800",
            )}
          >
            <span className="flex items-center gap-1.5">
              {t.icon}
              {t.label}
              {typeof t.count === "number" && (
                <span className={clsx(
                  "text-[10px] rounded-sm px-1.5 py-0.5 tabular font-semibold",
                  active === t.key ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600",
                )}>{t.count}</span>
              )}
            </span>
            {active === t.key && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ink-900" />
            )}
          </button>
        ))}
      </div>
    );
  }
  if (variant === "segmented") {
    return (
      <div className={clsx("inline-flex p-0.5 rounded-md bg-ink-100 border border-line gap-0.5", className)}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={clsx(
              "px-3 h-7 rounded-[4px] text-[12px] font-medium cursor-pointer transition-all",
              active === t.key
                ? "bg-white text-ink-900 shadow-xs"
                : "text-ink-500 hover:text-ink-800",
            )}
          >
            <span className="flex items-center gap-1.5">
              {t.icon}
              {t.label}
            </span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className={clsx("inline-flex p-0.5 rounded-md bg-ink-100 border border-line gap-0.5", className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={clsx(
            "px-3 h-7 rounded-[4px] text-[12px] font-medium cursor-pointer transition-all",
            active === t.key
              ? "bg-white text-ink-900 shadow-xs"
              : "text-ink-500 hover:text-ink-800",
          )}
        >
          <span className="flex items-center gap-1.5">
            {t.icon}
            {t.label}
            {typeof t.count === "number" && (
              <span className="text-[10px] rounded-sm bg-ink-100 text-ink-600 px-1 py-0.5">{t.count}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
