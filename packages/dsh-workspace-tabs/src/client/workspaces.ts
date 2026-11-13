import type { SessionListState, SessionSummary } from '@deepseek-ai/dsh-api-session-controller/client'
import type { WorkspaceId, WorkspaceSnapshot } from '@deepseek-ai/dsh-api-workspace-controller/client'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import type { WorkspaceTabsKey } from './locales.ts'

export interface WorkspaceGroup {
  id: string
  workspaceId?: WorkspaceId
  title: string
  path: string
  sessions: SessionSummary[]
  running: boolean
}

const UNGROUPED_ID = '__ungrouped__'

/** Strip a ChatML prompt prefix without exposing it in the tab label. */
export function cleanSessionTitle(raw: string | undefined, fallback: string): string {
  const title = raw?.trim() ?? ''
  if (!title.startsWith('<|im_start|>')) return title || fallback
  return title.replace(/^<\|im_start\|>[^\n]*\n?/, '').replace(/<[^>]+>/g, ' ').trim() || fallback
}

/** Main-area ownership is published through the list; the UI service keeps its reference private. */
export function mainSession(sessions: SessionListState): SessionSummary | undefined {
  return Object.values(sessions.byId).find(row => (row?.retainedBy.mainView ?? 0) > 0)
}

/** Combine the host workspace registry and session list without exposing archived or unused blank rows. */
export function buildWorkspaceGroups(
  workspaces: WorkspaceSnapshot,
  sessions: SessionListState,
  active: SessionSummary | undefined,
  t: Translate<WorkspaceTabsKey>,
): WorkspaceGroup[] {
  const archived = new Set(workspaces.archivedSessionIds)
  const claimed = new Set<SessionSummary['id']>()
  const visible = (id: SessionSummary['id']): SessionSummary[] => {
    const session = sessions.byId[id]
    return session && !archived.has(id) && (!session.blank || id === active?.id) ? [session] : []
  }
  const sortRecent = (a: SessionSummary, b: SessionSummary) => b.updatedAt - a.updatedAt
  const groups: WorkspaceGroup[] = workspaces.items.map(({ workspaceId, title, path, sessionIds }) => {
    for (const id of sessionIds) claimed.add(id)
    const members = sessionIds.flatMap(visible).sort(sortRecent)
    return {
      id: workspaceId,
      workspaceId,
      title: title || path.split(/[/\\]/).filter(Boolean).at(-1) || t('workspace.default'),
      path,
      sessions: members,
      running: members.some(session => session.running),
    }
  })

  // The selected session can be a retained row outside the host catalog (for example a subagent).
  const allIds = new Set(sessions.ids)
  if (active) allIds.add(active.id)
  const members = [...allIds].filter(id => !claimed.has(id)).flatMap(visible).sort(sortRecent)
  if (members.length > 0 || groups.length === 0) {
    groups.push({
      id: UNGROUPED_ID,
      title: t('workspace.ungrouped'),
      path: '',
      sessions: members,
      running: members.some(session => session.running),
    })
  }
  return groups
}

/** Format the numeric SDK timestamp using the active locale, including plural rules. */
export function relativeTime(timestamp: number, now: number, t: Translate<WorkspaceTabsKey>, format: Intl.RelativeTimeFormat): string {
  if (!Number.isFinite(timestamp)) return ''
  const minutes = Math.floor(Math.max(0, now - timestamp) / 60_000)
  if (minutes === 0) return t('session.justNow')
  if (minutes < 60) return format.format(-minutes, 'minute')
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return format.format(-hours, 'hour')
  const days = Math.floor(hours / 24)
  return days < 30 ? format.format(-days, 'day') : format.format(-Math.floor(days / 30), 'month')
}
