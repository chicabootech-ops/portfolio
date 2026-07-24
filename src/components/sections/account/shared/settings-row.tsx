import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsRowProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
};

export function SettingsRow({
  icon,
  label,
  href,
  onClick,
  trailing,
  destructive,
}: SettingsRowProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary",
          destructive && "bg-destructive/10 text-destructive"
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "flex-1 text-left text-sm font-medium",
          destructive ? "text-destructive" : "text-foreground"
        )}
      >
        {label}
      </span>
      {trailing ?? (
        <ChevronRight
          size={18}
          className="shrink-0 text-muted-foreground"
          aria-hidden
        />
      )}
    </>
  );

  const className =
    "flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      {content}
    </button>
  );
}
