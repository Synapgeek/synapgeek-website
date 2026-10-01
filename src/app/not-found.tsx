import { getDictionary } from "@/content";
import { pagePath } from "@/lib/routes";
import { NotFoundView } from "@/components/site/NotFoundView";
import { FONT_VARIABLES } from "./fonts";

/**
 * 404 racine, en anglais : le layout racine rend `children` nu, cette page pose
 * donc son propre `<html>` et ses polices. Elle sert les URLs qu'aucune route ne
 * reconnaît ; une page du segment `[locale]` qui lève `notFound()` rend la 404
 * localisée (`[locale]/not-found.tsx`).
 */
export default function NotFound() {
  const dict = getDictionary("en").common;

  return (
    <html lang="en">
      <body className={`${FONT_VARIABLES} antialiased`}>
        <main className="flex min-h-screen flex-col justify-center">
          <NotFoundView {...dict.notFound} href={pagePath("home", "en")} />
        </main>
      </body>
    </html>
  );
}
