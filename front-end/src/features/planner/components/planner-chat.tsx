import type { ReactNode } from 'react'

import type { Plan } from '../lib/plan'
import type { StepStatus } from '@/components/ai-elements/chain-of-thought'
import { useChat } from '@ai-sdk/react'
import { Chip } from '@heroui/react'

import { useNavigate } from '@tanstack/react-router'
import {

  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,

} from '@/components/ai-elements/chain-of-thought'
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation'

import { ToolInput, ToolOutput } from '@/components/ai-elements/tool'
import { AssistantIcon } from '@/components/icons'

import { BackButton } from '@/components/layout/top-bar-buttons'
import { useLocale } from '@/contexts/locale-context'
import { usePrivateTour } from '@/features/requests/hooks/use-private-tour'
import { ui } from '../lib/copy'
import { getChat, hooks, resetChat, saveMessages } from '../lib/session'
import { ItineraryCard } from './itinerary-card'
import {
  Group,
  NextPicker,
  PartyPicker,
  RidePicker,
  Row,
  StayPicker,
  WhenPicker,
} from './pickers'

const PICKERS = {
  ask_ride: RidePicker,
  ask_party: PartyPicker,
  ask_when: WhenPicker,
  ask_stay: StayPicker,
  ask_next: NextPicker,
} as const

type ToolState
  = 'input-streaming' | 'input-available' | 'output-available' | 'output-error'

interface ToolPart {
  type: string
  toolCallId: string
  state: ToolState
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  callProviderMetadata?: { planner?: { ms?: number } }
}

type TraceStep
  = | { kind: 'reasoning', key: string, text: string, status: StepStatus }
    | {
      kind: 'tool'
      key: string
      id: string
      name: string
      status: StepStatus
      part: ToolPart
    }

