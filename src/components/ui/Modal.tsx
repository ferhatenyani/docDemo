"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { X } from "lucide-react";
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  hideClose?: boolean;
}

export function Modal({
  open, onClose, title, description, children, footer,
  size = "md", hideClose,
}: Props) {
  const t = useT();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const sizeCls: Record<NonNullable<Props["size"]>, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100vw-32px)] h-[calc(100dvh-32px)]",
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-[3px] animate-fadeIn"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Dialog"}
        className={clsx(
          "relative w-full bg-white rounded-lg shadow-overlay flex flex-col overflow-hidden border border-line",
          "animate-slideUp",
          sizeCls[size],
          "max-h-[calc(100dvh-32px)]",
        )}
      >
        {(title || description || !hideClose) && (
          <header className="flex items-start gap-3 px-5 pt-4 pb-3 border-b border-line">
            <div className="flex-1 min-w-0">
              {title && <div className="text-[15px] font-semibold text-ink-900 tracking-crisp">{title}</div>}
              {description && <div className="text-[12px] text-ink-500 mt-0.5">{description}</div>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label={t("close")}
                className="h-8 w-8 grid place-items-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-800 cursor-pointer transition-colors -me-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </header>
        )}
        <div className="flex-1 min-h-0 overflow-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="border-t border-line px-5 py-3 flex items-center justify-end gap-2 bg-surface-muted">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
