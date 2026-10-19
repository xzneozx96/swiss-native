import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'

import { PlannerChat } from '@/features/planner/components/planner-chat'

// The trip assistant demo: the raised button in the tab bar opens it.
export const Route = createFileRoute('/_guest/plan')({
  // The composer is sticky in the screen's own flow, so the shell reserves no tab-bar space.
  staticData: { hideTabBar: true, ownsBottomSpace: true },
  component: PlanPage,
})

function PlanPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const canGoBack = useCanGoBack()

  return (
    <PlannerChat
      onLeave={() =>
        canGoBack ? router.history.back() : void navigate({ to: '/' })}
    />
  )
}
