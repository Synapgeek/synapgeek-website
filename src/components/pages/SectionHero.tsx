import Image from "next/image";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/site/Breadcrumbs";
import { SectionBand } from "@/components/ui/SectionBand";

/**
 * Premier écran d'une page de section (À propos, Presse) : fil d'Ariane, H1,
 * phrase de définition, et une marque sur un lavis. L'image est décorative : le
 * texte porte tout le sens.
 */
export function SectionHero({
  breadcrumbs,
  breadcrumbLabel,
  h1,
  definition,
  mark,
}: {
  breadcrumbs: readonly BreadcrumbItem[];
  breadcrumbLabel: string;
  h1: string;
  definition: string;
  /** Image de marque : logo du studio ou icône de l'app. */
  mark: { src: string; rounded?: boolean };
}) {
  return (
    <SectionBand
      enter={false}
      className="relative overflow-hidden pt-6 sm:pt-10 lg:pt-14"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <Breadcrumbs
            items={breadcrumbs}
            label={breadcrumbLabel}
            className="mb-5 sm:mb-8"
          />
          <h1 className="text-5xl leading-none tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            {h1}
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed sm:mt-6 sm:text-xl">
            {definition}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="relative isolate mx-auto flex aspect-square w-full max-w-64 items-center justify-center lg:max-w-80"
        >
          <span className="absolute inset-0 -z-10 rounded-[42%_58%_55%_45%/55%_40%_60%_45%] bg-wash-green" />
          <span className="absolute -right-[8%] bottom-[2%] -z-10 size-[46%] rounded-[55%_45%_35%_65%/40%_60%_40%_60%] bg-wash-violet" />
          <Image
            src={mark.src}
            alt=""
            width={256}
            height={256}
            sizes="(min-width: 1024px) 14rem, 10rem"
            priority
            className={`size-[62%] ${mark.rounded ? "rounded-[22%] shadow-raised" : ""}`}
          />
        </div>
      </div>
    </SectionBand>
  );
}
