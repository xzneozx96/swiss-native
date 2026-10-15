import type {
  ListingChoice,
  PickerFormat,
  SlotModel,
} from "./listing-picker/model";
import type { Tour, TourKind } from "@/features/tours/types";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  DeparturePicker,
  PickerSummary,
} from "./listing-picker/departure-picker";
import {
  useLocalSlotStore,
  usePickerFormat,
  useSlotChoice,
  useSlotModel,
  useStayBooking,
} from "./listing-picker/model";

import { ChoiceSheet } from "@/components/choice-sheet";
import { useLocale } from "@/contexts/locale-context";
import { useTourActions, useTours } from "@/features/tours/hooks/use-tours";
import { findListing } from "@/features/tours/lib/selectors";

/**
 * The home page's booking sheet for the stay and the bee-house experience, opened by local
 * state on the home page, not by a route. A month grid opens on the month of the choice, with
 * month chips to jump past empty months: the stay picks a range of nights, the visit a day and
 * then a start time. Continue writes the booking draft and opens the review.
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
  // Each opening starts from the current seats and the draft, not from the last visit.
  const [session, setSession] = useState({ open: isOpen, count: 0 });

  if (session.open !== isOpen)
    setSession({ open: isOpen, count: session.count + (isOpen ? 1 : 0) });
  if (!listing) return null;

  return listing.kind === "stay" ? (
    <StaySheet
      key={session.count}
      isOpen={isOpen}
      listing={listing}
      onClose={onClose}
    />
  ) : (
    <VisitSheet
      key={session.count}
      isOpen={isOpen}
      listing={listing}
      onClose={onClose}
    />
  );
}

interface SheetProps {
  listing: Tour;
  isOpen: boolean;
  onClose: () => void;
}

function StaySheet(props: SheetProps) {
  const model = useSlotModel(props.listing);
  const f = usePickerFormat(model.today);
  const choice = useStayBooking(model, f);

  return <PickerSheet {...props} choice={choice} f={f} model={model} />;
}

function VisitSheet(props: SheetProps) {
  const model = useSlotModel(props.listing);
  const f = usePickerFormat(model.today);
  const choice = useSlotChoice(model, f, useLocalSlotStore(model));

  return <PickerSheet {...props} choice={choice} f={f} model={model} />;
}

function PickerSheet({
  listing,
  isOpen,
  onClose,
  model,
  choice,
  f,
}: SheetProps & {
  model: SlotModel;
  choice: ListingChoice;
  f: PickerFormat;
}) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { updateDraft } = useTourActions();
  const proceed = () => {
    const nightIds = choice.kind === "stay" ? choice.nightIds : undefined;

    updateDraft({
      tourId: listing.id,
      departureId: choice.kind === "stay" ? choice.nightIds[0] : choice.slotId,
      nightIds,
      adults: choice.group.adults,
      children: choice.group.children,
      infants: choice.group.infants,
    });
    void navigate({
      to: "/tours/$slug/book/review",
      params: { slug: listing.slug },
    });
  };

  return (
    <ChoiceSheet
      action={{
        label: f.t("review", { total: f.money(choice.total) }),
        isDisabled: !choice.valid,
        onPress: proceed,
      }}
      closeLabel={t("tourDiscovery.close")}
      isOpen={isOpen}
      summary={<PickerSummary choice={choice} f={f} />}
      title={f.name(listing)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DeparturePicker
        choice={choice}
        config={{
          note:
            listing.kind === "experience"
              ? t("tourDiscovery.firstSeason")
              : undefined,
        }}
        f={f}
        model={model}
      />
    </ChoiceSheet>
  );
}
