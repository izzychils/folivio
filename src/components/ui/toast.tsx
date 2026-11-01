"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "error";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  tone: Tone;
};

type ToastContextValue = {
  toast: (input: { title: string; description?: string; tone?: Tone }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, tone = "default" }: { title: string; description?: string; tone?: Tone }) => {
      counter += 1;
      const id = counter;
      setItems((current) => [...current.slice(-2), { id, title, description, tone }]);
    },
    [],
  );

  useEffect(() => {
    if (!items.length) return;
    const timer = setTimeout(() => setItems((current) => current.slice(1)), 4200);
    return () => clearTimeout(timer);
  }, [items]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[120] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-card p-3.5 shadow-[var(--shadow-md)] animate-[rise_320ms_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                item.tone === "success" && "bg-accent-soft text-accent",
                item.tone === "error" && "bg-danger/10 text-danger",
                item.tone === "default" && "bg-surface text-muted",
              )}
            >
              {item.tone === "error" ? <Info className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-snug text-ink">{item.title}</p>
              {item.description ? (
                <p className="mt-0.5 text-[12px] leading-snug text-muted">{item.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
