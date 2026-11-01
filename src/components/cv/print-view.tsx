"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CvSheet } from "./sheet";
import type { CV } from "@/lib/types";
import { readSession, readWorkspace } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export function PrintView({ cvId }: { cvId: string }) {
  const [cv, setCv] = useState<CV | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let found: CV | null = null;
    try {
      const handoff = window.localStorage.getItem(`folivio.v1.print.${cvId}`);
      if (handoff) found = JSON.parse(handoff) as CV;
    } catch {
      found = null;
    }
    if (!found) {
      const session = readSession();
      if (session) {
        const workspace = readWorkspace(session.userId);
        found = workspace?.cvs.find((item) => item.id === cvId) ?? null;
      }
    }
    if (found) {
      setCv(found);
      const shouldPrint = new URLSearchParams(window.location.search).get("auto") === "1";
      if (!shouldPrint) return;
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
    setMissing(true);
  }, [cvId]);

  if (missing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <p className="display text-[28px]">This document is not available.</p>
        <p className="max-w-sm text-[12.5px] text-muted">
          Open it from the studio and use Download PDF again. The print view reads the document from
          this browser.
        </p>
        <Link href="/dashboard/studio">
          <Button variant="secondary">Back to the studio</Button>
        </Link>
      </div>
    );
  }

  if (!cv) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-[#efede6] print:bg-white">
      <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-2.5 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={`/studio/${cv.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:text-ink"
            aria-label="Back to the editor"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-ink">{cv.title}</p>
            <p className="text-[10px] text-muted">A4, 210 x 297 mm. Choose Save as PDF in the print dialog.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" /> Print or save
        </Button>
      </div>

      <div className="flex justify-center p-6 print:p-0">
        <div className="print-sheet bg-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.4)]">
          <CvSheet cv={cv} />
        </div>
      </div>
    </div>
  );
}
