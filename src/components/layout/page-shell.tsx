import { PageBreadcrumb, type PageBreadcrumbItem } from "./page-breadcrumb";
import { cn } from "@/lib/utils";

type PageShellProps = {
  breadcrumbs: PageBreadcrumbItem[];
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageShell({
  breadcrumbs,
  title,
  description,
  children,
  className,
}: PageShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen pt-19 sm:pt-21 lg:pt-40 px-4 sm:px-6 md:px-8 pb-16",
        className
      )}
    >
      <PageBreadcrumb items={breadcrumbs} className="mb-6" />
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </main>
  );
}
