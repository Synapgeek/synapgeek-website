# Polices de l'image Open Graph

Lues au chargement du module par `src/app/[locale]/cerebrum/[game]/opengraph-image.tsx`
(`next/og` n'accepte que des polices statiques, pas les polices variables).

- `Fredoka-Bold.ttf` : instance statique (wght 700, wdth 100) de
  `ofl/fredoka/Fredoka[wdth,wght].ttf`, dépôt github.com/google/fonts.
- `Figtree-SemiBold.ttf` : instance statique (wght 600) de
  `ofl/figtree/Figtree[wght].ttf`, même dépôt.

Instances produites avec `python3 -m fontTools.varLib.instancer <variable>.ttf wght=… --update-name-table`.
Licence SIL Open Font License 1.1 : `OFL-Fredoka.txt`, `OFL-Figtree.txt`.
