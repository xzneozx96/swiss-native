import type { DemoState, Role } from './types'

import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'

import { useSharedClock } from '@/hooks/use-shared-clock'
import { readStored, writeStored } from '@/lib/storage'
import { demoNow } from './clock'

import { createSeedState, DEMO_VERSION } from './seed'
import { upgradeDemoData } from './upgrade'

const STORAGE_KEY = 'sk.demo'

function loadState(): DemoState {
  const stored = readStored<DemoState | null>(STORAGE_KEY, null)

  if (stored?.version !== DEMO_VERSION)
    return createSeedState()

  return { ...stored, data: upgradeDemoData(stored.data) }
}

/** Replace the data with an updated copy; later steps add their actions on top of this. */
type Update = (recipe: (state: DemoState) => DemoState) => void

interface DemoActions {
  /** The current state, read at call time: an event handler uses it without subscribing. */
  getState: () => DemoState
  update: Update
  setRole: (role: Role) => void
  reset: () => void
}

interface DemoStore extends DemoActions {
  getStorageFull: () => boolean
  subscribe: (listener: () => void) => () => void
  save: () => void
  /** Writes the save still waiting for idle time, if there is one. */
  flush: () => void
}

/** Safari has no requestIdleCallback; a short timer still keeps the save out of the event. */
function whenIdle(task: () => void) {
  if ('requestIdleCallback' in window)
    requestIdleCallback(task, { timeout: 1000 })
  else
    setTimeout(task, 50)
}

function createDemoStore(initial: DemoState): DemoStore {
  const listeners = new Set<() => void>()
  let state = initial
  let storageFull = false
  let savePending = false

  const save = () => {
    savePending = false
    const full = writeStored(STORAGE_KEY, state) === 'full'

    if (full === storageFull)
      return
    storageFull = full
    listeners.forEach(notify => notify())
  }
  const flush = () => {
    if (savePending)
      save()
  }
  // Saving stringifies the whole state, so it waits for idle time instead of holding up the
  // next paint, and the updates made meanwhile (keystrokes, stepper taps) are saved once.
  const update: Update = (recipe) => {
    state = recipe(state)
    if (!savePending) {
      savePending = true
      whenIdle(flush)
    }
    listeners.forEach(notify => notify())
  }

  return {
    getState: () => state,
    getStorageFull: () => storageFull,
    subscribe(listener) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
    save,
    flush,
    update,
    setRole: role => update(s => ({ ...s, role })),
    // Keeps the current role so the presenter stays where they are.
    reset: () => update(s => ({ ...createSeedState(), role: s.role })),
  }
}

const DemoContext = createContext<DemoStore | null>(null)

/** The store never changes, so the provider never re-renders what is under it. */
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createDemoStore(loadState()))

  useEffect(() => store.save(), [store])

  // A save still waiting for idle time is written before the page is left, reloaded or
  // hidden, so the next load always sees the latest change.
  useEffect(() => {
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden')
        store.flush()
    }

    window.addEventListener('pagehide', store.flush)
    document.addEventListener('visibilitychange', flushWhenHidden)

    return () => {
      window.removeEventListener('pagehide', store.flush)
      document.removeEventListener('visibilitychange', flushWhenHidden)
    }
  }, [store])

  return <DemoContext value={store}>{children}</DemoContext>
}

function useStore(): DemoStore {
  const store = use(DemoContext)

  if (!store)
    throw new Error('useDemo must be used inside DemoProvider')

  return store
}

/**
 * One slice of the state. The component re-renders only when the slice changes, so select a
 * primitive or an existing part of the state (`(s) => s.data.orders`), never a new object.
 */
export function useDemoSelector<T>(select: (state: DemoState) => T): T {
  const store = useStore()

  return useSyncExternalStore(store.subscribe, () => select(store.getState()))
}

/** The writers, without subscribing to any state. */
export function useDemoActions(): DemoActions {
  const { getState, update, setRole, reset } = useStore()

  return useMemo(
    () => ({ getState, update, setRole, reset }),
    [getState, update, setRole, reset],
  )
}

/** The browser refused the last save because storage is full, so the latest changes live in this tab only. */
export function useStorageFull(): boolean {
  const store = useStore()

  return useSyncExternalStore(store.subscribe, store.getStorageFull)
}

/** The whole state: re-renders on every change. Prefer `useDemoSelector` for a part of it. */
export function useDemo(): DemoActions & { state: DemoState } {
  const state = useDemoSelector(s => s)
  const actions = useDemoActions()

  return useMemo(() => ({ state, ...actions }), [state, actions])
}

/** Current demo time, refreshed every 30 seconds for countdowns and "due in" labels. */
export function useDemoNow(): Date {
  const clockStartedAt = useDemoSelector(s => s.clockStartedAt)

  return demoNow(clockStartedAt, useSharedClock(30_000))
}
