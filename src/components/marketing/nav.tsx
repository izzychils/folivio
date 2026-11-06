"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/ui/logo";
import { buttonClass } from "@/lib/button";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/#intelligence", label: "Intelligence" },
  { href: "/#templates", label: "Templates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/#pricing", label: "Pricing" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-line bg-paper/88 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="Folivio home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[12px] text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <Link href="/dashboard" className={buttonClass("primary", "sm")}>
              Open workspace <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <>
              <Link href="/auth/sign-in" className={buttonClass("ghost", "sm")}>
                Sign in
              </Link>
              <Link href="/auth/sign-up" className={buttonClass("primary", "sm")}>
                Start free <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-muted sm:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper px-5 py-4 sm:hidden">
          <div className="grid gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-[13px] text-ink hover:bg-surface"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/auth/sign-in" className={buttonClass("secondary", "md", "flex-1")}>
              Sign in
            </Link>
            <Link href="/auth/sign-up" className={buttonClass("primary", "md", "flex-1")}>
              Start free
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
