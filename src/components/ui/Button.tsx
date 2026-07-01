"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const base = clsx(
    "inline-flex items-center justify-center gap-1.5 select-none font-medium tracking-crisp",
    "transition-all duration-150 ease-apple rounded-md whitespace-nowrap",
    "active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
    fullWidth && "w-full",
  );

  const sizes: Record<Size, string> = {
    sm: "h-7 px-2.5 text-[12px]",
    md: "h-9 px-3.5 text-[13px]",
    lg: "h-11 px-5 text-[14px]",
    icon: "h-9 w-9 p-0",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-brand-600 text-white shadow-xs hover:bg-brand-700",
    dark:
      "bg-ink-900 text-white shadow-xs hover:bg-ink-800",
    secondary:
      "bg-white text-ink-800 border border-line hover:border-line-strong hover:bg-ink-50",
    ghost:
      "bg-transparent text-ink-700 hover:bg-ink-100 hover:text-ink-900",
    subtle:
      "bg-ink-100 text-ink-800 hover:bg-ink-200",
    danger:
      "bg-danger text-white hover:brightness-95",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={clsx(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