function toolStatus(s: ToolState): StepStatus {
  return s === 'input-streaming'
    ? 'pending'
    : s === 'input-available'
      ? 'active'
      : s === 'output-error'
        ? 'error'
        : 'complete'
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`

/** A finished tool call's title with how long it took; the time travels on the streamed message. */
function toolLabel(
  step: Extract<TraceStep, { kind: 'tool' }>,
  titles: Record<string, string>,
) {
  const title = titles[step.name] ?? step.name
  const ms = step.part.state === 'output-available'
    ? step.part.callProviderMetadata?.planner?.ms
    : undefined

  return ms === undefined ? title : `${title} · ${seconds(ms)}`
}

/** The assistant speaks as plain text, with no bubble. */
function Assistant({ children }: { children: ReactNode }) {
  return (
    <p className="animate-rise text-body leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
      {children}
    </p>
  )
}

/** The guest's reply, a light bubble on the right. */
function Guest({ children }: { children: ReactNode }) {
  return (
    <div className="animate-rise flex justify-end">
      <div className="max-w-[82%] rounded-3xl bg-default px-4 py-2.5 text-body [overflow-wrap:anywhere]">
        {children}
      </div>
    </div>
  )
}

function Thinking({ label }: { label: string }) {
  return (
    <div
      aria-label={label}
      className="animate-rise flex gap-1 py-2"
      role="status"
    >
      {[0, 150, 300].map(d => (
        <span
          key={d}
          aria-hidden
          className="size-1.5 rounded-full bg-muted motion-safe:animate-bounce"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  )
}

/**
 * One collapsible trace per run of reasoning and tool calls (the agentic-rag ChainOfThought):
 * open and shimmering while the agent works, collapsed to a one-line summary afterwards.
 */
function TracePanel({
  steps,
  streaming,
}: {
  steps: TraceStep[]
  streaming: boolean
}) {
  const t = ui[useLocale().language]
  const [open, setOpen] = useState(streaming)
  const [startedAt] = useState(() => Date.now())
  const [sawStreaming, setSawStreaming] = useState(streaming)
  const [wasStreaming, setWasStreaming] = useState(streaming)
  const [elapsed, setElapsed] = useState(0)
  const tools = steps.filter(s => s.kind === 'tool').length

  // A new run of thinking opens the panel again, whatever the guest did with it before.
  if (streaming !== wasStreaming) {
    setWasStreaming(streaming)
    if (streaming) {
      setSawStreaming(true)
      setOpen(true)
    }
  }

  useEffect(() => {
    if (streaming)
      return
    const ended = Date.now()
    const frame = requestAnimationFrame(() =>
      setElapsed(Math.max(1, Math.round((ended - startedAt) / 1000))),
    )
    const timer = window.setTimeout(setOpen, 600, false)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [streaming, startedAt])

  const done = sawStreaming ? t.thoughtFor(elapsed) : t.thought
  const label = streaming
    ? t.thinking
    : `${done}${tools ? ` · ${t.toolCalls(tools)}` : ''}`

  return (
    <ChainOfThought open={open} onOpenChange={setOpen}>
      <ChainOfThoughtHeader isStreaming={streaming} label={label} />
      <ChainOfThoughtContent>
        {steps.map((step, i) =>
          step.kind === 'reasoning'
            ? (
                <ChainOfThoughtStep
                  key={step.key}
                  description={step.text}
                  isLast={i === steps.length - 1}
                  label={step.status === 'active' ? t.thinking : t.thought}
                  status={step.status}
                />
              )
            : (
                <ChainOfThoughtStep
                  key={step.key}
                  autoExpand={false}
                  isLast={i === steps.length - 1}
                  label={toolLabel(step, t.tools)}
                  status={step.status}
                >
                  <div className="space-y-2">
                    {step.part.input != null && (
                      <ToolInput input={step.part.input} />
                    )}
                    {step.part.output != null && (
                      <ToolOutput output={step.part.output} />
                    )}
                  </div>
                </ChainOfThoughtStep>
              ),
        )}
      </ChainOfThoughtContent>
    </ChainOfThought>
  )
}

/** The assistant's avatar: the brand gradient with the twinkling sparkle. */
function AssistantAvatar() {
  return (
    <span
      aria-hidden
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-assistant text-white"
    >
      <span className="inline-flex animate-sparkle">
        <AssistantIcon size={20} weight="Filled" />
      </span>
    </span>
  )
}

/** The trip assistant's header: back, avatar, name with the AI label, Erich. */
function AssistantHeader({ onBack }: { onBack: () => void }) {
  const { language, t: tr } = useLocale()
  const t = ui[language]

  return (
    <header className="z-20 flex shrink-0 items-center gap-3 border-b border-separator/70 bg-background px-4 pt-[calc(env(safe-area-inset-top,0px)+10px)] pb-3">
      <BackButton label={t.back} onPress={onBack} />
      <AssistantAvatar />
      <div className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2 font-semibold">
          {t.title}
          <Chip size="sm" variant="secondary">
            <Chip.Label>{t.ai}</Chip.Label>
          </Chip>
        </span>
        <span className="truncate text-xs text-muted">{tr('app.name')}</span>
      </div>
    </header>
  )
}

/**
 * The trip assistant demo: a real AI SDK chat whose transport is scripted. The model's
 * thinking, its tool calls and its questions all arrive as streamed message parts, so the
 * guest sees an agent at work; every question is a tool the guest answers by picking.
 * The chat lives outside this component, so closing the assistant keeps the conversation.
 */
export function PlannerChat({ onLeave }: { onLeave: () => void }) {
  const navigate = useNavigate()
  const { language } = useLocale()
  const t = ui[language]
  const { send, defaultEmail } = usePrivateTour()

  // The scripted chat lives outside this component and calls back into it, so the handlers are
  // registered after render, and again when the language or the guest's email changes.
  useEffect(() => {
    hooks.language = () => language
    hooks.createInquiry = ({ riders, dateFrom, dateTo, note }) => {
      const result = send({
        groupSize: riders,
        dateFrom,
        dateTo,
        interests: note,
        email: defaultEmail || 'demo.guest@example.com',
      })

      return result.ok ? result.requestId : ''
    }
  }, [language, send, defaultEmail])

  const [chat, setChat] = useState(getChat)
  // The scripted answer arrives a word at a time; the screen redraws at most every 50 ms.
  const { messages, sendMessage, addToolOutput, status } = useChat({
    chat,
    experimental_throttle: 50,
  })

  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const root = rootRef.current

      root?.style.setProperty('--chat-top', `${root.getBoundingClientRect().top}px`)
    }

    window.scrollTo(0, 0)
    measure()
    window.addEventListener('resize', measure)

    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (status === 'ready')
      saveMessages(messages)
  }, [messages, status])

  const lastBuildId = useMemo(
    () =>
      messages
        .flatMap(m => m.parts)
        .filter(p => p.type === 'tool-build_itinerary')
        .map(p => (p as unknown as ToolPart).toolCallId)
        .at(-1),
    [messages],
  )

  const busy = status === 'submitted' || status === 'streaming'

  const card = (part: ToolPart): ReactNode => {
    const name = part.type.slice(5)

    if (part.state !== 'output-available')
      return null
    if (name === 'build_itinerary' && part.toolCallId === lastBuildId)
      return <ItineraryCard plan={part.output as unknown as Plan} />
    if (name === 'create_inquiry') {
      return (
        <div className="animate-rise flex w-full flex-col gap-1 rounded-3xl bg-surface p-4 shadow-surface">
          <p className="font-medium">{t.sent}</p>
        </div>
      )
    }

    return null
  }

  const renderAsk = (part: ToolPart): ReactNode => {
    const name = part.type.slice(5)
    const Picker = PICKERS[name as keyof typeof PICKERS]

    if (!Picker)
      return null
    if (part.state === 'output-available')
      return <Guest>{String(part.output?.label ?? '')}</Guest>
    if (part.state !== 'input-available')
      return null

    return (
      <Picker
        disabled={busy}
        input={part.input ?? {}}
        onSubmit={(output) => {
          const id = String(output.id ?? '')

          if (name === 'ask_next' && id === 'tours') {
            void navigate({ to: '/tours' })

            return
          }
          if (name === 'ask_next' && id === 'passes') {
            void navigate({ to: '/passes' })

            return
          }
          void addToolOutput({
            tool: name,
            toolCallId: part.toolCallId,
            output,
          })
        }}
      />
    )
  }

  const renderAssistant = (
    message: (typeof messages)[number],
    isLast: boolean,
  ) => {
    const nodes: ReactNode[] = []
    let steps: TraceStep[] = []
    let cards: ReactNode[] = []

    const flush = (tail: boolean) => {
      if (steps.length) {
        const active = steps.some(
          s => s.status === 'active' || s.status === 'pending',
        )

        nodes.push(
          <TracePanel
            key={`trace-${steps[0].key}`}
            steps={steps}
            streaming={active || (tail && isLast && busy)}
          />,
        )
      }
      cards.forEach((c, i) =>
        nodes.push(<div key={`card-${steps[0]?.key}-${i}`}>{c}</div>),
      )
      steps = []
      cards = []
    }

    message.parts.forEach((p, i) => {
      const key = `${message.id}-${i}`

      if (p.type === 'reasoning') {
        steps.push({
          kind: 'reasoning',
          key,
          text: p.text,
          status: p.state === 'streaming' ? 'active' : 'complete',
        })
      }
      else if (p.type === 'text') {
        flush(false)
        if (p.text)
          nodes.push(<Assistant key={key}>{p.text}</Assistant>)
      }
      else if (p.type.startsWith('tool-')) {
        const part = p as unknown as ToolPart
        const name = part.type.slice(5)

        if (name.startsWith('ask_')) {
          flush(false)
          nodes.push(<div key={key}>{renderAsk(part)}</div>)
        }
        else {
          steps.push({
            kind: 'tool',
            key,
            id: part.toolCallId,
            name,
            status: toolStatus(part.state),
            part,
          })
          const c = card(part)

          if (c)
            cards.push(c)
        }
      }
    })
    flush(true)

    return nodes
  }

  return (
    <div
      ref={rootRef}
      className="flex flex-col overflow-hidden"
      style={{ height: 'calc(100dvh - var(--chat-top, 0px))' }}
    >
      <AssistantHeader onBack={onLeave} />

      <Conversation>
        <ConversationContent>
          {messages.length === 0 && (
            <>
              <Assistant>
                {language === 'de'
                  ? 'Grüezi! Ich plane Ihre Fahrt über die Schweizer Pässe aus den Touren, die Erich anbietet. Ich stelle Ihnen ein paar kurze Fragen.'
                  : 'Hi! I plan your ride over the Swiss passes from the tours Erich runs. I will ask a few quick questions.'}
              </Assistant>
              <Group label={t.start}>
                <Row onClick={() => void sendMessage({ text: t.startText })}>
                  {t.startText}
                </Row>
              </Group>
            </>
          )}

          {messages.map((m, mi) =>
            m.role === 'user'
              ? (
                  <Guest key={m.id}>
                    {m.parts.map(p => (p.type === 'text' ? p.text : '')).join('')}
                  </Guest>
                )
              : (
                  <div key={m.id} className="flex flex-col gap-4">
                    {renderAssistant(m, mi === messages.length - 1)}
                  </div>
                ),
          )}
          {status === 'submitted' && <Thinking label={t.typing} />}
        </ConversationContent>
      </Conversation>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-separator bg-background px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] text-xs text-muted">
        <span>{t.tapHint}</span>
        {messages.length > 0 && (
          <button
            className="min-h-11 rounded-full px-2 font-medium text-foreground underline underline-offset-2 outline-none focus-visible:focus-ring"
            type="button"
            onClick={() => {
              setChat(resetChat())
            }}
          >
            {t.startOver}
          </button>
        )}
      </div>
    </div>
  )
}
