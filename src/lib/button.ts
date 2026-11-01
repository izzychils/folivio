import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[hsl(var(--accent))] text-[hsl(var(--paper))] hover:bg-[hsl(var(--accent-hover))] shadow-[0_1px_2px_rgb(0_0_0/0.12)]",
  secondary:
    "bg-card text-ink border border-line hover:border-[hsl(var(--muted))]/45 hover:bg-surface",
  ghost: "text-ink hover:bg-[hsl(var(--accent))]/8",
  subtle: "bg-accent-soft text-accent-ink hover:bg-[hsl(var(--accent))]/16",
  danger: "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger))]/16",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[12px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-[13px] gap-2 rounded-[10px]",
  lg: "h-12 px-6 text-[14px] gap-2 rounded-xl",
};

/**
 * Pure class builder, kept outside the client component file so server
 * components can style a Link like a button without importing client code.
 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}
