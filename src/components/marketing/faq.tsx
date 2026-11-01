"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    question: "Will the AI invent experience for me?",
    answer:
      "No. The engine only structures, rewords and reorders what you provide. It can suggest that a section needs a number, but it will not supply one. Degrees, employers, dates, certifications and achievements are never generated.",
  },
  {
    question: "Can I bring an existing CV?",
    answer:
      "Yes. Paste the text or load a .txt or .md file and Folivio reads the headings, roles, dates and skills into a structured document. PDF and Word import arrive with the hosted backend, because reading those formats properly needs a server.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In this browser, and nowhere else. This preview build has no backend and no analytics. You can export the whole workspace as JSON from settings, and delete it from the same screen.",
  },
  {
    question: "How many CV versions can I make?",
    answer:
      "As many as you need. Each version is a separate document with its own target role, style and history. Tailoring one for a job application never rewrites the others.",
  },
  {
    question: "What formats can I download?",
    answer:
      "PDF through your browser's print dialog, a self-contained HTML file, or plain text. All three are produced from the same document, so nothing shifts between them.",
  },
  {
    question: "Does this work for academic and executive CVs?",
    answer:
      "Yes. Quarto is a dense single-column academic layout, Boardroom is an executive brief with a leadership narrative, and the other four cover modern, classic, creative and technical expectations.",
  },
  {
    question: "What happens when the backend lands?",
    answer:
      "Accounts, CVs and portfolios move to a real server, so a portfolio link renders for anyone and documents sync across devices. The data model in this build is already shaped for that move.",
  },
];

export function MarketingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[hsl(var(--line))] border-y border-line">
      {ITEMS.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(active ? null : index)}
              aria-expanded={active}
              className="flex w-full items-center justify-between gap-6 py-4 text-left"
            >
              <span className="text-[13.5px] font-medium text-ink">{item.question}</span>
              <Plus
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200",
                  active && "rotate-45",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[720px] pb-5 pr-8 text-[12.5px] leading-relaxed text-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
