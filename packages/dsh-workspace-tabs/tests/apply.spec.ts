// @vitest-environment jsdom
import { Context, type Fiber } from '@deepseek-ai/cordis'
import type { SessionListState, SessionSummary } from '@deepseek-ai/dsh-api-session-controller/client'
import type { WorkspaceId, WorkspaceSnapshot } from '@deepseek-ai/dsh-api-workspace-controller/client'
import type { MainPanelId, PanelInfo } from '@deepseek-ai/dsh-client-ui-layout/client'
import type { StoredEntry } from '@deepseek-ai/dsh-client-ui-slots'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../src/client/index.ts'
import { en, NS, zh } from '../src/client/locales.ts'

const chrome = '[data-skin-chrome="titlebar"]'
const dropdown = '[data-skin-chrome="dropdown"]'
const selectedWorkspace = 'dsh-workspace-tabs:selected-workspace'
const timestamp = Date.UTC(2026, 10, 13, 10)
const dev = 'ws-dev' as WorkspaceId
const notes = 'ws-notes' as WorkspaceId
const home = 'ws-home' as WorkspaceId
const first = 's1' as SessionSummary['id']
const second = 's2' as SessionSummary['id']
const third = 's3' as SessionSummary['id']
const old = 'archived' as SessionSummary['id']
const blank = 'blank' as SessionSummary['id']
const fibers: Fiber[] = []

function observable<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    set(next: T) {
      value = next
      for (const listener of listeners) listener()
    },
  }
}

function session(id: SessionSummary['id'], title: string, minutesAgo: number, options: Partial<SessionSummary> = {}): SessionSummary {
  return { id, displayTitle: title, title, updatedAt: timestamp - minutesAgo * 60_000, blank: false, running: false, retainedBy: {}, ...options }
}

function workspace(workspaceId: WorkspaceId, title: string, sessionIds: SessionSummary['id'][]): WorkspaceSnapshot['items'][number] {
  const date = new Date(timestamp).toISOString()
  return { workspaceId, title, path: '/projects/' + title.toLowerCase(), sessionIds, updatedAt: date, createdAt: date }
}

function slot(options: StoredEntry['options'], store?: unknown): StoredEntry {
  return { component: () => null, options, store } as StoredEntry
}

function createHost(language: 'zh' | 'en' = 'en') {
  const root = new Context()
  const workspaces = observable<WorkspaceSnapshot>({ items: [], archivedSessionIds: [], pinnedSessionIds: [], phase: 'ready', state: 'idle', error: null })
  const sessions = observable<SessionListState>({ ids: [], byId: {}, phase: 'ready', projectionsBySession: {} })
  const panelInfo = observable<PanelInfo>({ activePanelId: null })
  const sidebar = observable<'open' | 'closed'>('open')
  const localeState = observable({ active: language, revision: 0 })
  const dictionaries = new Map<string, Record<'zh' | 'en', Record<string, string>>>()
  const locale = {
    getSnapshot: localeState.getSnapshot,
    subscribe: localeState.subscribe,
    register(ns: string, values: Record<'zh' | 'en', Record<string, string>>) {
      dictionaries.set(ns, values)
      return () => { dictionaries.delete(ns) }
    },
    bind(ns: string) {
      return (key: string, params: Record<string, unknown> = {}) => {
        const copy = dictionaries.get(ns)?.[localeState.getSnapshot().active][key] ?? key
        return copy.replace(/\{(\w+)\}/g, (raw, name: string) => String(params[name] ?? raw))
      }
    },
  }
  const entries = new Map<string, ReturnType<typeof observable<readonly StoredEntry[]>>>()
  const slotEntries = (key: string) => {
    let rows = entries.get(key)
    if (!rows) {
      rows = observable<readonly StoredEntry[]>([])
      entries.set(key, rows)
    }
    return rows
  }
  const slots = {
    entriesOfSlot: (key: string) => slotEntries(key).getSnapshot(),
    subscribe: (key: string, listener: () => void) => slotEntries(key).subscribe(listener),
  }
  const selectPanel = (id: MainPanelId | null) => panelInfo.set({ activePanelId: id })
  const retainMain = (id: SessionSummary['id'] | null) => {
    const snapshot = sessions.getSnapshot()
    const current = Object.values(snapshot.byId).find(row => row.retainedBy.mainView)?.id
    if (current === id) return
    if (id !== null) {
      const row = snapshot.byId[id]
      if (!row) throw Error('Session missing: ' + id)
      sessions.set({ ...snapshot, byId: { ...snapshot.byId, [id]: { ...row, retainedBy: { mainView: 1 } } } })
    }
    // The actual SDK holds both references for one synchronous notification.
    if (current) {
      const live = sessions.getSnapshot()
      sessions.set({ ...live, byId: { ...live.byId, [current]: { ...live.byId[current]!, retainedBy: {} } } })
    }
  }
  const startSession = vi.fn<(workspaceId?: WorkspaceId) => void>()
  const services = {
    workspaces: { list: workspaces },
    sessions: { list: sessions },
    uiWorkspace: {
      openSession(id: SessionSummary['id']) {
        retainMain(id)
        selectPanel(null)
      },
      startSession,
    },
    layout: {
      panelInfo,
      selectPanel,
      toggleSidebar: () => sidebar.set(sidebar.getSnapshot() === 'open' ? 'closed' : 'open'),
    },
    locale,
    slots,
  }
  return {
    root, workspaces, sessions, panelInfo, sidebar, dictionaries, startSession, retainMain, slotEntries,
    setLanguage: (active: 'zh' | 'en') => localeState.set({ active, revision: localeState.getSnapshot().revision + 1 }),
    async mount() {
      const provider = root.plugin((ctx: Context) => {
        for (const [name, service] of Object.entries(services)) ctx.provide(name, service)
      })
      fibers.push(provider)
      await provider.await()
      const tabs = root.plugin({ apply, inject })
      fibers.push(tabs)
      await tabs.await()
      return tabs
    },
  }
}

