import { Badge } from "@/components/ui/Badge";

function formatText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function LegalPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: readonly { title: string; content: string }[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <Badge color="purple" className="mt-4">{lastUpdated}</Badge>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 text-xl font-bold">{section.title}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary">
              {section.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {formatText(paragraph)}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
