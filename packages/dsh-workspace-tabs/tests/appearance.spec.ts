import { transform } from 'lightningcss'
import { describe, expect, it } from 'vitest'

// This suite runs in Node; use the builtin API without importing Node types into the client program.
const { readFileSync } = (globalThis as typeof globalThis & {
  process: { getBuiltinModule(name: 'node:fs'): { readFileSync(path: URL, encoding: 'utf8'): string } }
}).process.getBuiltinModule('node:fs')
const cssSource = readFileSync(new URL('../src/client/workspace-tabs.module.css', import.meta.url), 'utf8')
const blocks = [...cssSource.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
const declarationsFor = (selector: string) => blocks.find(([, sel]) => sel?.trim() === selector)?.[2] ?? ''

describe('Workspace Tabs Appearance', () => {
  it('user can load the compiled stylesheet with both warm palettes and named tabs', () => {
    // Given the stylesheet is built through the same CSS Modules parser as the bundle.
    const code = new TextEncoder().encode(cssSource) as Parameters<typeof transform>[0]['code']

    // When Lightning CSS compiles it.
    const compiled = transform({ filename: 'workspace-tabs.module.css', code, cssModules: true })

    // Then the resulting CSS carries both theme scopes and the titlebar class.
    expect(compiled.exports?.titlebar?.name).toMatch(/titlebar/)
    const stylesheet = new TextDecoder().decode(compiled.code)
    expect(stylesheet).toContain('data-ds-dark-theme')
    expect(stylesheet).toContain('data-dsh-workspace-tabs')
  })

  it('user changes the shared Appearance controls and the scoped palette consumes them', () => {
    // Given the Appearance UI exposes font, canvas, surface, accent, and foreground variables.
    const expected = [
      'var(--dsh-appearance-ui-font', 'var(--dsh-appearance-code-font',
      'var(--dsh-appearance-light-accent', 'var(--dsh-appearance-dark-accent',
      'var(--dsh-appearance-light-canvas', 'var(--dsh-appearance-dark-canvas',
      'var(--dsh-appearance-light-surface', 'var(--dsh-appearance-dark-surface',
      'var(--dsh-appearance-light-foreground', 'var(--dsh-appearance-dark-foreground',
    ]

    // When CSS selector scope and the output tokens are inspected together.

    // Then the controls feed only the plugin scope and are published to the visible DSH tokens.
    for (const variable of expected) {
      expect(blocks.filter(([, , declarations]) => declarations?.includes(variable)).map(([, selector]) => selector?.trim()))
        .toEqual([variable.includes('-dark-') ? 'body[data-dsh-workspace-tabs][data-ds-dark-theme]' : 'body[data-dsh-workspace-tabs]'])
    }
    expect(cssSource).toContain('--dsw-font-family: var(--workspace-tabs-ui-font)')
    expect(cssSource).toContain('--ds-font-family-code: var(--workspace-tabs-code-font)')
    expect(cssSource).toContain('--dsw-alias-bg-base: var(--workspace-tabs-canvas)')
    expect(cssSource).toContain('--dsw-alias-bg-layer-1: var(--workspace-tabs-surface)')
    expect(cssSource).toContain('--dsw-alias-label-primary: var(--workspace-tabs-foreground)')
    expect(cssSource).toContain('--dsw-alias-button-primary-fill: var(--workspace-tabs-accent)')
  })

  it('user sees larger browser rows and a reserved drag area on macOS', () => {
    // Given the stylesheet that sizes the chrome and offsets the host below it.
    const scope = 'body[data-dsh-workspace-tabs]'
    const windowedMac = ':global(html[data-platform="darwin"]:not([data-fullscreen]))'

    // When the browser bar is enabled, each row contributes its full height to the host offset.
    expect(declarationsFor(scope)).toContain('--workspace-tabs-tab-row: 50px;')
    expect(declarationsFor(scope)).toContain('--workspace-tabs-workspace-row: 42px;')
    expect(declarationsFor(scope)).toContain('--workspace-tabs-height: calc(var(--workspace-tabs-tab-row) + var(--workspace-tabs-workspace-row));')
    expect(declarationsFor(`${scope}[data-workspace-tabs-mode="classic"]`)).toContain('--workspace-tabs-height: var(--workspace-tabs-tab-row);')
    expect(declarationsFor(`${scope} .row1`)).toContain('height: var(--workspace-tabs-tab-row);')
    expect(declarationsFor(`${scope} .row2`)).toContain('height: var(--workspace-tabs-workspace-row);')

    // Then session and workspace labels are legible, and windowed macOS reserves full-height space.
    expect(declarationsFor(`${scope} .titlebar`)).toContain('font-family: var(--workspace-tabs-chrome-font);')
    expect(declarationsFor(`${scope} .tab`)).toContain('font-size: 16px;')
    expect(declarationsFor(`${scope} .wsChip`)).toContain('font-size: 15px;')
    expect(declarationsFor(scope)).toContain('--workspace-tabs-drag-min: 0px;')
    expect(declarationsFor(`${windowedMac} ${scope}`)).toContain('--workspace-tabs-drag-min: clamp(44px, 8vw, 128px);')
    expect(declarationsFor(`${windowedMac} ${scope} .row1`)).toContain('padding-left: 104px;')
    expect(declarationsFor(`${scope} .dragSpacer`)).toContain('flex: 1 0 var(--workspace-tabs-drag-min);')
    expect(declarationsFor(`${scope} .dragSpacer`)).toContain('align-self: stretch;')
    expect(declarationsFor(`${scope} .row1 .dragSpacer::after`)).toContain('justify-self: end;')
    expect(declarationsFor(`${scope} .windowGrip`)).toContain('display: none;')
    expect(declarationsFor(`${windowedMac} ${scope} .windowGrip`)).toContain('display: grid;')
    expect(declarationsFor(`${windowedMac} ${scope}:not([data-window-drag-recall]) .windowGrip`))
      .toContain('-webkit-app-region: drag !important;')
    expect(declarationsFor(`${scope} .captionGrip`)).toContain('width: 28px;')
  })

  it('user keeps warm surfaces, semantic colors, and document typography', () => {
    // Given the raw stylesheet source and its declarations.

    // When Lightning CSS compiles the stylesheet into CSS Modules output.
    const compiled = transform({
      filename: 'workspace-tabs.module.css',
      code: new TextEncoder().encode(cssSource) as Parameters<typeof transform>[0]['code'],
      cssModules: true,
    })
    const stylesheet = new TextDecoder().decode(compiled.code)

    // Then the document and code retain their typography fallbacks.
    expect(declarationsFor('body[data-dsh-workspace-tabs]')).toContain(
      '--workspace-tabs-ui-font: var(--dsh-appearance-ui-font, "思源宋体 VF", "Source Han Serif SC VF", "思源宋体", "Songti SC", serif);',
    )
    expect(declarationsFor('body[data-dsh-workspace-tabs]')).toContain(
      '--workspace-tabs-code-font: var(--dsh-appearance-code-font, "SF Mono", "SFMono-Regular", Menlo, Consolas, monospace);',
    )

    // And semantic state tokens, code blocks, selection, and dark scrollbars compile cleanly.
    expect(declarationsFor('body[data-dsh-workspace-tabs]')).toContain('--dsw-alias-state-success-primary: #00c853;')
    expect(declarationsFor('body[data-dsh-workspace-tabs]')).toContain('--dsw-alias-state-error-primary: #ff5f38;')
    expect(declarationsFor('body[data-dsh-workspace-tabs]')).toContain('--dsw-alias-state-warn-primary: var(--workspace-tabs-warning);')
    expect(declarationsFor('body[data-dsh-workspace-tabs][data-ds-dark-theme]')).toContain('--dsw-alias-state-success-primary: #3ddc72;')
    expect(declarationsFor('body[data-dsh-workspace-tabs][data-ds-dark-theme]')).toContain('--dsw-alias-state-error-primary: #ff7a55;')
    expect(declarationsFor('body[data-dsh-workspace-tabs][data-ds-dark-theme]')).toContain('--workspace-tabs-scrollbar-thumb:')
    expect(stylesheet).toContain('--workspace-tabs-code-surface')
    expect(stylesheet).toContain('--workspace-tabs-selection')
    expect(stylesheet).toContain('::-webkit-scrollbar')
    expect(stylesheet).toContain('::selection')
  })
})
