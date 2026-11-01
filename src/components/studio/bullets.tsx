"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Sparkles, Trash2, X } from "lucide-react";
import { rewriteBullet } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export function BulletsEditor({
  items,
  onChange,
  placeholder = "What changed because of this work? Numbers help.",
  addLabel = "Add achievement",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const [openRewrite, setOpenRewrite] = useState<number | null>(null);
  const variants = openRewrite === null ? [] : rewriteBullet(items[openRewrite] ?? "");

  const replace = (index: number, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="group">
          <div className="flex items-start gap-1">
            <span className="mt-[15px] h-1 w-1 shrink-0 rounded-full bg-accent/60" />
            <textarea
              value={item}
              rows={2}
              onChange={(event) => replace(index, event.target.value)}
              placeholder={placeholder}
              className="field min-h-[52px] resize-y py-2 text-[12px] leading-relaxed"
            />
            <div className="flex flex-col gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => setOpenRewrite(openRewrite === index ? null : index)}
                title="Suggest a stronger wording"
                aria-label="Rewrite this achievement"
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                  openRewrite === index
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface hover:text-ink",
                )}
              >
                <Sparkles className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                title="Remove"
                aria-label="Remove this achievement"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-[hsl(var(--danger))]/8 hover:text-[hsl(var(--danger))]"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <div className="flex gap-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...items];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    onChange(next);
                  }}
                  aria-label="Move up"
                  className="flex h-5 w-5 items-center justify-center rounded text-muted/60 transition-colors hover:text-ink disabled:opacity-25"
                >
                  <ArrowUp className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => {
                    const next = [...items];
                    [next[index + 1], next[index]] = [next[index], next[index + 1]];
                    onChange(next);
                  }}
                  aria-label="Move down"
                  className="flex h-5 w-5 items-center justify-center rounded text-muted/60 transition-colors hover:text-ink disabled:opacity-25"
                >
                  <ArrowDown className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          </div>

          {openRewrite === index && variants.length ? (
            <div className="ml-3 mt-1.5 overflow-hidden rounded-lg border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line-soft px-2.5 py-1.5">
                <span className="eyebrow text-[8.5px]">Reworded from your text</span>
                <button
                  type="button"
                  onClick={() => setOpenRewrite(null)}
                  aria-label="Close suggestions"
                  className="text-muted hover:text-ink"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <ul className="divide-y divide-[hsl(var(--line-soft))]">
                {variants.map((variant) => (
                  <li key={variant.label}>
                    <button
                      type="button"
                      onClick={() => {
                        replace(index, variant.text);
                        setOpenRewrite(null);
                      }}
                      className="block w-full px-2.5 py-2 text-left transition-colors hover:bg-card"
                    >
                      <span className="eyebrow mb-0.5 block text-[8px] text-accent">{variant.label}</span>
                      <span className="text-[11.5px] leading-relaxed text-ink">{variant.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-line-soft px-2.5 py-1.5 text-[9.5px] leading-snug text-muted">
                No new facts were added. Check that the number and the claim are yours.
              </p>
            </div>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-accent-ink transition-colors hover:bg-accent-soft"
      >
        <Plus className="h-3 w-3" /> {addLabel}
      </button>
    </div>
  );
}
