import type { SessionSummary } from '@deepseek-ai/dsh-api-session-controller/client'

type SessionId = SessionSummary['id']
type DropSide = 'before' | 'after'
type MoveTab = (workspace: string, source: SessionId, target: SessionId, side: DropSide) => void

export function readTabOrders(raw: string | null): Map<string, string[]> {
  try {
    if (!raw) return new Map()
    const saved: unknown = JSON.parse(raw)
    if (saved === null || typeof saved !== 'object' || Array.isArray(saved)) return new Map()
    return new Map(Object.entries(saved).flatMap(([workspace, ids]) =>
      Array.isArray(ids) && ids.every(id => typeof id === 'string') ? [[workspace, [...new Set<string>(ids)]]] : []))
  } catch {
    return new Map()
  }
}

/** New conversations keep their recency order ahead of the positions the user saved. */
export function orderTabs(sessions: SessionSummary[], saved: readonly string[] | undefined): SessionSummary[] {
  if (!saved) return sessions
  const positions = new Map(saved.map((id, index) => [id, index]))
  return [...sessions].sort((a, b) => Number(b.blank) - Number(a.blank)
    || (positions.get(a.id) ?? -1) - (positions.get(b.id) ?? -1))
}

export function movedTabOrder(
  sessions: readonly SessionSummary[], saved: readonly string[] | undefined,
  source: SessionId, target: SessionId, side: DropSide,
): string[] | undefined {
  const visible = sessions.filter(row => !row.blank).map(row => row.id)
  const from = visible.indexOf(source)
  const to = visible.indexOf(target)
  if (from < 0 || to < 0 || from === to || (side === 'before' ? from + 1 === to : from - 1 === to)) return undefined

  // Keep saved positions for temporarily hidden conversations, such as archived rows.
  const prior = new Set(saved)
  const order: string[] = [...visible.filter(id => !prior.has(id)), ...prior].filter(id => id !== source)
  order.splice(order.indexOf(target) + (side === 'after' ? 1 : 0), 0, source)
  return order
}

/** Both horizontal tabs and vertical overflow rows use the same workspace-bounded drag. */
export function createTabDrag(move: MoveTab) {
  let source: { workspace: string; id: SessionId; button: HTMLButtonElement } | undefined
  let marker: HTMLButtonElement | undefined

  const clearMarker = () => {
    if (marker) delete marker.dataset.tabDrop
    marker = undefined
  }
  const reset = () => {
    clearMarker()
    if (source) delete source.button.dataset.tabDragging
    source = undefined
  }

  const bind = (button: HTMLButtonElement, workspace: string, id: SessionId, axis: 'x' | 'y') => {
    const side = (event: DragEvent): DropSide => {
      const rect = button.getBoundingClientRect()
      const before = axis === 'x'
        ? (event.clientX < rect.left + rect.width / 2) !== (getComputedStyle(button).direction === 'rtl')
        : event.clientY < rect.top + rect.height / 2
      return before ? 'before' : 'after'
    }
    button.draggable = true
    button.ondragstart = event => {
      if (!event.dataTransfer) return
      reset()
      source = { workspace, id, button }
      button.dataset.tabDragging = ''
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/x-dsh-workspace-tab', 'tab')
    }
    button.ondragover = event => {
      if (source?.workspace !== workspace || source.id === id) {
        clearMarker()
        return
      }
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
      if (marker !== button) clearMarker()
      marker = button
      button.dataset.tabDrop = side(event)
    }
    button.ondragleave = event => {
      if (marker === button && !(event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) clearMarker()
    }
    button.ondrop = event => {
      const dragged = source
      if (dragged?.workspace !== workspace || dragged.id === id) return
      event.preventDefault()
      reset()
      move(workspace, dragged.id, id, side(event))
    }
    button.ondragend = reset
  }

  return { bind, reset }
}
