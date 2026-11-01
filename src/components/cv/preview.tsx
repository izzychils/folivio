"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CvSheet, SHEET_HEIGHT, SHEET_WIDTH } from "./sheet";
import type { CV } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CvPreview({
  cv,
  zoom,
  className,
  padding = 24,
  showShadow = true,
}: {
  cv: CV;
  zoom?: number;
  className?: string;
  padding?: number;
  showShadow?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.55);
  const [sheetHeight, setSheetHeight] = useState(SHEET_HEIGHT);
  const [userZoom, setUserZoom] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const measure = () => {
      const available = element.clientWidth - padding * 2;
      setFit(Math.max(0.22, Math.min(1, available / SHEET_WIDTH)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [padding]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const measure = () => setSheetHeight(sheet.offsetHeight || SHEET_HEIGHT);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [cv]);

  const activeZoom = userZoom ?? zoom ?? fit;

  return (
    <div
      ref={frameRef}
      className={cn("relative h-full w-full overflow-auto bg-[hsl(var(--surface))]", className)}
    >
      <div
        className="mx-auto"
        style={{
          width: SHEET_WIDTH * activeZoom,
          height: sheetHeight * activeZoom,
          marginTop: padding,
          marginBottom: padding,
        }}
      >
        <div
          style={{
            width: SHEET_WIDTH,
            transform: `scale(${activeZoom})`,
            transformOrigin: "top left",
            boxShadow: showShadow ? "var(--shadow-sheet)" : "none",
          }}
        >
          <div ref={sheetRef}>
            <CvSheet cv={cv} />
          </div>
        </div>
      </div>
      <ZoomControl
        value={activeZoom}
        pages={Math.max(1, Math.ceil(sheetHeight / SHEET_HEIGHT))}
        onChange={(next) => setUserZoom(next)}
        onFit={() => setUserZoom(null)}
      />
    </div>
  );
}

function ZoomControl({
  value,
  pages,
  onChange,
  onFit,
}: {
  value: number;
  pages: number;
  onChange: (value: number) => void;
  onFit: () => void;
}) {
  return (
    <div className="no-print sticky bottom-3 left-1/2 z-10 mt-3 flex w-fit -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-card/95 px-1.5 py-1 shadow-[var(--shadow-sm)] backdrop-blur">
      <button
        type="button"
        onClick={() => onChange(Math.max(0.25, Math.round((value - 0.1) * 100) / 100))}
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        aria-label="Zoom out"
      >
        <span className="text-[14px] leading-none">-</span>
      </button>
      <button
        type="button"
        onClick={onFit}
        className="num rounded-full px-1.5 text-[10.5px] text-muted transition-colors hover:text-ink"
        aria-label="Fit to width"
      >
        {Math.round(value * 100)}%
      </button>
      <button
        type="button"
        onClick={() => onChange(Math.min(1.4, Math.round((value + 0.1) * 100) / 100))}
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        aria-label="Zoom in"
      >
        <span className="text-[14px] leading-none">+</span>
      </button>
      <span className="mx-0.5 h-3 w-px bg-line" aria-hidden />
      <span className="num pr-1.5 text-[9.5px] text-muted">
        {pages} {pages === 1 ? "page" : "pages"}
      </span>
    </div>
  );
}

export function CvThumbnail({
  cv,
  width = 200,
  className,
}: {
  cv: CV;
  width?: number;
  className?: string;
}) {
  const scale = width / SHEET_WIDTH;
  return (
    <div
      className={cn("relative overflow-hidden bg-white", className)}
      style={{ width, height: SHEET_HEIGHT * scale }}
      aria-hidden
    >
      <div
        style={{
          width: SHEET_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
      >
        <CvSheet cv={cv} />
      </div>
    </div>
  );
}
