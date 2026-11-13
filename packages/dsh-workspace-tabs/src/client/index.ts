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
import { buildWorkspaceGroups, cleanSessionTitle, mainSession, relativeTime, type WorkspaceGroup } from './workspaces.ts'
import css from './workspace-tabs.module.css'

export const inject = ['locale', 'workspaces', 'sessions', 'uiWorkspace', 'layout', 'slots']

type ChromeMode = 'browser' | 'classic'

const MODE_STORAGE_KEY = 'dsh-workspace-tabs:chrome-mode'
const WS_STORAGE_KEY = 'dsh-workspace-tabs:selected-workspace'
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

function makeIconButton(
  label: string,
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
  if (opts.compactLabel) {
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
  const markWindowRegion = (element: HTMLElement, draggable: boolean): void => {
    if (isMacOS) element.setAttribute(draggable ? 'data-window-drag' : 'data-no-drag', 'true')
  }
  const originalTitle = document.title
  let lastSkinTitle: string | null = null

  let mode: ChromeMode = readStorage(MODE_STORAGE_KEY) === 'classic' ? 'classic' : 'browser'
  let selectedWorkspaceId: string | null = readStorage(WS_STORAGE_KEY) || null
  const sessionHistory: SessionSummary['id'][] = []
  let historyIndex = -1
  let lastActiveSessionId: SessionSummary['id'] | null = null
  let activeDropdown: HTMLElement | null = null
  let activeAnchor: HTMLElement | null = null
  let lastRenderKey = ''

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
  markWindowRegion(titlebar, true)

  const row1 = document.createElement('div')
  row1.className = cls('row1')
  markWindowRegion(row1, true)

  const row2 = document.createElement('div')
  row2.className = cls('row2')
  markWindowRegion(row2, true)

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

  const createAnchoredDropdown = (anchorEl: HTMLElement, anchorId: string, alignRight = false): HTMLDivElement | null => {
    if (activeDropdown && activeAnchor === anchorEl && activeDropdown.dataset.anchorId === anchorId) {
      closeDropdown()
      return null
    }
    closeDropdown()
    const rect = anchorEl.getBoundingClientRect()
    const dd = document.createElement('div')
    dd.className = cls('dropdown')
    dd.dataset.skinChrome = 'dropdown'
    dd.dataset.anchorId = anchorId
    dd.dataset.dshPlugin = 'workspace-tabs'
    activeAnchor = anchorEl
    markWindowRegion(dd, false)
    const top = Math.min(window.innerHeight - 80, Math.round(rect.bottom + 4))
    const rawLeft = alignRight ? rect.right - 260 : rect.left
    const left = Math.max(8, Math.min(window.innerWidth - 320, Math.round(rawLeft)))
    dd.style.top = `${top}px`
    dd.style.left = `${left}px`
    return dd
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
    const activeSession = mainSession(sessionSnapshot)
    const activeSessionId = activeSession?.id ?? null
    const panels = panelEntries(slots)
    const groups = buildWorkspaceGroups(workspaceSnapshot, sessionSnapshot, activeSession, t)
    const groupWithActiveSession = groups.find(group => group.sessions.some(session => session.id === activeSessionId))

    if (activeSessionId !== lastActiveSessionId) {
      if (activeSessionId) {
        if (sessionHistory[historyIndex] !== activeSessionId) {
          sessionHistory.splice(historyIndex + 1)
          sessionHistory.push(activeSessionId)
          historyIndex = sessionHistory.length - 1
        }
        if (lastActiveSessionId && groupWithActiveSession) selectedWorkspaceId = groupWithActiveSession.id
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

    updateWindowTitle(Boolean(activeSession), activeWsTitle, activeSessionTitle)

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

    // --- Row 1: Navigation + Chrome Tab Strip (or Classic Mac pill) + Top-Right Extension Bar ---
    row1.replaceChildren()

    const navGroup = document.createElement('div')
    navGroup.className = cls('navGroup')
    markWindowRegion(navGroup, false)

    navGroup.append(
      makeIconButton('◧', t('chrome.sidebar'), { onClick: () => layout.toggleSidebar() }),
      makeIconButton('←', t('session.back'), {
        disabled: !canBack,
        onClick: () => moveInHistory(-1),
      }),
      makeIconButton('→', t('session.forward'), {
        disabled: !canFwd,
        onClick: () => moveInHistory(1),
      }),
    )
    row1.append(navGroup)

    // Chrome Tab Strip
    const tabStripWrap = document.createElement('div')
    tabStripWrap.className = cls('tabStripWrap')
    markWindowRegion(tabStripWrap, true)

    const tabStrip = document.createElement('div')
    tabStrip.className = cls('tabStrip')
    markWindowRegion(tabStrip, false)

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

    const row1Spacer = document.createElement('div')
    row1Spacer.className = cls('dragSpacer')
    markWindowRegion(row1Spacer, true)

    tabStripWrap.append(tabStrip, newTabBtn, allTabsBtn, row1Spacer)
    row1.append(tabStripWrap)

    // Classic Mac centered Workspace / Conversation pill
    const classicCenter = document.createElement('div')
    classicCenter.className = cls('classicCenter')
    markWindowRegion(classicCenter, true)

    const classicPill = document.createElement('button')
    classicPill.type = 'button'
    classicPill.className = cls('classicPill')
    markWindowRegion(classicPill, false)
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

    // Top-Right Extension Bar (Plugins & Global Actions)
    const extBar = document.createElement('div')
    extBar.className = cls('extBar')
    markWindowRegion(extBar, false)

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
    row1.append(extBar)

    // --- Row 2: Chrome Bookmark Bar (Workspaces) ---
    row2.replaceChildren()
    const wsBar = document.createElement('div')
    wsBar.className = cls('wsBar')

    for (const g of groups) {
      const chip = document.createElement('div')
      chip.className = cls('wsChip')
      markWindowRegion(chip, false)
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

    const row2Spacer = document.createElement('div')
    row2Spacer.className = cls('dragSpacer')
    markWindowRegion(row2Spacer, true)

    const row2Right = document.createElement('div')
    row2Right.className = cls('navGroup')
    markWindowRegion(row2Right, false)

    const searchBtn = makeIconButton(t('chrome.search'), t('chrome.searchHint'), {
      onClick: (e) => {
        e.stopPropagation()
        openSessionsDropdown(searchBtn, currentGroup, groups, activeSessionId)
      },
    })
    row2Right.append(searchBtn)

    row2.append(wsBar, row2Spacer, row2Right)
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

  return () => {
    disposed = true
    document.removeEventListener('pointerdown', onDocPointerDown)
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
