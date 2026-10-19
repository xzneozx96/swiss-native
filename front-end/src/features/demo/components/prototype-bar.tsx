import type { Role } from '../types'
import type { Language } from '@/contexts/locale-context'

import {
  Button,
  Description,
  Drawer,
  Label,
  Radio,
  RadioGroup,
} from '@heroui/react'
// import { Link, useNavigate } from "@tanstack/react-router";
import { useNavigate } from '@tanstack/react-router'
import { lazy, Suspense, useState } from 'react'

import { PrototypeIcon, ResetIcon } from '@/components/icons'

// import { ProposalsToggle } from "./proposal-mark";

import { useLocale } from '@/contexts/locale-context'
// import { SignInDemoHint } from "@/features/auth/components/sign-in-demo-hint";
import { MailPanel } from '@/features/notifications/components/mail-panel'
import { useDemoActions, useDemoSelector } from '../demo-store'
// import { TourBookingDemoControl } from "@/features/tours/booking/booking-demo-control";
// import { ToursDemoControl } from "@/features/tours/discovery/tours-demo-control";
// import { TourDemoControl } from "@/features/tours/merchant/tour-demo-control";

const QRCodeSVG = lazy(() =>
  import('qrcode.react').then(m => ({ default: m.QRCodeSVG })),
)

/**
 * Presenter controls, deliberately outside the product design: an ink strip with a
 * monospace "Prototype" label. Copy stays in English because it is not part of the product.
 */
const roles: {
  id: Role
  label: string
  detail: string
  home: '/' | '/store'
}[] = [
  {
    id: 'guest',
    label: 'Guest',
    detail: 'Erich Haldi, browsing the tours',
    home: '/',
  },
  {
    id: 'owner',
    label: 'Host',
    detail: 'Erich Haldi, dashboard',
    home: '/store',
  },
]

const languages: { id: Language, label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
]

export function PrototypeBar() {
  const { setRole, reset } = useDemoActions()
  const role = useDemoSelector(s => s.role)
  const { language, setLanguage } = useLocale()
  const navigate = useNavigate()
  const current = roles.find(r => r.id === role) ?? roles[0]
  const [open, setOpen] = useState(false)
  const [showQr, setShowQr] = useState(false)

  const chooseRole = (value: string) => {
    const next = roles.find(r => r.id === value)

    if (!next)
      return
    setRole(next.id)
    setOpen(false)
    void navigate({ to: next.home })
  }

  // Scanning the QR code opens the site directly, as a guest on the home page.
  const openFromQr = () => {
    setRole('guest')
    setOpen(false)
    setShowQr(false)
    void navigate({ to: '/' })
  }

  // Hash routing, so the scannable link is this deployment's address, ending at the home page.
  const siteUrl = `${window.location.origin}${window.location.pathname}`

  return (
    <div
      aria-label="Prototype controls"
      className="flex items-center gap-2 bg-foreground px-4 py-1.5 pt-[calc(env(safe-area-inset-top,0px)+6px)] text-xs text-white"
      role="region"
    >
      <span className="flex shrink-0 items-center gap-1.5 font-mono tracking-wide uppercase opacity-80">
        <PrototypeIcon size={14} />
        Prototype
      </span>

      <Drawer isOpen={open} onOpenChange={setOpen}>
        <Button
          className="ms-auto h-7 min-w-0 rounded-full bg-white/12 px-3 text-xs text-white"
          size="sm"
          variant="ghost"
        >
          <span className="truncate">{current.label}</span>
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="bottom">
            <Drawer.Dialog>
              <Drawer.Handle />
              <Drawer.Header>
                <Drawer.Heading>Prototype controls</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="flex flex-col gap-6">
                <RadioGroup
                  name="role"
                  value={role}
                  onChange={chooseRole}
                >
                  <Label>View as</Label>
                  {roles.map(role => (
                    <Radio key={role.id} value={role.id}>
                      <Radio.Content>
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        {role.label}
                      </Radio.Content>
                      <Description>{role.detail}</Description>
                    </Radio>
                  ))}
                </RadioGroup>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Arrive as a guest</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={showQr ? 'secondary' : 'tertiary'}
                      onPress={() => setShowQr(!showQr)}
                    >
                      Via QR code
                    </Button>
                  </div>
                  {showQr && (
                    <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-4 text-center">
                      <Suspense
                        fallback={
                          <div className="aspect-square w-full max-w-56" />
                        }
                      >
                        <QRCodeSVG
                          aria-label="QR code that opens the site"
                          className="h-auto w-full max-w-56"
                          level="M"
                          marginSize={2}
                          size={224}
                          value={siteUrl}
                        />
                      </Suspense>
                      <p className="max-w-full text-xs break-all text-muted">
                        {siteUrl}
                      </p>
                      <Button size="sm" variant="tertiary" onPress={openFromQr}>
                        Open on this device
                      </Button>
                    </div>
                  )}
                </div>
                {/* Hidden for the client demo: only the role and QR sections show.
                <p className="text-sm text-muted">
                  Sample photos are credited on the{" "}
                  <Link
                    className="underline underline-offset-4"
                    to="/credits"
                    onClick={() => setOpen(false)}
                  >
                    photo credits page
                  </Link>
                  .
                </p>
                <TourBookingDemoControl onDone={() => setOpen(false)} />
                <ToursDemoControl onDone={() => setOpen(false)} />
                <TourDemoControl onDone={() => setOpen(false)} />
                <ProposalsToggle />
                <SignInDemoHint />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Demo data</p>
                  <p className="text-sm text-muted">
                    Everything you do is kept in this browser. Reset restores
                    the sample bookings and restarts the demo clock at 13.10.2026,
                    10:00.
                  </p>
                </div>
                */}
              </Drawer.Body>
              <Drawer.Footer>
                <Button slot="close" variant="tertiary">
                  Close
                </Button>
                <Button slot="close" variant="secondary" onPress={reset}>
                  <ResetIcon size={20} />
                  Reset demo
                </Button>
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      <MailPanel />

      <div
        aria-label="Language"
        className="flex rounded-full bg-white/12 p-0.5"
        role="group"
      >
        {languages.map(l => (
          <button
            key={l.id}
            aria-pressed={language === l.id}
            className={`h-6 rounded-full px-2.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-white ${
              language === l.id ? 'bg-white text-foreground' : 'text-white/80'
            }`}
            type="button"
            onClick={() => setLanguage(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  )
}
