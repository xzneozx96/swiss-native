import { Button } from "@heroui/react";
import { useState } from "react";

import { libraryPhotos } from "../lib/media-library";

import { SelectedIcon } from "@/components/icons";
import { InfoNote } from "@/components/info-note";
import { Media } from "@/components/media";
import { useLocale } from "@/contexts/locale-context";
import { SheetFrame } from "@/components/sheet-frame";

/** "furka-pass-1" → "furka pass", to name a photo without a caption. */
const readable = (slug: string) => slug.replace(/-\d+$/, "").replace(/-/g, " ");

/**
 * The cover or an inline photo, chosen from the shop's photo library: in the prototype the
 * library stands in for an upload so every choice renders.
 */
export function PhotoSheet({
  value,
  onChoose,
  onClose,
}: {
  value: string;
  onChoose: (photo: string) => void;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const [selected, setSelected] = useState(value);

  return (
    <SheetFrame
      isOpen
      footer={
        <>
          <Button
            fullWidth
            isDisabled={!selected}
            onPress={() => onChoose(selected)}
          >
            {t("photoSheet.use")}
          </Button>
          <Button fullWidth variant="tertiary" onPress={onClose}>
            {t("photoSheet.back")}
          </Button>
        </>
      }
      title={t("photoSheet.title")}
      onClose={onClose}
    >
      <InfoNote text={t("photoSheet.note")} />
      <ul className="grid grid-cols-3 gap-2">
        {libraryPhotos.map((slug) => {
          const isSelected = slug === selected;

          return (
            <li key={slug}>
              <button
                aria-label={readable(slug)}
                aria-pressed={isSelected}
                className={`relative block w-full overflow-hidden rounded-xl outline-none focus-visible:focus-ring ${
                  isSelected ? "ring-2 ring-foreground ring-offset-2" : ""
                }`}
                type="button"
                onClick={() => setSelected(slug)}
              >
                <Media alt="" className="aspect-square" photo={slug} />
                {isSelected && (
                  <SelectedIcon
                    aria-hidden
                    className="absolute end-1.5 top-1.5 rounded-full bg-surface text-foreground"
                    size={22}
                    weight="Filled"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </SheetFrame>
  );
}

/** A recording from the shop's audio library (prototype stand-in for an upload; R17). */
