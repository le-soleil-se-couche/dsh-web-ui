/**
 * Workspace Tabs skin — macOS draggable window chrome with Chrome-inspired
 * workspace bookmarks + conversation tabs + top-right extension bar,
 * toggleable to a compact Classic Mac single-row topbar.
 *
 * Retraction discipline: apply() only removes/restores attributes, DOM chrome,
 * timers, listeners, and title writes it created.
 */
import type { Context } from '@deepseek-ai/cordis'
import css from './workspace-tabs.module.css'

type ChromeMode = 'browser' | 'classic'

interface SessionSummary {
  id: string
  title?: string
  displayTitle?: string
  updatedAt?: string | number
  blank?: boolean
  running?: boolean
  retainedBy?: { mainView?: number }
}

interface WorkspaceItem {
  workspaceId: string
  title?: string
  path?: string
  sessionIds?: string[]
}

interface WorkspaceGroup {
  id: string
  title: string
  path: string
  sessions: SessionSummary[]
  running: boolean
}

interface PanelEntry {
  id: string
  order: number
  label: string
}

interface DshServices {
  workspaces?: {
    list?: {
      getSnapshot?: () => { items?: WorkspaceItem[]; archivedSessionIds?: string[] }
      subscribe?: (cb: () => void) => () => void
    }
  }
  sessions?: {
    list?: {
      getSnapshot?: () => { ids?: string[]; byId?: Record<string, SessionSummary> }
      subscribe?: (cb: () => void) => () => void
    }
  }
  uiWorkspace?: {
    mainReference?: { sessionId?: string }
    selection?: {
      getSnapshot?: () => { sessionId?: string }
      subscribe?: (cb: () => void) => () => void
    }
    openSession?: (id: string) => void
    startSession?: (workspaceId?: string) => void
  }
  layout?: {
    panelInfo?: {
      getSnapshot?: () => { activePanelId?: string | null }
      subscribe?: (cb: () => void) => () => void
    }
    selectPanel?: (id: string | null) => void
    toggleSidebar?: () => void
  }
  slots?: {
    entriesOfSlot?: (slot: string) => Array<{ options?: { id?: string; order?: number; label?: string | (() => string) } }>
    subscribe?: (slot: string, cb: () => void) => () => void
  }
}

const MODE_STORAGE_KEY = 'dsh-workspace-tabs:chrome-mode'
const WS_STORAGE_KEY = 'dsh-workspace-tabs:selected-workspace'
const UNGROUPED_ID = '__ungrouped__'
const DEFAULT_APP_TITLE = 'DeepSeek Harness'
const MAX_VISIBLE_TABS = 12

const cls = (name: keyof typeof css): string => css[name] ?? ''

/** Strip ChatML tags and fallback cleanly for blank session titles. */
export function cleanSessionTitle(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '新对话'
  let s = raw.trim()
  if (s.startsWith('<|im_start|>')) {
    s = s.replace(/^<\|im_start\|>[^\n]*\n?/g, '').replace(/<[^>]+>/g, ' ').trim()
  }
  return s || '新对话'
}

