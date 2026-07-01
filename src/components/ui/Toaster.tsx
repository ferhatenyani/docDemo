"use client";

import { useApp } from "@/lib/store";
import clsx from "clsx";
import { CheckCircle2, AlertCircle, XCircle, X, Info } from "lucide-react";

export function Toaster() {
  const toasts = useApp((s) => s.toasts);
  const dismiss = useApp((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[200] bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const icon = t.tone === "success"
          ? <CheckCircle2 className="h-4 w-4 text-success" />
          : t.tone === "danger"
            ? <XCircle className="h-4 w-4 text-danger" />
            : t.tone === "warning"
              ? <AlertCircle className="h-4 w-4 text-warning" />
              : <Info className="h-4 w-4 text-info" />;
        return (
          <div
            key={t.id}
            className={clsx(
              "pointer-events-auto animate-slideUp",
              "w-full sm:min-w-[320px] sm:max-w-md",
              "rounded-md bg-white shadow-overlay border border-line px-3 py-2.5",
              "flex items-start gap-2.5",
            )}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink-900 tracking-crisp">{t.title}</div>
              {t.description && <div className="text-[12px] text-ink-500 mt-0.5">{t.description}</div>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Fermer"
              className="h-6 w-6 rounded-md grid place-items-center text-ink-400 hover:bg-ink-100 hover:text-ink-700 cursor-pointer -mr-1 -mt-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