function seed(host: ReturnType<typeof createHost>, active = first) {
  const rows = [
    session(first, '<|im_start|>user\nFix plugin tests', 6, { retainedBy: active === first ? { mainView: 1 } : {} }),
    session(second, 'Polish the interface', 2, { running: true, retainedBy: active === second ? { mainView: 1 } : {} }),
    session(third, 'Read notes', 4, { retainedBy: active === third ? { mainView: 1 } : {} }),
    session(old, 'Archived work', 1),
    session(blank, 'Dev', 0, { title: undefined, blank: true }),
  ]
  host.sessions.set({ ...host.sessions.getSnapshot(), ids: rows.map(row => row.id), byId: Object.fromEntries(rows.map(row => [row.id, row])) })
  host.workspaces.set({
    ...host.workspaces.getSnapshot(),
    items: [workspace(dev, 'Dev', [first, second, old, blank]), workspace(notes, 'Notes', [third]), workspace(home, 'Home', [])],
    archivedSessionIds: [old],
  })
}

function button(label: string, selector = chrome): HTMLButtonElement {
  const result = [...document.querySelectorAll<HTMLButtonElement>(selector + ' button')]
    .find(element => element.getAttribute('aria-label') === label || element.textContent?.startsWith(label))
  if (!result) throw Error('Missing button: ' + label)
  return result
}

function tabs(): string[] {
  return [...document.querySelectorAll<HTMLButtonElement>(chrome + ' button[title*=" · "]')]
    .map(element => element.textContent ?? '')
}

afterEach(async () => {
  for (const fiber of fibers.splice(0).reverse()) await fiber.dispose()
  document.body.replaceChildren()
  document.title = ''
  localStorage.clear()
  delete document.documentElement.dataset.platform
  vi.useRealTimers()
})

