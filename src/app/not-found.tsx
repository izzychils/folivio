import Link from "next/link";
import { Wordmark } from "@/components/ui/logo";
import { buttonClass } from "@/lib/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" aria-label="Folivio home">
          <Wordmark />
        </Link>
        <Link href="/auth/sign-in" className={buttonClass("secondary", "sm")}>
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="max-w-[520px]">
          <p className="eyebrow mb-3">404</p>
          <h1 className="display text-[44px] leading-[1.02] sm:text-[56px]">
            This page is not in the document.
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            The address may be wrong, or the page may have moved. Your workspace and documents are
            untouched.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/" className={buttonClass("primary", "md")}>
              Back to the site
            </Link>
            <Link href="/dashboard" className={buttonClass("secondary", "md")}>
              Open workspace
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-line px-5 py-5 sm:px-8">
        <p className="text-[10px] text-muted">Folivio. Your experience deserves better presentation.</p>
      </footer>
    </div>
  );
}
