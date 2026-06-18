import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border/50 bg-secondary/20 px-4 py-10 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-5 h-11 min-h-[44px] rounded-full px-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
      {actionLabel && onAction && !actionHref ? (
        <Button
          type="button"
          onClick={onAction}
          className="mt-5 h-11 min-h-[44px] rounded-full px-6"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
