# Icônes des images Open Graph

`next/og` (satori) ne décode pas le webp : ces PNG de 360×360 sont les icônes
`public/images/games/<id>-v3.webp` redimensionnées (Lanczos, Pillow) et
recompressées, une par jeu du registre. Elles ne sont jamais servies telles
quelles : `src/app/[locale]/cerebrum/[game]/opengraph-image.tsx` les incruste
dans l'image Open Graph de la page du jeu. Un test vérifie que chaque jeu du
registre a la sienne.
