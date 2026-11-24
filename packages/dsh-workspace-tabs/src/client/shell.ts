import type { Context } from '@deepseek-ai/cordis'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { resolveSlotLabel } from '@deepseek-ai/dsh-client-ui-slots'

const USAGE_SECTION_ID = 'dsh-usage'
const ALL_USAGE_ACTION_ID = 'all-usage'
const ALL_USAGE_TRIGGER = 'button.uh-side-entry'
const REMOTE_WORKSPACE_ACTION_ID = 'ds-harness-remote-workspace'
const REMOTE_WEB_TRIGGER = 'button[data-testid="remote-trigger"]'
const REMOTE_PAIR_TRIGGER = 'button[data-dsh-plugin="remote-bridge"][data-dsh-part="entry"]'
const REMOTE_WORKSPACE_TRIGGER = 'button.dshRemoteModeButton'
const REMOTE_WORKSPACE_COMPACT_TRIGGER = 'button.dshRemoteAccountEntryButton'

export const panelSlots = ['sidebar.panellist', 'main'] as const
export const actionSlots = ['sidebar.settings', 'settings.section', 'sidebar.footer.action'] as const

interface SettingsActions {
  open?: () => void
  openSection?: (id: string) => void
}

/** Optional published cross-plugin contract; avoids depending on a separate bundle. */
interface WebUiExtensions {
  getPages(): readonly { key: string }[]
  open(id: string): boolean
}

/** Pair sidebar metadata with real main-slot entries; orphan rows cannot navigate. */
export function panelEntries(slots: Context['slots']): { id: MainPanelId; label: string }[] {
  const panels = new Set(slots.entriesOfSlot('main').map(({ options }) => options.key))
  return slots.entriesOfSlot('sidebar.panellist')
    .flatMap(({ options: { id, label, order } }) => {
      if (!id || !panels.has(id)) return []
      let text: string | undefined
      try { text = resolveSlotLabel(label) } catch { /* A third-party label may fail on unload. */ }
      return [{ id: id as MainPanelId, label: text || id, order: order ?? 0 }]
    })
    .sort((a, b) => a.order - b.order)
}

/** The official sidebar Settings occupant shares one root store with its keyboard command. */
function settingsStore(slots: Context['slots']) {
  const store = slots.entriesOfSlot('sidebar.settings')[0]?.store
  return store && 'create' in store && typeof store.create === 'function' ? store : undefined
}

function usageExtensions(ctx: Context): WebUiExtensions | undefined {
  const service = ctx.get('webUiExtensions') as Partial<WebUiExtensions> | undefined
  return typeof service?.getPages === 'function'
    && typeof service.open === 'function'
    && service.getPages().some(({ key }) => key === USAGE_SECTION_ID)
    ? service as WebUiExtensions
    : undefined
}

export function shellActions(ctx: Context) {
  const { slots } = ctx
  const hasStandaloneUsage = () => slots.entriesOfSlot('settings.section').some(({ options }) => options.id === USAGE_SECTION_ID)
  const hasFooterAction = (id: string) => slots.entriesOfSlot('sidebar.footer.action').some(({ options }) => options.id === id)
  return {
    get settingsAvailable() { return settingsStore(slots) !== undefined },
    get usageAvailable() {
      return hasFooterAction(ALL_USAGE_ACTION_ID)
        || (settingsStore(slots) !== undefined && (usageExtensions(ctx) !== undefined || hasStandaloneUsage()))
    },
    get remoteAvailable() {
      return slots.entriesOfSlot('sidebar.footer.action').some(({ options }) =>
        options.id === 'remote-web-ui'
        || options.id === 'remote-bridge'
        || options.id === REMOTE_WORKSPACE_ACTION_ID)
    },
    openSettings() {
      const actions = settingsStore(slots)?.create().actions as SettingsActions | undefined
      actions?.open?.()
    },
    openUsage() {
      if (usageExtensions(ctx)?.open(USAGE_SECTION_ID)) return
      if (hasStandaloneUsage()) {
        const actions = settingsStore(slots)?.create().actions as SettingsActions | undefined
        if (actions?.openSection) {
          actions.openSection(USAGE_SECTION_ID)
          return
        }
      }
      if (hasFooterAction(ALL_USAGE_ACTION_ID)) {
        // Targets dsh-all-usage's exact Qa() button; never click an arbitrary footer item.
        document.querySelector<HTMLButtonElement>(ALL_USAGE_TRIGGER)?.click()
      }
    },
    openRemote() {
      // These controls belong to the registered remote providers; never click an arbitrary footer item.
      const trigger = document.querySelector<HTMLButtonElement>(REMOTE_WEB_TRIGGER)
        ?? document.querySelector<HTMLButtonElement>(REMOTE_PAIR_TRIGGER)
        ?? (hasFooterAction(REMOTE_WORKSPACE_ACTION_ID)
          ? document.querySelector<HTMLButtonElement>(REMOTE_WORKSPACE_TRIGGER)
            ?? document.querySelector<HTMLButtonElement>(REMOTE_WORKSPACE_COMPACT_TRIGGER)
          : null)
      trigger?.click()
    },
  }
}
