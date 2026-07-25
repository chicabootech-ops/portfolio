"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Sparkles } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";

function InstagramGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

const HIDDEN_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
]);

const companyLinks = [
  { label: "About the Founders", href: "/about" },
  { label: "Track Order", href: "/track-order" },
  { label: "My Account", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
];

export function Footer() {
  const pathname = usePathname();
  const { data: sections = [] } = useCollections();
  const shopLinks = [
    { label: "All Collections", href: "/" },
    ...sections.slice(0, 4).map((s) => ({ label: s.name, href: `/section/${s.slug}` })),
  ];
  if (HIDDEN_ROUTES.has(pathname)) return null;

  return (
    <footer className="mt-auto border-t border-border/40 bg-secondary/20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="font-logo text-2xl font-medium tracking-wide text-primary">
            Chic A Boo
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Two sisters, one sanctuary for beautiful things — handcrafted crochet blooms,
            keepsakes, and magazines made to be cherished.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/50 bg-white/60 text-foreground/70 transition hover:border-primary hover:text-primary"
            >
              <InstagramGlyph size={16} />
            </a>
            <a
              href="mailto:hello@chicaboo.co"
              aria-label="Email us"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/50 bg-white/60 text-foreground/70 transition hover:border-primary hover:text-primary"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Company" links={companyLinks} />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Stay in the loop
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            Little joys, new blooms and stories — straight to your inbox.
          </p>
          <a
            href="mailto:hello@chicaboo.co?subject=Keep%20me%20posted"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Sparkles size={15} /> Say hello
          </a>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Chic A Boo. Crafted with love in India.</p>
          <p>Secure payments via Razorpay · UPI · Cards · Netbanking</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
