import { Badge } from "@/components/ui/Badge";

const linkClasses = "text-primary underline hover:text-primary/80";

function formatText(text: string): React.ReactNode[] {
  // First pass: bold
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  const withBold: React.ReactNode[] = boldParts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`b${i}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });

  // Second pass: auto-link URLs and emails in remaining string fragments
  const result: React.ReactNode[] = [];
  const linkPattern = /(https?:\/\/[^\s),]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  for (const node of withBold) {
    if (typeof node !== "string") {
      result.push(node);
      continue;
    }

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    linkPattern.lastIndex = 0;

    while ((match = linkPattern.exec(node)) !== null) {
      if (match.index > lastIndex) {
        result.push(node.slice(lastIndex, match.index));
      }
      const value = match[0];
      const isEmail = value.includes("@") && !value.startsWith("http");
      result.push(
        isEmail ? (
          <a key={`l${match.index}`} href={`mailto:${value}`} className={linkClasses}>
            {value}
          </a>
        ) : (
          <a
            key={`l${match.index}`}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            {value}
          </a>
        ),
      );
      lastIndex = match.index + value.length;
    }

    if (lastIndex < node.length) {
      result.push(node.slice(lastIndex));
    }
  }

  return result;
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
