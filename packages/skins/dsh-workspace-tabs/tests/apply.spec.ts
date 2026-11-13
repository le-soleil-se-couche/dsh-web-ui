// @vitest-environment jsdom
/**
 * Workspace Tabs skin apply spec — verifies retraction discipline, Chrome vs Mac
 * topbar modes, macOS draggable regions, workspace/session navigation,
 * in-place More panel dropdown, and the shared Appearance contract.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { readFileSync } from 'node:fs'
import { transform } from 'lightningcss'
import { apply, cleanSessionTitle } from '../src/client/index.ts'

let fiber: Fiber | undefined

const cssRelative = '../src/client/workspace-tabs.module.css'
const cssSource = readFileSync(new URL(cssRelative, import.meta.url), 'utf8')

const appearanceVariables = [
  '--dsh-appearance-ui-font',
  '--dsh-appearance-code-font',
  '--dsh-appearance-light-accent',
  '--dsh-appearance-light-canvas',
  '--dsh-appearance-light-surface',
  '--dsh-appearance-light-foreground',
  '--dsh-appearance-dark-accent',
  '--dsh-appearance-dark-canvas',
  '--dsh-appearance-dark-surface',
  '--dsh-appearance-dark-foreground',
] as const

async function mount(): Promise<Fiber> {
  const f = new Context().plugin({ apply })
  await f.await()
  return f
}

afterEach(async () => {
  await fiber?.dispose()
  fiber = undefined
  document.body.innerHTML = ''
  document.title = ''
  localStorage.clear()
  delete document.documentElement.dataset.platform
})

describe('Workspace Tabs skin apply', () => {
  it('sets the body attribute and retracts it on dispose', async () => {
    fiber = await mount()
    expect(document.body.hasAttribute('data-dsh-workspace-tabs')).toBe(true)
    expect(document.body.getAttribute('data-workspace-tabs-mode')).toBe('browser')
    await fiber.dispose()
    expect(document.body.hasAttribute('data-dsh-workspace-tabs')).toBe(false)
    expect(document.body.hasAttribute('data-workspace-tabs-mode')).toBe(false)
  })

  it('injects draggable chrome without legacy banner text and retracts every element on dispose', async () => {
    document.documentElement.dataset.platform = 'darwin'
    fiber = await mount()
    const chromeEls = document.body.querySelectorAll('[data-skin-chrome]')
    expect(chromeEls.length).toBeGreaterThan(0)
    const bar = document.body.querySelector('[data-skin-chrome="titlebar"]')
    expect(bar?.getAttribute('data-window-drag')).toBe('true')
    expect(bar?.textContent).not.toContain('暖光 · DeepSeek 在线')
    await fiber.dispose()
    expect(document.body.querySelectorAll('[data-skin-chrome]').length).toBe(0)
  })

  it.each(['win32', 'linux', undefined])('keeps navigation without native drag markers on %s', async (platform) => {
    if (platform) document.documentElement.dataset.platform = platform
    fiber = await mount()
    expect(document.querySelector('[data-skin-chrome="titlebar"]')).not.toBeNull()
    expect(document.querySelectorAll('[data-window-drag], [data-no-drag]')).toHaveLength(0)
    const toggle = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('经典顶栏'))!
    toggle.click()
    expect(document.body.getAttribute('data-workspace-tabs-mode')).toBe('classic')
    expect(document.querySelectorAll('[data-window-drag], [data-no-drag]')).toHaveLength(0)
  })

  it('pins a clean skin title without legacy tagline and restores the original on dispose', async () => {
    document.title = 'original'
    fiber = await mount()
    expect(document.title).not.toBe('original')
    expect(document.title).not.toContain('暖光 · DeepSeek 在线')
    await fiber.dispose()
    expect(document.title).toBe('original')
  })

  it('supports Chrome workspace/tab rendering, More panel dropdown, and 1-click Mac mode toggle', async () => {
    const openSession = vi.fn()
    const selectPanel = vi.fn()
    const toggleSidebar = vi.fn()
    const ctx = new Context() as Context & Record<string, unknown>

    const mockServices: Record<string, unknown> = {
      workspaces: {
        list: {
          getSnapshot: () => ({
            items: [
              { workspaceId: 'ws-dev', title: 'Dev', path: '/workspace/dev', sessionIds: ['s1', 's2'] },
              { workspaceId: 'ws-obs', title: 'Obsidian', path: '/workspace/notes', sessionIds: ['s3'] },
            ],
            archivedSessionIds: [],
          }),
          subscribe: () => () => {},
        },
      },
      sessions: {
        list: {
          getSnapshot: () => ({
            ids: ['s1', 's2', 's3'],
            byId: {
              s1: { id: 's1', title: '<|im_start|>system:<project_info>\n修复插件测试', updatedAt: '2026-11-13T10:00:00Z' },
              s2: { id: 's2', displayTitle: '外观优化', running: true, updatedAt: '2026-11-13T09:00:00Z' },
              s3: { id: 's3', displayTitle: '阅读笔记', updatedAt: '2026-11-13T08:00:00Z' },
            },
          }),
          subscribe: () => () => {},
        },
      },
      uiWorkspace: {
        mainReference: { sessionId: 's1' },
        selection: { getSnapshot: () => ({ sessionId: 's1' }), subscribe: () => () => {} },
        openSession,
        startSession: vi.fn(),
      },
      layout: {
        panelInfo: { getSnapshot: () => ({ activePanelId: null }), subscribe: () => () => {} },
        selectPanel,
        toggleSidebar,
      },
      slots: {
        entriesOfSlot: () => [
          { options: { id: 'plugins', order: 1, label: '插件' } },
          { options: { id: 'custom-board', order: 5, label: () => '自定义看板' } },
        ],
        subscribe: () => () => {},
      },
    }

    ;(ctx as unknown as { get: (name: string) => unknown }).get = (name: string) => mockServices[name]
    fiber = ctx.plugin({ apply })
    await fiber.await()

    const bar = document.body.querySelector('[data-skin-chrome="titlebar"]')!
    expect(bar.textContent).toContain('修复插件测试')
    expect(bar.textContent).toContain('Dev')
    expect(bar.textContent).toContain('Obsidian')
    expect(cleanSessionTitle('<|im_start|>user\n实际标题')).toBe('实际标题')

    // Click top-right ⊞ 更多 to render in-place panel dropdown (works even when sidebar collapsed)
    const buttons = Array.from(bar.querySelectorAll('button'))
    const moreBtn = buttons.find((b) => b.textContent?.includes('更多'))!
    moreBtn.click()
    const dd = document.body.querySelector('[data-skin-chrome="dropdown"]')!
    expect(dd.textContent).toContain('自定义看板')
    const boardItem = Array.from(dd.querySelectorAll('button')).find((b) => b.textContent?.includes('自定义看板'))!
    boardItem.click()
    expect(selectPanel).toHaveBeenCalledWith('custom-board')
    expect(document.body.querySelector('[data-skin-chrome="dropdown"]')).toBeNull()

    // Toggle sidebar from Row 1
    buttons.find((b) => b.textContent === '◧')!.click()
    expect(toggleSidebar).toHaveBeenCalledTimes(1)

    // Toggle Browser <-> Classic Mac mode
    buttons.find((b) => b.textContent?.includes('经典顶栏'))!.click()
    expect(document.body.getAttribute('data-workspace-tabs-mode')).toBe('classic')
    const classicButtons = Array.from(bar.querySelectorAll('button'))
    classicButtons.find((b) => b.textContent?.includes('浏览器顶栏'))!.click()
    expect(document.body.getAttribute('data-workspace-tabs-mode')).toBe('browser')
  })
})

describe('Workspace Tabs appearance contract', () => {
  it('compiles the configurable light and dark palette', () => {
    expect(() => transform({
      filename: 'workspace-tabs.module.css',
      code: Buffer.from(cssSource),
      cssModules: true,
    })).not.toThrow()
  })

  it('routes visible fonts and colors through shared Appearance primitives', () => {
    for (const binding of [
      '--dsw-font-family: var(--workspace-tabs-ui-font);',
      '--ds-font-family-code: var(--workspace-tabs-code-font);',
      '--dsw-alias-brand-primary: var(--workspace-tabs-accent);',
      '--dsw-alias-bg-base: var(--workspace-tabs-canvas);',
      '--dsw-alias-bg-layer-1: var(--workspace-tabs-surface);',
      '--dsw-alias-label-primary: var(--workspace-tabs-foreground);',
      '--dsw-alias-button-primary-fill: var(--workspace-tabs-accent);',
      '--workspace-tabs-titlebar-surface: var(--workspace-tabs-canvas);',
      '--workspace-tabs-titlebar-surface: var(--workspace-tabs-surface);',
      'background: var(--workspace-tabs-titlebar-surface);',
      'color: var(--workspace-tabs-foreground);',
    ]) {
      expect(cssSource).toContain(binding)
    }
  })

  it('references shared Appearance variables only inside the Workspace Tabs body scope', () => {
    const uncommented = cssSource.replace(/\/\*[\s\S]*?\*\//g, '')
    const blocks = [...uncommented.matchAll(/([^{}]+)\{([^{}]*)\}/g)]

    for (const variable of appearanceVariables) {
      const referencingSelectors = blocks
        .filter(([, , declarations]) => declarations.includes(variable))
        .map(([, selector]) => selector.trim())
      expect(referencingSelectors.length).toBeGreaterThan(0)
      expect(referencingSelectors.every(selector => selector.includes('body[data-dsh-workspace-tabs]'))).toBe(true)
    }
  })
})
