import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "gradient-cta text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all",
  secondary:
    "gradient-purple text-white shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 hover:scale-[1.02] active:scale-[0.98] transition-all",
  outline:
    "border-2 border-primary text-primary hover:bg-primary/5 active:scale-[0.98] transition-all",
  ghost:
    "bg-text-primary/90 text-white backdrop-blur-sm shadow-lg shadow-black/10 hover:bg-text-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm rounded-xl",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-2xl",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps | LinkProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-bold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    return <a className={classes} {...(props as LinkProps)} />;
  }

  return <button className={classes} {...(props as ButtonProps)} />;
}
