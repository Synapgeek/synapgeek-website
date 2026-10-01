/**
 * Bande de faits vérifiés : une valeur courte et son libellé, côte à côte.
 * `<dl>` : le libellé (dt) précède la valeur (dd) dans le DOM, l'ordre visuel
 * est inversé en CSS. Pas de chiffre héros : la valeur reste de la taille d'un
 * sous-titre, elle nomme un fait, elle ne le met pas en scène.
 */
export function FactStrip({
  facts,
  className = "",
}: {
  facts: ReadonlyArray<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-x-8 gap-y-6 ${className}`}
    >
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="flex flex-col-reverse justify-end gap-1 border-t border-current/20 pt-4"
        >
          <dt className="text-sm font-semibold opacity-80">{fact.label}</dt>
          <dd className="font-display text-xl leading-snug font-bold">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
