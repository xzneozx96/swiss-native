import { buttonVariants } from "@heroui/react";

import { ArrowRightIcon } from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";
import { shop } from "@/features/catalog/seed";

const copy = {
  en: {
    title: "Where will your story start?",
    body: "Tell Erich how you ride and what you are after. He knows these passes, the house and the bees, and answers with personal tips by email.",
    action: "Ask Erich",
    subject: "Help me plan",
  },
  de: {
    title: "Wo beginnt Ihre Geschichte?",
    body: "Erzählen Sie Erich, wie Sie fahren und was Sie suchen. Er kennt die Pässe, das Haus und die Bienen und antwortet mit persönlichen Tipps per E-Mail.",
    action: "Erich fragen",
    subject: "Hilfe bei der Planung",
  },
};

/**
 * Closing call to action of the story home, set in white on the epilogue's dark scene:
 * centred title and text and one red primary action. It opens an email to Erich, who
 * answers himself, so no reply time is promised.
 */
export function AdviceBanner() {
  const { language } = useLocale();
  const c = copy[language];

  return (
    <div className="flex flex-col items-center gap-5 text-center text-white">
      <div className="flex max-w-[30ch] flex-col gap-2">
        <h2 className="font-serif text-[28px] leading-[34px] text-balance">
          {c.title}
        </h2>
        <p className="text-sm leading-[21px] text-white/80">{c.body}</p>
      </div>
      <a
        className={`${buttonVariants({ variant: "primary" })} transition-transform active:scale-[0.98]`}
        href={`mailto:${shop.email}?subject=${encodeURIComponent(c.subject)}`}
      >
        {c.action}
        <ArrowRightIcon size={16} />
      </a>
    </div>
  );
}
