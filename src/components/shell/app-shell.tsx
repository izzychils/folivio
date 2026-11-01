"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Target,
  User,
  X,
} from "lucide-react";
import { useSession } from "@/lib/session";
import { useWorkspace } from "@/lib/workspace";
import { useTheme } from "@/lib/theme";
import { Avatar, Badge } from "@/components/ui/surface";
import { Wordmark } from "@/components/ui/logo";
import { cn, wordCount } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/studio", label: "CV studio", icon: FileText },
  { href: "/dashboard/profile", label: "Career profile", icon: User },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Globe },
  { href: "/dashboard/assistant", label: "Career assistant", icon: Sparkles },
  { href: "/dashboard/match", label: "Job match", icon: Target },
  { href: "/dashboard/letters", label: "Letters", icon: Mail },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/studio": "CV studio",
  "/dashboard/profile": "Career profile",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/assistant": "Career assistant",
  "/dashboard/match": "Job match",
  "/dashboard/letters": "Letters",
  "/dashboard/settings": "Settings",
};

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/auth/sign-in");
  }, [ready, user, router]);

  if (!ready || !user) return <BootScreen />;
  return <>{children}</>;
}

export function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-4">
        <Wordmark />
        <span className="h-[2px] w-24 overflow-hidden rounded-full bg-line">
          <span className="block h-full w-1/2 animate-[shimmer_1.1s_ease-in-out_infinite] bg-accent" />
        </span>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = PAGE_TITLES[pathname] ?? "Folivio";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex">
        <aside className="hidden w-[244px] shrink-0 border-r border-line bg-surface/60 lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <SidebarContent />
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-[hsl(var(--ink))]/40 backdrop-blur-[2px]"
            />
            <div className="absolute inset-y-0 left-0 w-[268px] border-r border-line bg-surface shadow-[var(--shadow-lg)] animate-[fade_180ms_ease_both]">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-line bg-paper/85 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-muted lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="hidden sm:block">
                <p className="eyebrow text-[9px]">Workspace</p>
                <p className="text-[13px] font-medium leading-tight text-ink">{title}</p>
              </div>
              <span className="text-[13px] font-medium text-ink sm:hidden">{title}</span>
            </div>
            <TopbarActions />
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { workspace } = useWorkspace();
  const { user } = useSession();
  const strength = profileStrength(workspace?.profile);

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-line px-4">
        <Link href="/dashboard" onClick={onNavigate} aria-label="Folivio dashboard">
          <Wordmark />
        </Link>
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-muted hover:bg-card hover:text-ink lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        <p className="eyebrow px-2 pb-2 text-[8.5px]">Build</p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] transition-colors",
                    active
                      ? "bg-accent-soft font-medium text-accent-ink"
                      : "text-muted hover:bg-card hover:text-ink",
                  )}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent" />
                  ) : null}
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="eyebrow px-2 pb-2 pt-5 text-[8.5px]">Account</p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/dashboard/settings"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] transition-colors",
                pathname === "/dashboard/settings"
                  ? "bg-accent-soft font-medium text-accent-ink"
                  : "text-muted hover:bg-card hover:text-ink",
              )}
            >
              <Settings className="h-4 w-4" strokeWidth={1.7} />
              Settings
            </Link>
          </li>
        </ul>

        {workspace?.portfolio.published ? (
          <Link
            href={`/p/${workspace.portfolio.slug}`}
            target="_blank"
            onClick={onNavigate}
            className="mt-5 block rounded-xl border border-line bg-card p-3 transition-colors hover:border-accent/40"
          >
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="eyebrow text-[8.5px] text-accent">Portfolio live</span>
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-ink">
              /p/{workspace.portfolio.slug}
              <ArrowUpRight className="h-3 w-3 text-muted" />
            </p>
          </Link>
        ) : null}
      </nav>

      <div className="border-t border-line p-3">
        <div className="rounded-xl border border-line bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[8.5px]">Profile</span>
            <span className="num text-[10px] text-muted">{strength}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line-soft">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${strength}%` }}
            />
          </div>
          <Link
            href="/dashboard/profile"
            onClick={onNavigate}
            className="mt-2.5 inline-flex items-center gap-1 text-[10.5px] text-muted transition-colors hover:text-ink"
          >
            {strength >= 80 ? "Keep it current" : "Finish your profile"}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {user ? (
          <Link
            href="/dashboard/settings"
            onClick={onNavigate}
            className="mt-2 flex items-center gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-card"
          >
            <Avatar name={user.name} size={28} />
            <span className="min-w-0">
              <span className="block truncate text-[11.5px] font-medium text-ink">{user.name}</span>
              <span className="block truncate text-[10px] text-muted">{user.email}</span>
            </span>
          </Link>
        ) : null}
      </div>
    </>
  );
}

function TopbarActions() {
  const { workspace } = useWorkspace();
  const { user, signOut } = useSession();
  const { resolved, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center gap-1.5">
      {workspace?.settings.sampleContent ? (
        <Link href="/dashboard/settings" className="hidden sm:block">
          <Badge tone="warning">Sample content</Badge>
        </Link>
      ) : null}
      <Link
        href="/dashboard/studio"
        className="hidden h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-[11.5px] text-muted transition-colors hover:border-[hsl(var(--muted))]/40 hover:text-ink sm:flex"
      >
        <FileText className="h-3.5 w-3.5" />
        {workspace?.cvs.length ?? 0} CVs
      </Link>
      <button
        type="button"
        onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:text-ink"
      >
        {resolved === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Account menu"
          aria-expanded={menuOpen}
          className="ml-0.5 rounded-full ring-offset-2 ring-offset-paper transition-shadow hover:ring-2 hover:ring-line"
        >
          <Avatar name={user?.name ?? "Folivio"} size={30} />
        </button>
        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close account menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] cursor-default"
            />
            <div className="absolute right-0 top-10 z-[70] w-[232px] rounded-xl border border-line bg-card p-1.5 shadow-[var(--shadow-lg)] animate-[rise_160ms_ease_both]">
              <div className="border-b border-line-soft px-2.5 py-2">
                <p className="truncate text-[12px] font-medium text-ink">{user?.name}</p>
                <p className="truncate text-[10.5px] text-muted">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <Settings className="h-3.5 w-3.5" /> Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                  router.push("/");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function profileStrength(profile?: {
  contact?: { fullName?: string; email?: string; phone?: string; location?: string };
  summary?: string;
  experience?: unknown[];
  education?: unknown[];
  skills?: unknown[];
  projects?: unknown[];
}): number {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.contact?.fullName),
    Boolean(profile.contact?.email),
    Boolean(profile.contact?.phone),
    Boolean(profile.contact?.location),
    wordCount(profile.summary ?? "") >= 30,
    (profile.experience?.length ?? 0) > 0,
    (profile.education?.length ?? 0) > 0,
    (profile.skills?.length ?? 0) > 0,
    (profile.projects?.length ?? 0) > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
