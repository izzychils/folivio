"use client";

import type { ReactNode } from "react";
import { AppShell, RequireAuth } from "@/components/shell/app-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
