import Image from "next/image";
import { PhoneFrame } from "./PhoneFrame";
import { TiltOnPointer } from "./TiltOnPointer";

/** Inclinaison de repos du téléphone, en degrés (le suivi du pointeur s'ajoute). */
const PHONE_REST_ROTATE = 5;

/**
 * La scène du héros : la vraie capture de l'app dans le téléphone incliné, l'icône
 * de l'app qui chevauche son coin haut-gauche, et derrière, le ciel aquarelle du
 * thème Breeze de l'app. Le ciel est un champ doux (bords fondus, pas de rectangle),
 * décoratif, posé en image de fond d'un pseudo-élément. Chrome RETIENT ce fond comme
 * candidat LCP, sur sa taille intrinsèque : la capture reste l'élément LCP uniquement
 * parce que le ciel est servi à 240 px de large, plus petit que la capture (un ciel de
 * 576 px est devenu le LCP : 3,9 s, performance 88). Ne jamais le remplacer par une
 * version plus grande (voir `.breeze-field` dans globals.css). Sur mobile,
 * le parent peut faire déborder le téléphone sur la bande
 * suivante (marge négative `-mb-24`), qui lui laisse la place. Le ciel, lui, ne
 * déborde jamais : sa couche (`.breeze-clip`) est découpée au bord bas de la bande du
 * héros, pour que le titre de la bande suivante reste en encre pleine sur son propre
 * fond, et un masque vertical l'efface avant ce bord, qui ne laisse donc aucune arête
 * rectiligne. Ce bord suppose `-mb-24 sm:mb-0` sur le téléphone et `pb-0 sm:pb-section` sur
 * la bande (voir `.breeze-clip` dans globals.css et `phone-stage-floor.test.ts`).
 */
export function PhoneStage({
  screenSrc,
  screenAlt,
  icon,
  className = "",
}: {
  screenSrc: string;
  /** Description de la capture, localisée. */
  screenAlt: string;
  icon: string;
  className?: string;
}) {
  return (
    <div
      className={`relative isolate mx-auto w-full max-w-[12rem] min-[420px]:max-w-[15rem] sm:max-w-[17rem] lg:max-w-[19rem] ${className}`}
    >
      <span aria-hidden="true" className="breeze-clip pointer-events-none">
        <span className="breeze-field absolute top-1/2 left-1/2 aspect-[960/1239] w-[240%] -translate-x-1/2 -translate-y-1/2" />
      </span>
      <TiltOnPointer>
        <PhoneFrame
          src={screenSrc}
          alt={screenAlt}
          priority
          sizes="(min-width: 1024px) 304px, (min-width: 640px) 272px, 240px"
          rotate={PHONE_REST_ROTATE}
        />
      </TiltOnPointer>
      <Image
        src={icon}
        alt=""
        width={128}
        height={128}
        sizes="(min-width: 1024px) 128px, 96px"
        className="absolute -top-5 -left-8 size-24 rounded-[22%] shadow-raised sm:-left-12 lg:size-32"
      />
    </div>
  );
}
