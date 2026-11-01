import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      className={cn("h-6 w-6", className)}
    >
      <path
        d="M4.5 2.5h12l6 6v17h-18z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M16.5 2.5v6h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 14h9" stroke="hsl(var(--accent))" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 18.5h6" stroke="hsl(var(--accent))" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <Mark className={markClassName} />
      <span className="display text-[23px] leading-none tracking-[-0.03em]">
        folivio<span className="text-[hsl(var(--accent))]">.</span>
      </span>
    </span>
  );
}
