const colors = [
  "text-primary",
  "text-secondary",
  "text-accent-blue",
  "text-accent-orange",
];

export function Stats({
  items,
}: {
  items: readonly { value: string; label: string }[];
}) {
  return (
    <section className="relative -mt-1 bg-white py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={item.label} className="text-center">
            <p className={`text-4xl font-extrabold ${colors[i % colors.length]}`}>
              {item.value}
            </p>
            <p className="mt-1 text-sm font-medium text-text-secondary">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
