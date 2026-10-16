import { setMusic, useMusic } from "@/components/background-music-store";
import { MusicIcon } from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";

/**
 * Round ink trigger that opens the music player sheet, floating above the tab bar's right end.
 * While the track plays the icon fills. Still, so there is nothing to animate and nothing for
 * prefers-reduced-motion to switch off.
 */
export function MusicLauncher() {
  const { t } = useLocale();
  const { playing, sheetOpen } = useMusic();

  return (
    <button
      data-music-ui
      aria-expanded={sheetOpen}
      aria-haspopup="dialog"
      aria-label={t("music.title")}
      className="pointer-events-auto mr-1 flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-overlay outline-none transition-transform focus-visible:focus-ring active:scale-95"
      type="button"
      onClick={() => setMusic({ sheetOpen: true })}
    >
      <MusicIcon
        aria-hidden
        size={22}
        weight={playing ? "Filled" : "Outline"}
      />
    </button>
  );
}
