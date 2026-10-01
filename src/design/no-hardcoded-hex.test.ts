import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Colour lives in src/app/globals.css only. Components and pages reference
 * tokens (Tailwind utilities or CSS variables), never a hex literal.
 */

const SRC = path.resolve(import.meta.dirname, "..");

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(full);
    return entry.name.endsWith(".tsx") ? [full] : [];
  });
}

/** #rgb, #rgba, #rrggbb, #rrggbbaa, not preceded by a word char or `&`. */
const HEX_LITERAL =
  /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;

export function hexLiterals(source: string): string[] {
  return source.match(HEX_LITERAL) ?? [];
}

describe("hexLiterals", () => {
  it("finds colours and ignores anchors", () => {
    expect(hexLiterals('className="bg-[#1A1A2E] text-[#fff]"')).toEqual([
      "#1A1A2E",
      "#fff",
    ]);
    expect(hexLiterals('href="#faq" href="#contact" href="#add-ons"')).toEqual(
      [],
    );
  });
});

describe("no hardcoded hex colour in TSX", () => {
  const files = [
    ...tsxFiles(path.join(SRC, "components")),
    ...tsxFiles(path.join(SRC, "app")),
  ];

  it("scans a non-empty set of files", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files.map((file) => [path.relative(SRC, file), file]))(
    "%s",
    (_name, file) => {
      expect(hexLiterals(readFileSync(file, "utf8"))).toEqual([]);
    },
  );
});
