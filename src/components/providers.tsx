"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
import { SessionProvider } from "@/lib/session";
import { WorkspaceProvider } from "@/lib/workspace";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SessionProvider>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </SessionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
