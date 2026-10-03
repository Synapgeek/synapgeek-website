import { InternalLink } from "./InternalLink";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/**
 * Le seul bouton du site : une pilule. Quatre variantes, deux tailles, jamais
 * une cinquième variante ailleurs.
 * - primary : l'action principale, encre sur vert (contraste AA) ;
 * - secondary : action d'appoint, encre sur lavis violet ;
 * - outline : action discrète, contour encre ;
 * - inverse : sur la section violet profond, blanc avec texte violet profond.
 * Cible tactile de 44 px au minimum ; l'anneau de focus est celui de
 * `globals.css` (violet, blanc sur la section violet profond).
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "inverse";
export type ButtonSize = "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-green text-ink shadow-rest hover:bg-[color-mix(in_srgb,var(--color-brand-green),var(--color-ink)_8%)] hover:shadow-raised",
  secondary:
    "bg-wash-violet text-ink hover:bg-[color-mix(in_srgb,var(--color-wash-violet),var(--color-brand-violet)_22%)]",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-canvas",
  inverse:
    "bg-canvas text-brand-violet-deep shadow-rest hover:bg-wash-violet hover:shadow-raised",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-14 px-8 text-base",
};

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonElementProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkElementProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonElementProps | LinkElementProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-pill font-bold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (props.href !== undefined) {
    const { href, target, rel, ...anchor } = props as LinkElementProps;
    // Chemin interne : next/link ; ancre, mailto ou URL externe : <a> natif.
    if (href.startsWith("/")) {
      return (
        <InternalLink
          href={href}
          target={target}
          rel={rel}
          className={classes}
          {...anchor}
        />
      );
    }
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classes}
        {...anchor}
      />
    );
  }

  const { type = "button", ...button } = props as ButtonElementProps;
  return <button type={type} className={classes} {...button} />;
}
