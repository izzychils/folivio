"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, type LucideIcon } from "lucide-react";
import { cn, initials } from "@/lib/utils";

/* ── card ───────────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
  padded = true,
  flat = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  flat?: boolean;
}) {
  return (
    <div className={cn(flat ? "card-flat" : "card-paper", padded && "p-5", className)}>
      {children}
    </div>
  );
}

/* ── badges and chips ───────────────────────────────────────────────────── */

type BadgeTone = "neutral" | "accent" | "positive" | "warning" | "danger" | "outline";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface text-muted border-transparent",
  accent: "bg-accent-soft text-accent-ink border-transparent",
  positive: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-transparent",
  warning: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-transparent",
  danger: "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))] border-transparent",
  outline: "bg-transparent text-muted border-line",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em]",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  className,
  active = false,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px]",
        active ? "border-transparent bg-accent-soft text-accent-ink" : "border-line bg-card text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── figures ────────────────────────────────────────────────────────────── */

export function Stat({
  label,
  value,
  suffix,
  note,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  note?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="card-paper flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-[9.5px]">{label}</span>
        {Icon ? <Icon className="h-3.5 w-3.5 text-muted" strokeWidth={1.6} /> : null}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="num text-[26px] font-medium leading-none tracking-tight text-ink">{value}</span>
        {suffix ? <span className="text-[12px] text-muted">{suffix}</span> : null}
      </div>
      {note ? <p className="text-[11px] leading-snug text-muted">{note}</p> : null}
    </div>
  );
}

export function Meter({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "warning" | "danger";
}) {
  const color =
    tone === "warning"
      ? "hsl(var(--warning))"
      : tone === "danger"
        ? "hsl(var(--danger))"
        : "hsl(var(--accent))";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--line-soft))]", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

export function ScoreRing({
  value,
  size = 92,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const stroke = size > 80 ? 7 : 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const color =
    clamped >= 80
      ? "hsl(var(--accent))"
      : clamped >= 55
        ? "hsl(var(--warning))"
        : "hsl(var(--danger))";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--line-soft))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-[20px] font-medium leading-none text-ink">{clamped}</span>
        {label ? <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted">{label}</span> : null}
        {sublabel ? <span className="text-[9px] text-muted">{sublabel}</span> : null}
      </div>
    </div>
  );
}

/* ── page furniture ─────────────────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="text-[22px] font-medium tracking-[-0.02em] text-ink">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-line bg-surface/60 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-muted">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <h3 className="text-[15px] font-medium text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ── controls ───────────────────────────────────────────────────────────── */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  size = "md",
  className,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[10px] border border-line bg-surface p-0.5",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150",
              size === "sm" ? "h-7 px-2.5 text-[11.5px]" : "h-8 px-3 text-[12px]",
              active
                ? "bg-card text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span
                className={cn(
                  "num rounded-full px-1.5 text-[9.5px]",
                  active ? "bg-accent-soft text-accent-ink" : "bg-card/70 text-muted",
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({
  name,
  size = 34,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-medium text-accent-ink",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden
    >
      {initials(name || "Folivio")}
    </span>
  );
}

/* ── modal ──────────────────────────────────────────────────────────────── */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const width = size === "sm" ? "max-w-[420px]" : size === "lg" ? "max-w-[820px]" : "max-w-[560px]";

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[hsl(var(--ink))]/35 backdrop-blur-[2px] animate-[fade_200ms_ease_both]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 w-full rounded-[16px] border border-line bg-card shadow-[var(--shadow-lg)] animate-[rise_260ms_cubic-bezier(0.22,1,0.36,1)_both]",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-soft p-5">
          <div>
            <h2 className="text-[16px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
            {description ? <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children ? <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div> : null}
        {footer ? <div className="flex justify-end gap-2 border-t border-line-soft p-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export function IconButton({
  label,
  children,
  onClick,
  active,
  className,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
        active
          ? "border-transparent bg-accent-soft text-accent-ink"
          : "border-line bg-card text-muted hover:border-[hsl(var(--muted))]/40 hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
