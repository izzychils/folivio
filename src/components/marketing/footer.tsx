import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/ui/logo";
import { site } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Everything included", href: "/products" },
      { label: "CV studio", href: "/product" },
      { label: "Intelligence", href: "/intelligence" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Sign in", href: "/auth/sign-in" },
      { label: "Create account", href: "/auth/sign-up" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-[260px] text-[11.5px] leading-relaxed text-muted">
              Career intelligence for people whose experience deserves better presentation.
            </p>
            <p className="mt-4 text-[11px] font-medium text-ink">{site.companyLine}</p>
            <p className="mt-2 text-[11.5px] text-muted">
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-ink"
              >
                {site.email}
              </a>
              <br />
              {site.location}
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="eyebrow mb-3 text-[8.5px]">{column.title}</p>
              <ul className="space-y-2 text-[11.5px] text-muted">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p className="text-[10px] text-muted">
            © {new Date().getFullYear()} {site.company}. {site.name} is a product of {site.company}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] text-muted">{site.domain}</span>
            <Link href="/privacy" className="text-[10px] text-muted transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="text-[10px] text-muted transition-colors hover:text-ink">
              Terms
            </Link>
            <Link href="/auth/sign-up" className="inline-flex items-center gap-1 text-[10px] text-ink">
              Start free <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
