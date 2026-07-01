"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

interface DropdownProps {
  trigger: ReactNode;
  align?: "start" | "end";
  className?: string;
  children: (close: () => void) => ReactNode;
}

export function Dropdown({ trigger, align = "end", className, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, [open]);

  return (
    <div ref={root} className={clsx("relative inline-block", className)}>
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div
          className={clsx(
            "absolute z-40 mt-1 min-w-[220px] rounded-md bg-white border border-line shadow-overlay py-1 animate-popIn",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

interface ItemProps {
  onClick?: () => void;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function DropdownItem({ onClick, icon, destructive, disabled, children }: ItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[13px] cursor-pointer",
        "transition-colors duration-100",
        destructive ? "text-danger hover:bg-danger-soft" : "text-ink-800 hover:bg-ink-100",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      {icon && <span className={clsx("h-3.5 w-3.5 shrink-0", destructive ? "text-danger" : "text-ink-500")}>{icon}</span>}
      <span className="flex-1 min-w-0 truncate">{children}</span>
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-line" />;
}
