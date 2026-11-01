"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn("field h-[42px]", className)} {...props} />;
  },
);

export function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("field h-[42px] pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-ink"
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </span>
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn("field min-h-24 resize-y", className)} {...props} />;
  },
);

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <span className="relative block">
      <select
        ref={ref}
        className={cn("field h-[42px] appearance-none pr-9", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
      />
    </span>
  );
});

export function Label({
  children,
  hint,
  htmlFor,
  className,
}: {
  children: ReactNode;
  hint?: string;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-1.5 flex items-baseline justify-between gap-3", className)}>
      <label htmlFor={htmlFor} className="eyebrow text-[9.5px] text-muted">
        {children}
      </label>
      {hint ? <span className="text-[10.5px] text-muted/80">{hint}</span> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const fieldId = useId();
  let content = children;

  // Attach the label to a single control. Composite children keep the visible
  // label and are described by it, but cannot take an id themselves.
  if (label && isValidElement(children)) {
    const element = children as ReactElement<{ id?: string }>;
    content = cloneElement(element, { id: element.props.id ?? fieldId });
  }

  return (
    <div className={className}>
      {label ? (
        <Label htmlFor={fieldId} hint={hint}>
          {label}
        </Label>
      ) : null}
      {content}
      {error ? <p className="mt-1.5 text-[11.5px] text-[hsl(var(--danger))]">{error}</p> : null}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  id?: string;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={fieldId} className="block cursor-pointer text-[13px] font-medium text-ink">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      <button
        id={fieldId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-[22px] w-[38px] shrink-0 rounded-full border transition-colors duration-200",
          checked
            ? "border-transparent bg-[hsl(var(--accent))]"
            : "border-line bg-[hsl(var(--line-soft))]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 h-[16px] w-[16px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-200",
            checked ? "left-[19px]" : "left-[2px]",
          )}
        />
      </button>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex items-start gap-2.5 text-left"
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
          checked
            ? "border-transparent bg-[hsl(var(--accent))] text-[hsl(var(--paper))]"
            : "border-line bg-card group-hover:border-[hsl(var(--muted))]/60",
        )}
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden>
            <path d="M2 6.2 4.6 8.8 10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span className="text-[12.5px] leading-snug text-ink">{label}</span>
    </button>
  );
}

export function ChipInput({
  values,
  onChange,
  placeholder = "Type and press Enter",
  tone = "neutral",
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  tone?: "neutral" | "accent";
}) {
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const parts = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...values];
    for (const part of parts) {
      if (!next.some((item) => item.toLowerCase() === part.toLowerCase())) next.push(part);
    }
    onChange(next);
    setDraft("");
  };

  return (
    <div className="field flex min-h-[42px] flex-wrap items-center gap-1.5 px-2 py-1.5 focus-within:border-[hsl(var(--accent))]/75 focus-within:shadow-[0_0_0_3px_hsl(var(--accent)/0.1)]">
      {values.map((value) => (
        <span
          key={value}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px]",
            tone === "accent" ? "bg-accent-soft text-accent-ink" : "bg-surface text-ink",
          )}
        >
          {value}
          <button
            type="button"
            aria-label={`Remove ${value}`}
            onClick={() => onChange(values.filter((item) => item !== value))}
            className="rounded-sm p-0.5 text-muted transition-colors hover:text-ink"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            commit(draft);
          }
          if (event.key === "Backspace" && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={() => commit(draft)}
        placeholder={values.length ? "" : placeholder}
        className="min-w-[90px] flex-1 border-0 bg-transparent px-1 text-[12.5px] text-ink placeholder:text-muted/70 focus:outline-none"
      />
    </div>
  );
}
