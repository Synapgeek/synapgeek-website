export function Badge({
  children,
  color = "green",
  className = "",
}: {
  children: React.ReactNode;
  color?: "green" | "purple" | "blue" | "yellow";
  className?: string;
}) {
  const colors = {
    green: "bg-primary/10 text-primary-dark border-primary/20",
    purple: "bg-secondary/10 text-secondary border-secondary/20",
    blue: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    yellow: "bg-accent-yellow/10 text-amber-700 border-accent-yellow/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
