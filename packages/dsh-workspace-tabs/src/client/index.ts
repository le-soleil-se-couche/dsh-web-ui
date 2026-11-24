/**
 * Workspace Tabs: browser-style workspace and conversation navigation with
 * a compact classic mode and macOS-only native drag regions.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { SessionSummary } from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-api-workspace-controller/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import { en, NS, zh } from './locales.ts'
import { actionSlots, panelEntries, panelSlots, shellActions } from './shell.ts'
import { createTabDrag, movedTabOrder, orderTabs, readTabOrders } from './tab-order.ts'
import { buildWorkspaceGroups, cleanSessionTitle, mainSession, relativeTime, topLevelSession, type WorkspaceGroup } from './workspaces.ts'
import css from './workspace-tabs.module.css'

export const inject = ['locale', 'workspaces', 'sessions', 'uiWorkspace', 'layout', 'slots']

type ChromeMode = 'browser' | 'classic'

const MODE_STORAGE_KEY = 'dsh-workspace-tabs:chrome-mode'
const WS_STORAGE_KEY = 'dsh-workspace-tabs:selected-workspace'
const TAB_ORDER_STORAGE_KEY = 'dsh-workspace-tabs:tab-order'
const DEFAULT_APP_TITLE = 'DeepSeek Harness'
const MAX_VISIBLE_TABS = 12

const cls = (name: keyof typeof css): string => css[name] ?? ''

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, val: string): void {
  try {
    localStorage.setItem(key, val)
  } catch {
    // ignore storage errors in restricted environments
  }
}

function navigationGlyph(outline: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg'
  const icon = document.createElementNS(ns, 'svg')
  icon.setAttribute('viewBox', '0 0 16 16')
  icon.setAttribute('width', '16')
  icon.setAttribute('height', '16')
  icon.setAttribute('fill', 'none')
  icon.setAttribute('aria-hidden', 'true')
  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', outline)
  path.setAttribute('stroke', 'currentColor')
  path.setAttribute('stroke-width', '1.5')
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('stroke-linejoin', 'round')
  icon.append(path)
  return icon
}

function makeIconButton(
  label: string | SVGSVGElement,
  tooltip: string,
  opts: { active?: boolean; disabled?: boolean; extraClass?: string; compactLabel?: string; onClick: (e: MouseEvent) => void },
): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = opts.extraClass ? `${cls('iconBtn')} ${opts.extraClass}` : cls('iconBtn')
  if (opts.active) btn.dataset.active = 'true'
  if (opts.disabled) btn.disabled = true
  btn.title = tooltip
  btn.setAttribute('aria-label', tooltip)
  if (typeof label !== 'string') {
    btn.append(label)
  } else if (opts.compactLabel) {
    const full = document.createElement('span')
    full.className = cls('fullLabel')
    full.textContent = label
    const compact = document.createElement('span')
    compact.className = cls('compactLabel')
    compact.textContent = opts.compactLabel
    btn.append(full, compact)
  } else {
    btn.textContent = label
  }
  btn.onclick = opts.onClick
  return btn
}

/** Mount with the locale and state services already available through Cordis injection. */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'workspace-tabs: dictionaries')
  ctx.effect(() => mount(ctx), 'workspace-tabs: chrome')
}

