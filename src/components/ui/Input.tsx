"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, required, className, children }: FieldProps) {
  return (
    <label className={clsx("flex flex-col gap-1", className)}>
      {label && (
        <span className="text-[12px] font-medium text-ink-700">
          {label} {required && <span className="text-danger">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="text-[11px] text-danger">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-ink-400">{hint}</span>
      ) : null}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leftIcon, rightSlot, invalid, ...rest },
  ref,
) {
  return (
    <div
      className={clsx(
        "group flex items-center gap-2 rounded-md bg-white border border-line",
        "transition-all duration-150 h-9 px-2.5",
        "focus-within:border-brand-500 focus-within:shadow-ring",
        invalid && "border-danger focus-within:border-danger focus-within:shadow-ring-danger",
        className,
      )}
    >
      {leftIcon && <span className="text-ink-400 shrink-0">{leftIcon}</span>}
      <input
        ref={ref}
        className={clsx(
          "flex-1 bg-transparent outline-none text-[13px] text-ink-900 placeholder:text-ink-400 min-w-0 tracking-crisp",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        {...rest}
      />
      {rightSlot}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(
        "w-full rounded-md bg-white border border-line px-2.5 py-2 text-[13px] leading-relaxed",
        "outline-none transition-all duration-150 placeholder:text-ink-400 resize-y tracking-crisp",
        "focus:border-brand-500 focus:shadow-ring",
        invalid && "border-danger",
        className,
      )}
      {...rest}
    />
  );
});
