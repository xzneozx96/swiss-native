import type { Tour, TourKind } from "@/features/tours/types";

import { useNavigate } from "@tanstack/react-router";

import { ChoiceSheet } from "@/components/choice-sheet";
import { useLocale } from "@/contexts/locale-context";
import {
  TourSelectionBody,
  useTourSelection,
} from "@/features/tours/discovery/tour-selection-sheet";
import { useTours } from "@/features/tours/hooks/use-tours";
import { findListing } from "@/features/tours/lib/selectors";
import { pickText } from "@/lib/localized";

/**
 * The home page's booking sheet for the stay and the bee-house experience: the tour sheet's
 * body over the same booking draft, opened by local state on the home page, not by a route.
 */
export function ListingBookingSheet({
  kind,
  isOpen,
  onClose,
}: {
  kind: Exclude<TourKind, "tour">;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data } = useTours();
  const listing = findListing(data, kind);

  if (!listing) return null;

  return <ListingSheet isOpen={isOpen} listing={listing} onClose={onClose} />;
}

function ListingSheet({
  listing,
  isOpen,
  onClose,
}: {
  listing: Tour;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, language } = useLocale();
  const navigate = useNavigate();
  const selection = useTourSelection(listing, isOpen);
  const isStay = listing.kind === "stay";

  return (
    <ChoiceSheet
      action={{
        label: selection.reviewLabel,
        isDisabled: !selection.valid,
        onPress: () =>
          void navigate({
            to: "/tours/$slug/book/review",
            params: { slug: listing.slug },
          }),
      }}
      closeLabel={t("tourDiscovery.close")}
      isOpen={isOpen}
      title={pickText(listing.name, language).text}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <TourSelectionBody
        departuresLabel={isStay ? t("tourDiscovery.checkIn") : undefined}
        intro={isStay ? undefined : t("tourDiscovery.firstSeason")}
        selection={selection}
        tour={listing}
      />
    </ChoiceSheet>
  );
}
