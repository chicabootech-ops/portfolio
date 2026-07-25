import { PageShell } from "@/components/layout/page-shell";

export type PolicySection = { title: string; body: string };

export function PolicyPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: PolicySection[];
}) {
  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      title={title}
      description={description}
    >
      <div className="mt-10 max-w-3xl space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
        <p className="border-t border-border/40 pt-6 text-sm text-muted-foreground">
          Questions? Email{" "}
          <a className="text-primary hover:underline" href="mailto:hello@chicaboo.co">
            hello@chicaboo.co
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