describe('Workspace Tabs', () => {
  it('user receives the browser bar and it is removed when the plugin is disabled', async () => {
    // Given the host starts with its own navigation element.
    const host = createHost()
    const native = document.createElement('nav')
    document.body.append(native)

    // When the user enables and disables Workspace Tabs.
    const plugin = await host.mount()
    expect(document.body.dataset.workspaceTabsMode).toBe('browser')
    expect(button(en['chrome.sidebar']).disabled).toBe(false)
    await plugin.dispose()

    // Then the tab bar, body styling, and registered copy are gone.
    expect(document.querySelectorAll(chrome)).toHaveLength(0)
    expect(document.body.dataset.dshWorkspaceTabs).toBeUndefined()
    expect(document.body.dataset.workspaceTabsMode).toBeUndefined()
    expect(host.dictionaries.has(NS)).toBe(false)
    expect(document.body.firstElementChild).toBe(native)
  })

  it('user on macOS can drag the chrome and use the workspace menu', async () => {
    // Given a macOS desktop.
    document.documentElement.dataset.platform = 'darwin'
    const host = createHost()
    seed(host)
    const plugin = await host.mount()

    // When the user opens a workspace menu in the browser bar.
    button('Show conversations in Dev').click()

    // Then only the surrounding chrome is draggable and the popup can receive clicks.
    expect(document.querySelector(chrome)?.getAttribute('data-window-drag')).toBe('true')
    expect(document.querySelector(dropdown)?.getAttribute('data-no-drag')).toBe('true')
    button('New conversation in Dev', dropdown).click()
    expect(host.startSession.mock.calls).toEqual([[dev]])
    await plugin.dispose()
    expect(document.querySelectorAll('[data-skin-chrome]')).toHaveLength(0)
  })

  it.each(['win32', 'linux', undefined])('user keeps navigation without native drag markers on %s', async (platform) => {
    // Given a platform without macOS window dragging.
    if (platform) document.documentElement.dataset.platform = platform
    const host = createHost()
    await host.mount()

    // When the user selects the classic bar.
    button(en['chrome.classicHint']).click()

    // Then the bar switches without emitting native drag attributes.
    expect(document.body.dataset.workspaceTabsMode).toBe('classic')
    expect(button(en['chrome.browserHint']).disabled).toBe(false)
    expect(document.querySelectorAll('[data-window-drag], [data-no-drag]')).toHaveLength(0)
  })

  it('user gets a clean session window title and keeps a later shell title on disable', async () => {
    // Given a session title with a ChatML prefix and a pre-existing shell title.
    document.title = 'DSH'
    const host = createHost()
    seed(host)

    // When the bar mounts, then the shell changes its own document title before disposal.
    const plugin = await host.mount()
    expect(document.title).toBe('Dev / Fix plugin tests — DeepSeek Harness')
    document.title = 'Updated shell title'
    await plugin.dispose()

    // Then the plugin does not overwrite the shell’s later title.
    expect(document.title).toBe('Updated shell title')
  })

  it('user follows native conversation selection, recency, back and forward across workspaces', async () => {
    // Given workspace membership is in manual order, with unused blank and archived rows.
    const host = createHost()
    seed(host)
    await host.mount()
    expect(tabs()).toEqual(['Polish the interface', 'Fix plugin tests'])

    // When the user switches workspace, then goes back and forward.
    button('Switch workspace: Notes').click()
    await Promise.resolve()
    expect(tabs()).toEqual(['Read notes'])
    button(en['session.back']).click()
    await Promise.resolve()
    expect(tabs()).toEqual(['Polish the interface', 'Fix plugin tests'])
    button(en['session.forward']).click()
    await Promise.resolve()

    // Then the selected conversation, tab strip and history controls agree.
    expect(document.title).toBe('Notes / Read notes — DeepSeek Harness')
    expect(button('Read notes').dataset.active).toBe('true')
    expect(button(en['session.forward']).disabled).toBe(true)
    button('Switch workspace: Home').click()
    button('New conversation in Home').click()
    expect(host.startSession.mock.calls).toEqual([[home]])
  })

  it('user switches to the result’s workspace when searching from another workspace', async () => {
    // Given conversations in separate workspaces.
    const host = createHost()
    seed(host)
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(timestamp)
    await host.mount()

    // When a search in Dev matches a conversation in Notes.
    button(en['chrome.searchHint']).click()
    const search = document.querySelector<HTMLInputElement>(dropdown + ' input')!
    expect(document.activeElement).toBe(search)
    search.value = 'read'
    search.dispatchEvent(new Event('input'))
    const result = button('[Notes] Read notes', dropdown)
    expect(result.textContent).toContain('4 min. ago')
    result.click()
    await Promise.resolve()

    // Then the selected conversation's workspace and its saved bookmark agree.
    expect(tabs()).toEqual(['Read notes'])
    expect(localStorage.getItem(selectedWorkspace)).toBe(notes)
    expect(document.querySelector(dropdown)).toBeNull()
  })

  it('user opens live global panels with More and toggles the official sidebar', async () => {
    // Given two real global panels and a stale sidebar entry with no main seat.
    const host = createHost()
    seed(host)
    host.slotEntries('main').set([slot({ key: 'plugins' }), slot({ key: 'custom-board' })])
    host.slotEntries('sidebar.panellist').set([
      slot({ id: 'plugins', order: 1, label: 'Plugins' }),
      slot({ id: 'custom-board', order: 5, label: () => 'Custom Board' }),
      slot({ id: 'orphan', label: 'Orphan' }),
    ])
    await host.mount()

    // When the user opens More, selects the board, and toggles the sidebar.
    button(en['panel.moreHint']).click()
    expect(document.querySelector(dropdown)?.textContent).toContain('Global panels (2)')
    expect(document.querySelector(dropdown)?.textContent).not.toContain('Orphan')
    button('Custom Board', dropdown).click()
    button(en['chrome.sidebar']).click()
    await Promise.resolve()

    // Then the main layout owns the board selection and sidebar state.
    expect(host.panelInfo.getSnapshot().activePanelId).toBe('custom-board')
    expect(host.sidebar.getSnapshot()).toBe('closed')
    expect(document.querySelector(dropdown)).toBeNull()
    button(en['panel.pluginsHint']).click()
    expect(host.panelInfo.getSnapshot().activePanelId).toBe('plugins')
    button(en['panel.pluginsHint']).click()
    expect(host.panelInfo.getSnapshot().activePanelId).toBeNull()
  })

  it('user opens settings, usage and remote through their registered owner', async () => {
    // Given the native settings and remote owners coexist with an unrelated footer button.
    const host = createHost()
    const state = { open: false, section: 'general', clicked: '' }
    host.slotEntries('sidebar.settings').set([slot({}, { create: () => ({ actions: {
      open: () => { state.open = true },
      openSection: (section: string) => { state.open = true; state.section = section },
    } }) })])
    host.slotEntries('settings.section').set([slot({ id: 'dsh-usage' })])
    host.slotEntries('sidebar.footer.action').set([slot({ id: 'remote-bridge' })])
    const footer = document.createElement('div')
    const unrelated = document.createElement('button')
    unrelated.onclick = () => { state.clicked = 'unrelated' }
    const remote = document.createElement('button')
    remote.dataset.dshPlugin = 'remote-bridge'
    remote.dataset.dshPart = 'entry'
    remote.onclick = () => { state.clicked = 'remote' }
    footer.append(unrelated, remote)
    document.body.append(footer)
    await host.mount()

    // When the user takes each shortcut.
    button(en['panel.settingsHint']).click()
    expect(state).toMatchObject({ open: true, section: 'general' })
    button(en['panel.usageHint']).click()
    button(en['panel.remoteHint']).click()

    // Then usage and remote land on their own surfaces.
    expect(state).toEqual({ open: true, section: 'dsh-usage', clicked: 'remote' })
  })

  it('user sees unavailable optional shortcuts disabled and can still change bar layout', async () => {
    // Given the host has no settings or remote footer registration.
    const host = createHost()
    await host.mount()

    // When the user switches the bar to classic and back.
    button(en['chrome.classicHint']).click()
    expect(document.body.dataset.workspaceTabsMode).toBe('classic')
    button(en['chrome.browserHint']).click()

    // Then unavailable shortcuts cannot intercept a click.
    expect(document.body.dataset.workspaceTabsMode).toBe('browser')
    expect(button(en['panel.remoteHint']).disabled).toBe(true)
    expect(button(en['panel.usageHint']).disabled).toBe(true)
    expect(button(en['panel.settingsHint']).disabled).toBe(true)
  })

  it('user switches the host language and gets localized control and blank conversation copy', async () => {
    // Given the empty composer is retained by the main view.
    const host = createHost()
    seed(host)
    host.retainMain(blank)
    await host.mount()
    expect(tabs()[0]).toBe('New conversation')

    // When the user changes the language.
    host.setLanguage('zh')
    await Promise.resolve()

    // Then the existing tab bar switches languages without a reload.
    expect(tabs()[0]).toBe('新建对话')
    expect(button(zh['chrome.sidebar']).disabled).toBe(false)
    expect(document.title).toBe('Dev / 新建对话 — DeepSeek Harness')
  })
})
