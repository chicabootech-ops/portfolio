"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
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

const policyLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
];

export function Footer() {
  const pathname = usePathname();
  const { data: sections = [] } = useCollections();
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const shopLinks = [
    { label: "All Collections", href: "/" },
    ...sections.slice(0, 4).map((s) => ({ label: s.name, href: `/section/${s.slug}` })),
  ];
  if (HIDDEN_ROUTES.has(pathname)) return null;

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNewsletterMessage("");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    const data = await response?.json().catch(() => ({}));
    setNewsletterMessage(
      data?.message ?? (response?.ok ? "Check your inbox to confirm." : "Please try again.")
    );
    if (response?.ok) setEmail("");
    setSubmitting(false);
  }

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
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-full border border-border/60 bg-white/70 px-4 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Joining…" : "Join"}
            </button>
          </form>
          {newsletterMessage ? (
            <p className="mt-2 text-xs text-muted-foreground">{newsletterMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Chic A Boo. Crafted with love in India.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
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
