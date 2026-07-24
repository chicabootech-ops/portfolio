import { cn } from "@/lib/utils";

type AuthFormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthFormField({
  id,
  label,
  error,
  children,
  className,
}: AuthFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-widest text-foreground/80"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const authInputClassName =
  "w-full rounded-xl border border-border/40 bg-white/60 px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60";
