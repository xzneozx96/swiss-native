import { createFileRoute } from "@tanstack/react-router";

import { PassesIndexPage } from "@/features/discovery/components/pass-pages";

export const Route = createFileRoute("/_guest/passes/")({
  component: PassesIndexPage,
});
