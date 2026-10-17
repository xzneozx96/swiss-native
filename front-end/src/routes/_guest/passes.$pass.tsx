import { Navigate, createFileRoute } from "@tanstack/react-router";

import { PassStoryPage } from "@/features/discovery/components/pass-pages";
import { isPassId } from "@/features/discovery/pass-stories";

export const Route = createFileRoute("/_guest/passes/$pass")({
  component: Page,
});

function Page() {
  const { pass } = Route.useParams();

  return isPassId(pass) ? (
    <PassStoryPage id={pass} />
  ) : (
    <Navigate replace to="/passes" />
  );
}