function formatRelativeTime(isoOrMs?: string | number): string {
  if (!isoOrMs) return ''
  const ts = typeof isoOrMs === 'number' ? isoOrMs : Date.parse(isoOrMs)
  if (!Number.isFinite(ts)) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (diffSec < 60) return '刚刚'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}分钟`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}小时`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}天`
  return `${Math.floor(diffDay / 30)}月`
}

function clickDomSelector(selector: string, textHint?: string): boolean {
  const nodes = Array.from(document.querySelectorAll(selector))
  if (textHint) {
    const matched = nodes.find((el) => {
      const txt = el.textContent || ''
      const label = el.getAttribute('aria-label') || ''
      return txt.includes(textHint) || label.includes(textHint)
    })
    if (matched instanceof HTMLElement) {
      matched.click()
      return true
    }
  }
  const first = nodes[0]
  if (first instanceof HTMLElement) {
    first.click()
    return true
  }
  return false
}

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

function resolveSlotLabel(raw: string | (() => string) | undefined, fallback: string): string {
  if (typeof raw === 'function') {
    try {
      return raw() || fallback
    } catch {
      return fallback
    }
  }
  return raw || fallback
}

function getPanelEntries(slots?: DshServices['slots']): PanelEntry[] {
  const entries = slots?.entriesOfSlot?.('sidebar.panellist') ?? []
  return entries
    .map((entry) => {
      const id = entry.options?.id ?? ''
      if (!id) return null
      return {
        id,
        order: entry.options?.order ?? 0,
        label: resolveSlotLabel(entry.options?.label, id),
      }
    })
    .filter((item): item is PanelEntry => item !== null)
    .sort((a, b) => a.order - b.order)
}

function makeIconButton(
  label: string,
  tooltip: string,
  opts: { active?: boolean; disabled?: boolean; extraClass?: string; onClick: (e: MouseEvent) => void },
): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = opts.extraClass ? `${cls('iconBtn')} ${opts.extraClass}` : cls('iconBtn')
  if (opts.active) btn.dataset.active = 'true'
  if (opts.disabled) btn.disabled = true
  btn.title = tooltip
  btn.textContent = label
  btn.onclick = opts.onClick
  return btn
}

/**
 * Apply the Workspace Tabs skin: scoped palette variables, macOS draggable chrome bar
 * (Chrome Browser mode / Classic Mac mode), clean window title, and store reactivity.
 */
export function apply(ctx: Context): void {
  const body = document.body
  const isMacOS = document.documentElement.dataset.platform === 'darwin'
  const markWindowRegion = (element: HTMLElement, draggable: boolean): void => {
    if (isMacOS) element.setAttribute(draggable ? 'data-window-drag' : 'data-no-drag', 'true')
  }
  const originalTitle = document.title
  let lastSkinTitle: string | null = null

  for (const stale of Array.from(document.querySelectorAll('[data-skin-chrome="titlebar"], [data-skin-chrome="dropdown"]'))) {
    stale.remove()
  }

  let mode: ChromeMode = readStorage(MODE_STORAGE_KEY) === 'classic' ? 'classic' : 'browser'
  let selectedWorkspaceId: string | null = readStorage(WS_STORAGE_KEY) || null
  const sessionHistory: string[] = []
  let historyIndex = -1
  let lastActiveSessionId: string | null = null
  let activeDropdown: HTMLElement | null = null
  let lastRenderKey = ''

  const closeDropdown = (): void => {
    if (activeDropdown) {
      activeDropdown.remove()
      activeDropdown = null
    }
  }

  body.setAttribute('data-dsh-workspace-tabs', '')
  body.setAttribute('data-workspace-tabs-mode', mode)

  const titlebar = document.createElement('div')
  titlebar.className = cls('titlebar')
  titlebar.dataset.skinChrome = 'titlebar'
  markWindowRegion(titlebar, true)

  const row1 = document.createElement('div')
  row1.className = cls('row1')
  markWindowRegion(row1, true)

  const row2 = document.createElement('div')
  row2.className = cls('row2')
  markWindowRegion(row2, true)

  titlebar.append(row1, row2)
  body.append(titlebar)

  const getServices = (): DshServices => {
    const get = (ctx as unknown as { get?: (name: string) => unknown }).get
    if (typeof get !== 'function') return {}
    return {
      workspaces: get.call(ctx, 'workspaces') as DshServices['workspaces'],
      sessions: get.call(ctx, 'sessions') as DshServices['sessions'],
      uiWorkspace: get.call(ctx, 'uiWorkspace') as DshServices['uiWorkspace'],
      layout: get.call(ctx, 'layout') as DshServices['layout'],
      slots: get.call(ctx, 'slots') as DshServices['slots'],
    }
  }

  const getActiveSessionId = (
    sesSnap?: { byId?: Record<string, SessionSummary> },
    uiWorkspace?: DshServices['uiWorkspace'],
  ): string | null => {
    const mainRefId = uiWorkspace?.mainReference?.sessionId
    if (mainRefId && sesSnap?.byId?.[mainRefId]) return mainRefId
    const selId = uiWorkspace?.selection?.getSnapshot?.()?.sessionId
    if (selId && sesSnap?.byId?.[selId]) return selId
    if (sesSnap?.byId) {
      for (const s of Object.values(sesSnap.byId)) {
        if ((s?.retainedBy?.mainView ?? 0) > 0) return s.id
      }
    }
    return null
  }

  const buildWorkspaceGroups = (
    wsSnap?: { items?: WorkspaceItem[]; archivedSessionIds?: string[] },
    sesSnap?: { ids?: string[]; byId?: Record<string, SessionSummary> },
  ): WorkspaceGroup[] => {
    const items = wsSnap?.items ?? []
    const archived = new Set(wsSnap?.archivedSessionIds ?? [])
    const byId = sesSnap?.byId ?? {}
    const allIds = sesSnap?.ids ?? Object.keys(byId)
    const claimed = new Set<string>()

    const groups: WorkspaceGroup[] = items.map((ws) => {
      const rawIds = ws.sessionIds ?? []
      const validSessions: SessionSummary[] = []
      for (const id of rawIds) {
        claimed.add(id)
        if (archived.has(id)) continue
        const s = byId[id]
        if (!s || s.blank) continue
        validSessions.push(s)
      }
      validSessions.sort((a, b) => (Date.parse(String(b.updatedAt || 0)) || 0) - (Date.parse(String(a.updatedAt || 0)) || 0))
      return {
        id: ws.workspaceId,
        title: ws.title || (ws.path ? ws.path.split('/').pop() || '工作区' : '工作区'),
        path: ws.path || '',
        sessions: validSessions,
        running: validSessions.some((s) => Boolean(s.running)),
      }
    })

    const ungroupedSessions: SessionSummary[] = []
    for (const id of allIds) {
      if (claimed.has(id) || archived.has(id)) continue
      const s = byId[id]
      if (!s || s.blank) continue
      ungroupedSessions.push(s)
    }
    ungroupedSessions.sort((a, b) => (Date.parse(String(b.updatedAt || 0)) || 0) - (Date.parse(String(a.updatedAt || 0)) || 0))
    if (ungroupedSessions.length > 0 || groups.length === 0) {
      groups.push({
        id: UNGROUPED_ID,
        title: '未分组',
        path: '',
        sessions: ungroupedSessions,
        running: ungroupedSessions.some((s) => Boolean(s.running)),
      })
    }
    return groups
  }

  const openSessionById = (sessionId?: string): void => {
    if (!sessionId) return
    const { uiWorkspace, layout } = getServices()
    try {
      layout?.selectPanel?.(null)
    } catch { /* ignore */ }
    try {
      uiWorkspace?.openSession?.(sessionId)
    } catch { /* ignore */ }
    closeDropdown()
  }

  const startNewSessionInWorkspace = (wsId?: string): void => {
    const { uiWorkspace, layout } = getServices()
    try {
      layout?.selectPanel?.(null)
    } catch { /* ignore */ }
    try {
      if (!wsId || wsId === UNGROUPED_ID) uiWorkspace?.startSession?.()
      else uiWorkspace?.startSession?.(wsId)
    } catch { /* ignore */ }
    closeDropdown()
  }

  const createAnchoredDropdown = (anchorEl: HTMLElement, anchorId: string, alignRight = false): HTMLDivElement | null => {
    if (activeDropdown && activeDropdown.dataset.anchorId === anchorId) {
      closeDropdown()
      return null
    }
    closeDropdown()
    const rect = anchorEl.getBoundingClientRect()
    const dd = document.createElement('div')
    dd.className = cls('dropdown')
    dd.dataset.skinChrome = 'dropdown'
    dd.dataset.anchorId = anchorId
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
    hTitle.textContent = ` ${group.title} (${group.sessions.length})`
    const newBtn = makeIconButton('+ 新建对话', `在「${group.title}」新建对话`, {
      onClick: (e) => {
        e.stopPropagation()
        startNewSessionInWorkspace(group.id)
      },
    })
    header.append(hTitle, newBtn)
    dd.append(header)

    const searchInput = document.createElement('input')
    searchInput.type = 'search'
    searchInput.className = cls('ddSearch')
    searchInput.placeholder = '筛选此工作目录或全部会话...'
    dd.append(searchInput)

    const listWrap = document.createElement('div')
    dd.append(listWrap)

    const renderItems = (q: string): void => {
      listWrap.replaceChildren()
      const query = q.trim().toLowerCase()
      const pool = query
        ? allGroups.flatMap((g) => g.sessions.map((s) => ({ s, gTitle: g.title })))
        : group.sessions.map((s) => ({ s, gTitle: null as string | null }))
      const filtered = query
        ? pool.filter(({ s, gTitle }) =>
            cleanSessionTitle(s.displayTitle || s.title).toLowerCase().includes(query)
            || (gTitle !== null && gTitle.toLowerCase().includes(query)),
          )
        : pool

      if (filtered.length === 0) {
        const empty = document.createElement('div')
        empty.className = cls('ddEmpty')
        empty.textContent = '暂无匹配的对话'
        listWrap.append(empty)
        return
      }
      for (const { s, gTitle } of filtered) {
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
        const clean = cleanSessionTitle(s.displayTitle || s.title)
        tSpan.textContent = gTitle ? `[${gTitle}] ${clean}` : clean
        tSpan.title = s.displayTitle || s.title || clean
        const meta = document.createElement('span')
        meta.className = cls('ddItemMeta')
        meta.textContent = formatRelativeTime(s.updatedAt)
        item.append(dot, tSpan, meta)
        item.onclick = (e) => {
          e.stopPropagation()
          selectedWorkspaceId = group.id
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
    setTimeout(() => searchInput.focus(), 0)
  }

  const openPanelsDropdown = (
    anchorEl: HTMLElement,
    panelEntries: PanelEntry[],
    activePanelId: string | null,
    layout?: DshServices['layout'],
  ): void => {
    if (panelEntries.length === 0) {
      clickDomSelector('.kB3qhq_moreAnchor button', '更多')
      return
    }
    const dd = createAnchoredDropdown(anchorEl, 'more:panels', true)
    if (!dd) return

    const header = document.createElement('div')
    header.className = cls('ddHeader')
    const hTitle = document.createElement('span')
    hTitle.textContent = `全部全局面板 (${panelEntries.length})`
    header.append(hTitle)
    dd.append(header)

    for (const p of panelEntries) {
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
        try {
          layout?.selectPanel?.(p.id === activePanelId ? null : p.id)
        } catch {
          clickDomSelector('.kB3qhq_panelList button', p.label)
        }
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
    const { workspaces, sessions, uiWorkspace, layout, slots } = getServices()
    const wsSnap = workspaces?.list?.getSnapshot?.()
    const sesSnap = sessions?.list?.getSnapshot?.()
    const panelSnap = layout?.panelInfo?.getSnapshot?.()
    const activePanelId = panelSnap?.activePanelId ?? null
    const activeSessionId = getActiveSessionId(sesSnap, uiWorkspace)
    const panelEntries = getPanelEntries(slots)

    if (activeSessionId && activeSessionId !== lastActiveSessionId) {
      lastActiveSessionId = activeSessionId
      if (sessionHistory[historyIndex] !== activeSessionId) {
        sessionHistory.splice(historyIndex + 1)
        sessionHistory.push(activeSessionId)
        historyIndex = sessionHistory.length - 1
      }
    }

    const groups = buildWorkspaceGroups(wsSnap, sesSnap)
    const groupWithActiveSession = groups.find((g) => g.sessions.some((s) => s.id === activeSessionId))

    if (!selectedWorkspaceId || !groups.some((g) => g.id === selectedWorkspaceId)) {
      selectedWorkspaceId = groupWithActiveSession?.id ?? groups[0]?.id ?? UNGROUPED_ID
    }

    const currentGroup = groups.find((g) => g.id === selectedWorkspaceId) ?? groups[0] ?? {
      id: UNGROUPED_ID,
      title: '未分组',
      path: '',
      sessions: [],
      running: false,
    }

    const activeSessionObj = sesSnap?.byId && activeSessionId ? sesSnap.byId[activeSessionId] : undefined
    const activeSessionTitle = activeSessionObj ? cleanSessionTitle(activeSessionObj.displayTitle || activeSessionObj.title) : '未选择会话'
    const activeWsTitle = groupWithActiveSession?.title ?? currentGroup.title

    updateWindowTitle(Boolean(activeSessionObj), activeWsTitle, activeSessionTitle)

    const visibleTabs = currentGroup.sessions.slice(0, MAX_VISIBLE_TABS)
    const canBack = historyIndex > 0
    const canFwd = historyIndex >= 0 && historyIndex < sessionHistory.length - 1

    // Diff DOM key so identical state does not rebuild row1/row2 or trigger DSH drag-recall flicker.
    const nextRenderKey = JSON.stringify({
      mode,
      activePanelId,
      activeSessionId,
      currentGroupId: currentGroup.id,
      canBack,
      canFwd,
      tabs: visibleTabs.map((s) => [s.id, s.running ? 1 : 0, s.displayTitle || s.title || '']),
      groups: groups.map((g) => [g.id, g.title, g.sessions.length, g.running ? 1 : 0]),
      panels: panelEntries.map((p) => [p.id, p.label]),
    })
    if (nextRenderKey === lastRenderKey) return
    lastRenderKey = nextRenderKey

    // --- Row 1: Navigation + Chrome Tab Strip (or Classic Mac pill) + Top-Right Extension Bar ---
    row1.replaceChildren()

    const navGroup = document.createElement('div')
    navGroup.className = cls('navGroup')
    markWindowRegion(navGroup, false)

    navGroup.append(
      makeIconButton('◧', '展开/收起左侧边栏 (⌘B)', {
        onClick: () => {
          if (layout?.toggleSidebar) layout.toggleSidebar()
          else clickDomSelector('[data-sidebar-toggle], [data-sidebar-opener]')
        },
      }),
      makeIconButton('←', '返回上一个会话', {
        disabled: !canBack,
        onClick: () => {
          if (historyIndex > 0) {
            historyIndex -= 1
            const targetId = sessionHistory[historyIndex]
            lastActiveSessionId = targetId
            openSessionById(targetId)
          }
        },
      }),
      makeIconButton('→', '前进到下一个会话', {
        disabled: !canFwd,
        onClick: () => {
          if (historyIndex < sessionHistory.length - 1) {
            historyIndex += 1
            const targetId = sessionHistory[historyIndex]
            lastActiveSessionId = targetId
            openSessionById(targetId)
          }
        },
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
      const fullTitle = cleanSessionTitle(s.displayTitle || s.title)
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

    const newTabBtn = makeIconButton('+', `在「${currentGroup.title}」新建对话`, {
      onClick: () => startNewSessionInWorkspace(currentGroup.id),
    })

    const allTabsBtn = makeIconButton(`▾ ${currentGroup.sessions.length}`, `查看「${currentGroup.title}」全部 ${currentGroup.sessions.length} 个对话`, {
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
    classicPill.title = '点击快速切换工作区与对话'

    const wsSpan = document.createElement('span')
    wsSpan.className = cls('classicWs')
    wsSpan.textContent = activeWsTitle
    const sepSpan = document.createElement('span')
    sepSpan.className = cls('classicSep')
    sepSpan.textContent = '/'
    const sesSpan = document.createElement('span')
    sesSpan.className = cls('classicSes')
    const activePanelObj = panelEntries.find((p) => p.id === activePanelId)
    sesSpan.textContent = activePanelObj
      ? activePanelObj.label
      : activePanelId === 'plugins'
        ? '插件管理'
        : activePanelId === 'schedules'
          ? '自动化任务'
          : activeSessionTitle
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

    const togglePanel = (panelId: string, labelHint: string): void => {
      try {
        layout?.selectPanel?.(activePanelId === panelId ? null : panelId)
      } catch {
        clickDomSelector('.kB3qhq_panelList button', labelHint)
      }
    }

    const otherPanelActive = activePanelId !== null && activePanelId !== 'plugins' && activePanelId !== 'schedules'

    const moreBtn = makeIconButton('⊞ 更多', '更多全局面板', {
      active: otherPanelActive,
      onClick: (e) => {
        e.stopPropagation()
        openPanelsDropdown(moreBtn, panelEntries, activePanelId, layout)
      },
    })

    const modeBtn = makeIconButton(
      mode === 'browser' ? '⌘ 经典顶栏' : '浏览器顶栏',
      mode === 'browser' ? '一键切换回经典 Mac 紧凑顶栏模式' : '一键切换到 Chrome 风格工作目录+会话标签栏模式',
      {
        extraClass: cls('modeBtn'),
        onClick: () => setMode(mode === 'browser' ? 'classic' : 'browser'),
      },
    )

    const divider = document.createElement('span')
    divider.className = cls('divider')

    extBar.append(
      makeIconButton('插件', '打开/关闭插件面板', {
        active: activePanelId === 'plugins',
        onClick: () => togglePanel('plugins', '插件'),
      }),
      makeIconButton('自动化', '打开/关闭自动化任务', {
        active: activePanelId === 'schedules',
        onClick: () => togglePanel('schedules', '自动化'),
      }),
      makeIconButton('用量', '打开全量 Token / 费用统计', {
        onClick: () => clickDomSelector('button.uh-side-entry, .kB3qhq_footerActions button', '用量'),
      }),
      makeIconButton('Remote', '打开远程连接与控制 (ds-harness-remote)', {
        onClick: () => clickDomSelector('.kB3qhq_footerActions button', 'R'),
      }),
      moreBtn,
      makeIconButton('设置', '打开账号与系统设置 (⌘,)', {
        onClick: () => {
          if (!clickDomSelector('.kB3qhq_settingsArea button, .kB3qhq_footArea > button')) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: ',', code: 'Comma', metaKey: true, bubbles: true }))
          }
        },
      }),
      divider,
      modeBtn,
    )
    row1.append(extBar)

    // --- Row 2: Chrome Bookmark Bar (Workspaces / 工作目录) ---
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
      mainBtn.title = g.path ? `${g.title} (${g.path})\n点击切换工作目录` : `${g.title}\n点击切换工作目录`

      const iconSpan = document.createElement('span')
      iconSpan.textContent = g.id === UNGROUPED_ID ? 'Group' : 'Folder'
      const nameSpan = document.createElement('span')
      nameSpan.textContent = g.title
      const countSpan = document.createElement('span')
      countSpan.className = cls('wsCount')
      countSpan.textContent = String(g.sessions.length)

      mainBtn.append(iconSpan, nameSpan, countSpan)
      if (g.running) {
        const rDot = document.createElement('span')
        rDot.className = cls('dot')
        rDot.dataset.running = 'true'
        mainBtn.append(rDot)
      }

      mainBtn.onclick = () => {
        selectedWorkspaceId = g.id
        writeStorage(WS_STORAGE_KEY, selectedWorkspaceId)
        if (g.sessions.length > 0 && !g.sessions.some((s) => s.id === activeSessionId)) {
          openSessionById(g.sessions[0].id)
        } else {
          render()
        }
      }

      const caretBtn = document.createElement('button')
      caretBtn.type = 'button'
      caretBtn.className = cls('wsCaret')
      caretBtn.title = `展开「${g.title}」的对话书签菜单`
      caretBtn.textContent = '▾'
      caretBtn.onclick = (e) => {
        e.stopPropagation()
        selectedWorkspaceId = g.id
        writeStorage(WS_STORAGE_KEY, selectedWorkspaceId)
        render()
        openSessionsDropdown(chip, g, groups, activeSessionId)
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

    const searchBtn = makeIconButton('搜索', '搜索全部工作目录与对话', {
      onClick: (e) => {
        e.stopPropagation()
        openSessionsDropdown(searchBtn, currentGroup, groups, activeSessionId)
      },
    })
    row2Right.append(searchBtn)

    row2.append(wsBar, row2Spacer, row2Right)
  }

  const unsubscribers: Array<() => void> = []
  let bindAttempts = 0
  let bindTimer: ReturnType<typeof setInterval> | null = null

  const bindStores = (): boolean => {
    while (unsubscribers.length > 0) {
      try {
        unsubscribers.pop()?.()
      } catch { /* ignore */ }
    }
    const { workspaces, sessions, uiWorkspace, layout, slots } = getServices()
    let boundCore = 0
    if (workspaces?.list?.subscribe) {
      unsubscribers.push(workspaces.list.subscribe(render))
      boundCore += 1
    }
    if (sessions?.list?.subscribe) {
      unsubscribers.push(sessions.list.subscribe(render))
      boundCore += 1
    }
    if (uiWorkspace?.selection?.subscribe) {
      unsubscribers.push(uiWorkspace.selection.subscribe(render))
      boundCore += 1
    }
    if (layout?.panelInfo?.subscribe) {
      unsubscribers.push(layout.panelInfo.subscribe(render))
      boundCore += 1
    }
    if (slots?.subscribe) {
      unsubscribers.push(slots.subscribe('sidebar.panellist', render))
    }
    render()
    return boundCore >= 4
  }

  if (!bindStores()) {
    bindTimer = setInterval(() => {
      bindAttempts += 1
      if (bindStores() || bindAttempts >= 20) {
        if (bindTimer !== null) {
          clearInterval(bindTimer)
          bindTimer = null
        }
      }
    }, 500)
  }

  const onDocPointerDown = (e: Event): void => {
    if (activeDropdown && e.target instanceof Node && !activeDropdown.contains(e.target)) {
      closeDropdown()
    }
  }
  document.addEventListener('pointerdown', onDocPointerDown)

  ctx.effect(() => () => {
    if (bindTimer !== null) {
      clearInterval(bindTimer)
      bindTimer = null
    }
    document.removeEventListener('pointerdown', onDocPointerDown)
    while (unsubscribers.length > 0) {
      try {
        unsubscribers.pop()?.()
      } catch { /* ignore */ }
    }
    closeDropdown()
    body.removeAttribute('data-dsh-workspace-tabs')
    body.removeAttribute('data-workspace-tabs-mode')
    titlebar.remove()
    if (lastSkinTitle !== null && document.title === lastSkinTitle) {
      document.title = originalTitle
    }
  }, 'ui-skin-workspace-tabs: Workspace Tabs chrome')
}
