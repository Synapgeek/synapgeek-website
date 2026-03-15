export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={`mb-14 ${align === "center" ? "mx-auto max-w-2xl text-center" : "text-left"} ${className}`}
    >
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
