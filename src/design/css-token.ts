const HEX = /^#[0-9a-f]{6}$/i;

/**
 * Valeur de `--name` dans un source CSS, en suivant les alias `var(--autre)`.
 * Fonction pure : l'appelant lit globals.css (les tests via `import.meta`, le
 * rendu des images Open Graph via `process.cwd()`), qui reste la source
 * unique des couleurs.
 */
export function parseToken(css: string, name: string): string {
  const match = new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(css);
  if (!match) throw new Error(`Token ${name} is not defined in globals.css`);
  const value = match[1].trim();
  const alias = /^var\((--[\w-]+)\)$/.exec(value);
  if (alias) return parseToken(css, alias[1]);
  if (!HEX.test(value)) {
    throw new Error(`Token ${name} is not a #rrggbb colour: ${value}`);
  }
  return value.toLowerCase();
}
