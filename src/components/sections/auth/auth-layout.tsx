import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
};

export function AuthLayout({
  title,
  subtitle,
  breadcrumbLabel,
  children,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-screen items-center justify-center px-6 py-12 md:px-8",
        className
      )}
    >
      <PageBreadcrumb
        className="absolute top-6 left-6 md:top-8 md:left-8"
        items={[
          { label: "Home", href: "/" },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block font-serif italic text-primary text-2xl md:text-3xl font-medium tracking-wide hover:opacity-80 transition-opacity"
          >
            {siteConfig.name}
          </Link>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
            {`— ${title} —`}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-border/30 bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
          {children}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </div>
    </main>
  );
}
