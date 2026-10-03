import Image from "next/image";
import { PhoneFrame } from "./PhoneFrame";
import { TiltOnPointer } from "./TiltOnPointer";

/** Inclinaison de repos du téléphone, en degrés (le suivi du pointeur s'ajoute). */
const PHONE_REST_ROTATE = 5;

/**
 * La scène du héros : la vraie capture de l'app dans le téléphone incliné, et l'icône
 * de l'app qui chevauche son coin haut-gauche. Le fond est celui de la bande qui la
 * porte (la scène photo du héros), jamais le sien. Sur mobile, le parent peut faire
 * déborder le téléphone sur la bande suivante (marge négative `-mb-24`), qui lui laisse
 * la place (`pt-40` sur la bande suivante, `pb-0 sm:pb-section` sur celle du héros ;
 * voir `phone-stage-floor.test.ts`).
 * `priority` ne se pose que si cette capture est l'image LCP de la page : sur /cerebrum
 * c'est la scène photo qui l'est, la capture charge donc paresseusement (défaut).
 */
export function PhoneStage({
  screenSrc,
  screenAlt,
  icon,
  priority = false,
  className = "",
}: {
  screenSrc: string;
  /** Description de la capture, localisée. */
  screenAlt: string;
  icon: string;
  /** `true` si la capture est l'élément LCP de la page. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative isolate mx-auto w-full max-w-[12rem] min-[420px]:max-w-[15rem] sm:max-w-[17rem] lg:max-w-[19rem] ${className}`}
    >
      <TiltOnPointer>
        <PhoneFrame
          src={screenSrc}
          alt={screenAlt}
          priority={priority}
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
