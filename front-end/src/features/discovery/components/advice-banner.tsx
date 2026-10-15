import { buttonVariants } from "@heroui/react";

import { ArrowRightIcon } from "@/components/icons";
import { Media } from "@/components/media";
import { useLocale } from "@/contexts/locale-context";
import { shop } from "@/features/catalog/seed";

const copy = {
  en: {
    title: "Not sure where to start?",
    body: "Erich knows these passes, the house and the bees well. Tell him how you ride and what you are after, and he will answer with personal tips by email.",
    action: "Ask Erich",
    subject: "Help me plan",
    captions: ["Furka", "the stay", "the bees"],
  },
  de: {
    title: "Nicht sicher, wo Sie anfangen sollen?",
    body: "Erich kennt die Pässe, das Haus und die Bienen gut. Erzählen Sie ihm, wie Sie fahren und was Sie suchen, und er antwortet mit persönlichen Tipps per E-Mail.",
    action: "Erich fragen",
    subject: "Hilfe bei der Planung",
    captions: ["Furka", "das Haus", "die Bienen"],
  },
};

const shots = [
  { photo: "furka-pass-1", tilt: "-rotate-6", z: "z-0", x: "start-[2%]" },
  { photo: "finsterwald-1", tilt: "rotate-3", z: "z-10", x: "start-[29%]" },
  { photo: "finsterwald-6", tilt: "-rotate-2", z: "z-20", x: "start-[56%]" },
];

/**
 * Closing call to action on the home page: three tilted snapshots with captions,
 * centred text and one red primary action. It opens an email to Erich, who answers
 * himself, so no reply time is promised.
 */
export function AdviceBanner() {
  const { language } = useLocale();
  const c = copy[language];

  return (
    <section className="flex flex-col items-center gap-5 rounded-3xl bg-hero-cream px-5 pt-6 pb-6 text-center">
      <div aria-hidden className="relative h-40 w-full">
        {shots.map((s, i) => (
          <figure
            key={s.photo}
            className={`absolute top-0 ${s.x} ${s.tilt} ${s.z} flex w-[42%] flex-col gap-1 bg-white p-1.5 pb-2 shadow-overlay`}
          >
            <Media alt="" className="aspect-square" photo={s.photo} />
            <figcaption className="font-serif text-xs italic">
              {c.captions[i]}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex max-w-[30ch] flex-col gap-1.5">
        <h2 className="font-serif text-title text-balance">{c.title}</h2>
        <p className="text-sm text-foreground/75">{c.body}</p>
      </div>
      <a
        className={`${buttonVariants({ variant: "primary" })} transition-transform active:scale-[0.98]`}
        href={`mailto:${shop.email}?subject=${encodeURIComponent(c.subject)}`}
      >
        {c.action}
        <ArrowRightIcon size={18} />
      </a>
    </section>
  );
}
