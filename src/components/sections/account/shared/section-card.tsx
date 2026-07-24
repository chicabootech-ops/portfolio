import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function SectionCard({
  title,
  action,
  children,
  className,
  id,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-2xl border border-border/30 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:p-5",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-base font-semibold text-foreground md:text-lg">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