function mount(ctx: Context): () => void {
  const { layout, locale, sessions, slots, uiWorkspace, workspaces } = ctx
  const t = locale.bind(NS)
  const actions = shellActions(ctx)
  const body = document.body
  const isMacOS = document.documentElement.dataset.platform === 'darwin'
  const excludeFromWindowDrag = (element: HTMLElement): void => {
    if (isMacOS) element.setAttribute('data-no-drag', 'true')
  }
  const makeWindowGrip = (position: 'dragSpacer' | 'captionGrip'): HTMLElement => {
    const grip = document.createElement('div')
    grip.className = `${cls('windowGrip')} ${cls(position)}`
    grip.setAttribute('aria-hidden', 'true')
    grip.setAttribute('data-window-drag', 'true')
    return grip
  }
  const originalTitle = document.title
  let lastSkinTitle: string | null = null

  let mode: ChromeMode = readStorage(MODE_STORAGE_KEY) === 'classic' ? 'classic' : 'browser'
  let selectedWorkspaceId: string | null = readStorage(WS_STORAGE_KEY) || null
  let tabOrders = readTabOrders(readStorage(TAB_ORDER_STORAGE_KEY))
  let renderedGroups: WorkspaceGroup[] = []
  const sessionHistory: SessionSummary['id'][] = []
  let historyIndex = -1
  let lastActiveSessionId: SessionSummary['id'] | null = null
  let activeDropdown: HTMLElement | null = null
  let activeAnchor: HTMLElement | null = null
  let lastRenderKey = ''
  let renderedWorkspaceId: string | null = null

  const closeDropdown = (): void => {
    if (activeDropdown) {
      activeDropdown.remove()
      activeDropdown = null
      activeAnchor = null
    }
  }

  body.setAttribute('data-dsh-workspace-tabs', '')
  body.setAttribute('data-workspace-tabs-mode', mode)

  const titlebar = document.createElement('div')
  titlebar.className = cls('titlebar')
  titlebar.dataset.skinChrome = 'titlebar'
  titlebar.dataset.dshPlugin = 'workspace-tabs'

  const row1 = document.createElement('div')
  row1.className = cls('row1')

  const row2 = document.createElement('div')
  row2.className = cls('row2')

  const captionGrip = isMacOS ? makeWindowGrip('captionGrip') : null
  const conversationGrip = isMacOS ? makeWindowGrip('dragSpacer') : null
  const workspaceGrip = isMacOS ? makeWindowGrip('dragSpacer') : null

  const tabStrip = document.createElement('div')
  tabStrip.className = cls('tabStrip')

  const wsBar = document.createElement('div')
  wsBar.className = cls('wsBar')
  excludeFromWindowDrag(wsBar)

  titlebar.append(row1, row2)
  body.append(titlebar)

  const sessionTitle = (session: SessionSummary): string =>
    cleanSessionTitle(session.title || (session.blank ? undefined : session.displayTitle), t('session.new'))

  const openSessionById = (sessionId: SessionSummary['id']): void => {
    uiWorkspace.openSession(sessionId)
    closeDropdown()
  }

  const startNewSessionInWorkspace = (group: WorkspaceGroup): void => {
    uiWorkspace.startSession(group.workspaceId)
    closeDropdown()
  }

  const moveInHistory = (step: -1 | 1): void => {
    const targetId = sessionHistory[historyIndex + step]
    if (!targetId) return
    openSessionById(targetId)
    historyIndex += step
    render()
  }

  const moveTab = (
    workspace: string, source: SessionSummary['id'], target: SessionSummary['id'], side: 'before' | 'after',
  ): void => {
    const group = renderedGroups.find(row => row.id === workspace)
    if (!group) return
    const stored = readStorage(TAB_ORDER_STORAGE_KEY)
    const orders = stored === null ? tabOrders : readTabOrders(stored)
    const saved = orders.get(workspace)
    const next = movedTabOrder(orderTabs(group.sessions, saved), saved, source, target, side)
    if (!next) return
    orders.set(workspace, next)
    tabOrders = orders
    writeStorage(TAB_ORDER_STORAGE_KEY, JSON.stringify(Object.fromEntries(tabOrders)))
    closeDropdown()
    render()
  }
  const tabDrag = createTabDrag(moveTab)

  const createAnchoredDropdown = (anchorEl: HTMLElement, anchorId: string, alignRight = false): HTMLDivElement | null => {
    if (activeDropdown && activeAnchor === anchorEl && activeDropdown.dataset.anchorId === anchorId) {
      closeDropdown()
      return null
    }
    const rect = anchorEl.getBoundingClientRect()
    closeDropdown()
    const dd = document.createElement('div')
    dd.className = cls('dropdown')
    dd.dataset.skinChrome = 'dropdown'
    dd.dataset.anchorId = anchorId
    dd.dataset.dshPlugin = 'workspace-tabs'
    activeAnchor = anchorEl
    excludeFromWindowDrag(dd)
    const top = Math.min(window.innerHeight - 80, Math.round(rect.bottom + 4))
    const rawLeft = alignRight ? rect.right - 260 : rect.left
    const left = Math.max(8, Math.min(window.innerWidth - 320, Math.round(rawLeft)))
    dd.style.top = `${top}px`
    dd.style.left = `${left}px`
    return dd
  }

  const bindTabArrangement = (
    button: HTMLButtonElement, session: SessionSummary, group: WorkspaceGroup, axis: 'x' | 'y',
  ): void => {
    if (session.blank || !group.sessions.some(row => row.id !== session.id && !row.blank)) return
    tabDrag.bind(button, group.id, session.id, axis)
    const open = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      const tabs = group.sessions.filter(row => !row.blank)
      const index = tabs.findIndex(row => row.id === session.id)
      const dd = createAnchoredDropdown(button, `tab-order:${session.id}`)
      if (!dd) return
      for (const [key, peer, side] of [
        ['session.moveEarlier', tabs[index - 1], 'before'],
        ['session.moveLater', tabs[index + 1], 'after'],
      ] as const) {
        const item = document.createElement('button')
        item.className = cls('ddItem')
        item.type = 'button'
        item.textContent = t(key)
        item.disabled = !peer
        item.onclick = () => { if (peer) moveTab(group.id, session.id, peer.id, side) }
        dd.append(item)
      }
      dd.onkeydown = event => {
        if (event.key !== 'Escape') return
        closeDropdown()
        if (button.isConnected) button.focus()
      }
      body.append(dd)
      activeDropdown = dd
      dd.querySelector<HTMLButtonElement>('button:enabled')?.focus()
    }
    button.oncontextmenu = open
    button.onkeydown = event => {
      if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) open(event)
    }
  }

  const openSessionsDropdown = (
    anchorEl: HTMLElement,
    group: WorkspaceGroup,
    allGroups: WorkspaceGroup[],
    activeSessionId: string | null,
  ): void => {
    const dd = createAnchoredDropdown(anchorEl, `ws:${group.id}`)
    if (!dd) return

    const header = document.createElement('div')
    header.className = cls('ddHeader')
    const hTitle = document.createElement('span')
    hTitle.textContent = `${group.title} (${group.sessions.length})`
    const newBtn = makeIconButton(`+ ${t('session.new')}`, t('session.newInWorkspace', { workspace: group.title }), {
      onClick: (e) => {
        e.stopPropagation()
        startNewSessionInWorkspace(group)
      },
    })
    header.append(hTitle, newBtn)
    dd.append(header)

    const searchInput = document.createElement('input')
    searchInput.type = 'search'
    searchInput.className = cls('ddSearch')
    searchInput.placeholder = t('session.filter')
    searchInput.setAttribute('aria-label', searchInput.placeholder)
    dd.append(searchInput)

    const listWrap = document.createElement('div')
    dd.append(listWrap)

    const now = Date.now()
    const format = new Intl.RelativeTimeFormat(locale.getSnapshot().active, { style: 'short' })
    const renderItems = (q: string): void => {
      listWrap.replaceChildren()
      const query = q.trim().toLowerCase()
      const pool = (query ? allGroups : [group]).flatMap(owner =>
        owner.sessions.map(session => ({ session, owner })))
      const filtered = query
        ? pool.filter(({ session, owner }) =>
            sessionTitle(session).toLowerCase().includes(query) || owner.title.toLowerCase().includes(query))
        : pool

      if (filtered.length === 0) {
        const empty = document.createElement('div')
        empty.className = cls('ddEmpty')
        empty.textContent = t('session.noMatches')
        listWrap.append(empty)
        return
      }
      for (const { session: s, owner } of filtered) {
        const item = document.createElement('button')
        item.type = 'button'
        item.className = cls('ddItem')
        if (s.id === activeSessionId) item.dataset.active = 'true'
        const dot = document.createElement('span')
        dot.className = cls('dot')
        if (s.running) dot.dataset.running = 'true'
        else if (s.id === activeSessionId) dot.dataset.active = 'true'
        const tSpan = document.createElement('span')
        tSpan.className = cls('ddItemTitle')
        const clean = sessionTitle(s)
        tSpan.textContent = query ? `[${owner.title}] ${clean}` : clean
        tSpan.title = clean
        const meta = document.createElement('span')
        meta.className = cls('ddItemMeta')
        meta.textContent = relativeTime(s.updatedAt, now, t, format)
        item.append(dot, tSpan, meta)
        item.onclick = (e) => {
          e.stopPropagation()
          selectedWorkspaceId = owner.id
          writeStorage(WS_STORAGE_KEY, selectedWorkspaceId)
          openSessionById(s.id)
        }
        bindTabArrangement(item, s, owner, 'y')
        listWrap.append(item)
      }
    }

    searchInput.oninput = () => renderItems(searchInput.value)
    renderItems('')
    body.append(dd)
    activeDropdown = dd
    searchInput.focus()
  }

  const togglePanel = (panelId: MainPanelId): void => {
    if (!slots.entriesOfSlot('main').some(({ options }) => options.key === panelId)) return
    layout.selectPanel(layout.panelInfo.getSnapshot().activePanelId === panelId ? null : panelId)
  }

  const openPanelsDropdown = (
    anchorEl: HTMLElement,
    panels: ReturnType<typeof panelEntries>,
    activePanelId: MainPanelId | null,
  ): void => {
    const dd = createAnchoredDropdown(anchorEl, 'more:panels', true)
    if (!dd) return

    const header = document.createElement('div')
    header.className = cls('ddHeader')
    const hTitle = document.createElement('span')
    hTitle.textContent = t('panel.all', { count: panels.length })
    header.append(hTitle)
    dd.append(header)

    for (const p of panels) {
      const item = document.createElement('button')
      item.type = 'button'
      item.className = cls('ddItem')
      if (p.id === activePanelId) item.dataset.active = 'true'
      const dot = document.createElement('span')
      dot.className = cls('dot')
      if (p.id === activePanelId) dot.dataset.active = 'true'
      const labelSpan = document.createElement('span')
      labelSpan.className = cls('ddItemTitle')
      labelSpan.textContent = p.label
      const idSpan = document.createElement('span')
      idSpan.className = cls('ddItemMeta')
      idSpan.textContent = p.id
      item.append(dot, labelSpan, idSpan)
      item.onclick = (e) => {
        e.stopPropagation()
        togglePanel(p.id)
        closeDropdown()
      }
      dd.append(item)
    }

    body.append(dd)
    activeDropdown = dd
  }

  const updateWindowTitle = (hasSession: boolean, wsTitle: string, sesTitle: string): void => {
    if (document.title !== originalTitle && document.title !== '' && document.title !== lastSkinTitle) return
    const nextTitle = hasSession ? `${wsTitle} / ${sesTitle} — ${DEFAULT_APP_TITLE}` : DEFAULT_APP_TITLE
    if (document.title !== nextTitle) {
      document.title = nextTitle
    }
    lastSkinTitle = nextTitle
  }

  const setMode = (nextMode: ChromeMode): void => {
    mode = nextMode
    body.setAttribute('data-workspace-tabs-mode', mode)
    writeStorage(MODE_STORAGE_KEY, mode)
    closeDropdown()
    render()
  }

  const render = (): void => {
    const workspaceSnapshot = workspaces.list.getSnapshot()
    const sessionSnapshot = sessions.list.getSnapshot()
    const { activePanelId } = layout.panelInfo.getSnapshot()
    const viewedSession = mainSession(sessionSnapshot)
    const activeSession = topLevelSession(sessionSnapshot, viewedSession)
    const activeSessionId = activeSession?.id ?? null
    const panels = panelEntries(slots)
    const groups = buildWorkspaceGroups(workspaceSnapshot, sessionSnapshot, activeSession, t)
      .map(group => ({ ...group, sessions: orderTabs(group.sessions, tabOrders.get(group.id)) }))
    renderedGroups = groups
    const groupWithActiveSession = groups.find(group => group.sessions.some(session => session.id === activeSessionId))

    if (activeSessionId !== lastActiveSessionId) {
      if (activeSessionId) {
        if (sessionHistory[historyIndex] !== activeSessionId) {
          sessionHistory.splice(historyIndex + 1)
          sessionHistory.push(activeSessionId)
          historyIndex = sessionHistory.length - 1
        }
        if (groupWithActiveSession && (lastActiveSessionId || viewedSession?.origin === 'subagent')) {
          selectedWorkspaceId = groupWithActiveSession.id
        }
      }
      lastActiveSessionId = activeSessionId
    }

    if (workspaceSnapshot.phase === 'ready' && sessionSnapshot.phase === 'ready') {
      // Deleted, archived, or discarded sessions should not become dead history stops.
      const navigable = new Set(groups.flatMap(group => group.sessions.map(session => session.id)))
      for (let index = sessionHistory.length - 1; index >= 0; index -= 1) {
        if (navigable.has(sessionHistory[index]!)) continue
        sessionHistory.splice(index, 1)
        if (index <= historyIndex) historyIndex -= 1
      }
    }

    const currentGroup = groups.find(group => group.id === selectedWorkspaceId) ?? groupWithActiveSession ?? groups[0]!

    const activeSessionTitle = activeSession ? sessionTitle(activeSession) : t('session.none')
    const activeWsTitle = groupWithActiveSession?.title ?? currentGroup.title
    const { settingsAvailable, usageAvailable, remoteAvailable } = actions
    const localeRevision = locale.getSnapshot().revision

    updateWindowTitle(Boolean(viewedSession), activeWsTitle, viewedSession ? sessionTitle(viewedSession) : activeSessionTitle)

    const visibleTabs = currentGroup.sessions.slice(0, MAX_VISIBLE_TABS)
    const canBack = historyIndex > 0
    const canFwd = historyIndex >= 0 && historyIndex < sessionHistory.length - 1

    // Diff DOM key so identical state does not rebuild row1/row2 or trigger DSH drag-recall flicker.
    const nextRenderKey = JSON.stringify({
      mode,
      localeRevision,
      settingsAvailable,
      usageAvailable,
      remoteAvailable,
      activePanelId,
      activeSessionId,
      currentGroupId: currentGroup.id,
      canBack,
      canFwd,
      groups: groups.map(group => [group.id, group.title, group.path, group.sessions.map(s => [s.id, s.displayTitle, s.title, s.updatedAt, s.running])]),
      panels,
    })
    if (nextRenderKey === lastRenderKey) return
    lastRenderKey = nextRenderKey

    // Keep a scrolled tab or workspace visible when switching it redraws the bar.
    const tabScrollLeft = renderedWorkspaceId === currentGroup.id ? tabStrip.scrollLeft : 0
    const workspaceScrollLeft = wsBar.scrollLeft
    renderedWorkspaceId = currentGroup.id

    // Row 1: Navigation and conversations.
    tabDrag.reset()
    row1.replaceChildren()

    const navGroup = document.createElement('div')
    navGroup.className = cls('navGroup')
    excludeFromWindowDrag(navGroup)

    navGroup.append(
      makeIconButton(navigationGlyph('M3 2.75h10a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1ZM6 2.75v10.5'), t('chrome.sidebar'), {
        onClick: () => layout.toggleSidebar(),
      }),
      makeIconButton(navigationGlyph('M13.75 8H2.25m4.25-4.25L2.25 8l4.25 4.25'), t('session.back'), {
        disabled: !canBack,
        onClick: () => moveInHistory(-1),
      }),
      makeIconButton(navigationGlyph('M2.25 8h11.5M9.5 3.75 13.75 8 9.5 12.25'), t('session.forward'), {
        disabled: !canFwd,
        onClick: () => moveInHistory(1),
      }),
    )
    row1.append(navGroup)

    const tabStripWrap = document.createElement('div')
    tabStripWrap.className = cls('tabStripWrap')
    excludeFromWindowDrag(tabStripWrap)

    tabStrip.replaceChildren()
    for (const s of visibleTabs) {
      const tab = document.createElement('button')
      tab.type = 'button'
      tab.className = cls('tab')
      const isTabActive = activePanelId === null && s.id === activeSessionId
      if (isTabActive) tab.dataset.active = 'true'
      const fullTitle = sessionTitle(s)
      tab.title = `${currentGroup.title} · ${fullTitle}`

      const dot = document.createElement('span')
      dot.className = cls('dot')
      if (s.running) dot.dataset.running = 'true'
      else if (isTabActive) dot.dataset.active = 'true'

      const tSpan = document.createElement('span')
      tSpan.className = cls('tabTitle')
      tSpan.textContent = fullTitle

      tab.append(dot, tSpan)
      tab.onclick = () => openSessionById(s.id)
      bindTabArrangement(tab, s, currentGroup, 'x')
      tabStrip.append(tab)
    }

    const newTabBtn = makeIconButton('+', t('session.newInWorkspace', { workspace: currentGroup.title }), {
      onClick: () => startNewSessionInWorkspace(currentGroup),
    })

    const allTabsBtn = makeIconButton(`▾ ${currentGroup.sessions.length}`, t('session.all', { workspace: currentGroup.title, count: currentGroup.sessions.length }), {
      onClick: (e) => {
        e.stopPropagation()
        openSessionsDropdown(allTabsBtn, currentGroup, groups, activeSessionId)
      },
    })

    tabStripWrap.append(tabStrip, newTabBtn, allTabsBtn)
    row1.append(tabStripWrap)

    // Classic Mac centered Workspace / Conversation pill
    const classicCenter = document.createElement('div')
    classicCenter.className = cls('classicCenter')

    const classicPill = document.createElement('button')
    classicPill.type = 'button'
    classicPill.className = cls('classicPill')
    excludeFromWindowDrag(classicPill)
    classicPill.title = t('chrome.switchSession')
    classicPill.setAttribute('aria-label', classicPill.title)

    const wsSpan = document.createElement('span')
    wsSpan.className = cls('classicWs')
    wsSpan.textContent = activeWsTitle
    const sepSpan = document.createElement('span')
    sepSpan.className = cls('classicSep')
    sepSpan.textContent = '/'
    const sesSpan = document.createElement('span')
    sesSpan.className = cls('classicSes')
    sesSpan.textContent = panels.find(panel => panel.id === activePanelId)?.label ?? activeSessionTitle
    const caretSpan = document.createElement('span')
    caretSpan.className = cls('classicSep')
    caretSpan.textContent = '▾'

    classicPill.append(wsSpan, sepSpan, sesSpan, caretSpan)
    classicPill.onclick = (e) => {
      e.stopPropagation()
      openSessionsDropdown(classicPill, groupWithActiveSession ?? currentGroup, groups, activeSessionId)
    }
    classicCenter.append(classicPill)
    row1.append(classicCenter)
    if (captionGrip) row1.append(captionGrip)

    // Global actions share the workspace row in browser mode.
    const extBar = document.createElement('div')
    extBar.className = cls('extBar')
    excludeFromWindowDrag(extBar)

    const plugins = panels.find(panel => panel.id === 'plugins')
    const schedules = panels.find(panel => panel.id === 'schedules')
    const otherPanelActive = activePanelId !== null && activePanelId !== 'plugins' && activePanelId !== 'schedules'
    const moreBtn = makeIconButton(`⊞ ${t('panel.more')}`, t('panel.moreHint'), {
      active: otherPanelActive,
      compactLabel: '⊞',
      disabled: panels.length === 0,
      onClick: (e) => {
        e.stopPropagation()
        openPanelsDropdown(moreBtn, panels, activePanelId)
      },
    })

    const modeBtn = makeIconButton(
      t(mode === 'browser' ? 'chrome.classic' : 'chrome.browser'),
      t(mode === 'browser' ? 'chrome.classicHint' : 'chrome.browserHint'),
      {
        extraClass: cls('modeBtn'),
        compactLabel: mode === 'browser' ? '▬' : '▤',
        onClick: () => setMode(mode === 'browser' ? 'classic' : 'browser'),
      },
    )

    const divider = document.createElement('span')
    divider.className = cls('divider')
    extBar.append(
      makeIconButton(t('panel.plugins'), t('panel.pluginsHint'), {
        active: activePanelId === 'plugins',
        compactLabel: 'P',
        disabled: !plugins,
        onClick: () => { if (plugins) togglePanel(plugins.id) },
      }),
      makeIconButton(t('panel.schedules'), t('panel.schedulesHint'), {
        active: activePanelId === 'schedules',
        compactLabel: 'S',
        disabled: !schedules,
        onClick: () => { if (schedules) togglePanel(schedules.id) },
      }),
      makeIconButton(t('panel.usage'), t('panel.usageHint'), {
        compactLabel: 'U',
        disabled: !usageAvailable,
        onClick: () => actions.openUsage(),
      }),
      makeIconButton(t('panel.remote'), t('panel.remoteHint'), {
        compactLabel: 'R',
        disabled: !remoteAvailable,
        onClick: () => actions.openRemote(),
      }),
      moreBtn,
      makeIconButton(t('panel.settings'), t('panel.settingsHint'), {
        compactLabel: '◈',
        disabled: !settingsAvailable,
        onClick: () => actions.openSettings(),
      }),
      divider,
      modeBtn,
    )
    if (mode === 'classic') row1.append(extBar)
    if (conversationGrip) row1.append(conversationGrip)

    // Row 2: Workspaces, search, and global actions.
    row2.replaceChildren()
    wsBar.replaceChildren()
    for (const g of groups) {
      const chip = document.createElement('div')
      chip.className = cls('wsChip')
      if (g.id === currentGroup.id) chip.dataset.active = 'true'

      const mainBtn = document.createElement('button')
      mainBtn.type = 'button'
      mainBtn.className = cls('wsMain')
      const switchLabel = t('workspace.switch', { workspace: g.title })
      mainBtn.title = g.path ? `${switchLabel} (${g.path})` : switchLabel
      mainBtn.setAttribute('aria-label', switchLabel)

      const nameSpan = document.createElement('span')
      nameSpan.textContent = g.title
      const countSpan = document.createElement('span')
      countSpan.className = cls('wsCount')
      countSpan.textContent = String(g.sessions.length)

      mainBtn.append(nameSpan, countSpan)
      if (g.running) {
        const rDot = document.createElement('span')
        rDot.className = cls('dot')
        rDot.dataset.running = 'true'
        mainBtn.append(rDot)
      }

      mainBtn.onclick = () => {
        selectedWorkspaceId = g.id
        writeStorage(WS_STORAGE_KEY, selectedWorkspaceId)
        const current = g.sessions.find(session => session.id === activeSessionId)
        const target = current ?? g.sessions[0]
        if (target && (!current || activePanelId !== null)) openSessionById(target.id)
        closeDropdown()
        render()
      }

      const caretBtn = document.createElement('button')
      caretBtn.type = 'button'
      caretBtn.className = cls('wsCaret')
      caretBtn.title = t('workspace.sessions', { workspace: g.title })
      caretBtn.setAttribute('aria-label', caretBtn.title)
      caretBtn.textContent = '▾'
      caretBtn.onclick = (e) => {
        e.stopPropagation()
        openSessionsDropdown(caretBtn, g, groups, activeSessionId)
      }

      chip.append(mainBtn, caretBtn)
      wsBar.append(chip)
    }

    const row2Right = document.createElement('div')
    row2Right.className = cls('navGroup')
    excludeFromWindowDrag(row2Right)

    const searchBtn = makeIconButton(t('chrome.search'), t('chrome.searchHint'), {
      onClick: (e) => {
        e.stopPropagation()
        openSessionsDropdown(searchBtn, currentGroup, groups, activeSessionId)
      },
    })
    row2Right.append(searchBtn)

    row2.append(wsBar)
    if (workspaceGrip) row2.append(workspaceGrip)
    row2.append(row2Right)
    if (mode === 'browser') row2.append(extBar)
    tabStrip.scrollLeft = tabScrollLeft
    wsBar.scrollLeft = workspaceScrollLeft
  }

  // The SDK retains the new main view before releasing the old one. Render once
  // after those synchronous notifications settle, so history sees one selection.
  let pendingRender = false
  let disposed = false
  const scheduleRender = (): void => {
    if (pendingRender || disposed) return
    pendingRender = true
    queueMicrotask(() => {
      pendingRender = false
      if (!disposed) render()
    })
  }
  const stopWatching = [
    workspaces.list.subscribe(scheduleRender),
    sessions.list.subscribe(scheduleRender),
    layout.panelInfo.subscribe(scheduleRender),
    locale.subscribe(() => { closeDropdown(); scheduleRender() }),
    ...[...panelSlots, ...actionSlots].map(slot => slots.subscribe(slot, scheduleRender)),
    ctx.on('slots/changed', slot => { if (slot === 'web-ui.extension') scheduleRender() }),
  ]
  render()

  const onDocPointerDown = (e: Event): void => {
    if (activeDropdown && e.target instanceof Node && !activeDropdown.contains(e.target) && !activeAnchor?.contains(e.target)) {
      closeDropdown()
    }
  }
  document.addEventListener('pointerdown', onDocPointerDown)
  const onStorage = (event: StorageEvent): void => {
    if (event.key !== TAB_ORDER_STORAGE_KEY && event.key !== null) return
    tabOrders = readTabOrders(readStorage(TAB_ORDER_STORAGE_KEY))
    scheduleRender()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    disposed = true
    document.removeEventListener('pointerdown', onDocPointerDown)
    window.removeEventListener('storage', onStorage)
    tabDrag.reset()
    for (const stop of stopWatching) stop()
    closeDropdown()
    body.removeAttribute('data-dsh-workspace-tabs')
    body.removeAttribute('data-workspace-tabs-mode')
    titlebar.remove()
    if (lastSkinTitle !== null && document.title === lastSkinTitle) {
      document.title = originalTitle
    }
  }
}
