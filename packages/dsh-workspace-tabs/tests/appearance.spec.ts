import { transform } from 'lightningcss'
import { describe, expect, it } from 'vitest'

// This suite runs in Node; use the builtin API without importing Node types into the client program.
const { readFileSync } = (globalThis as typeof globalThis & {
  process: { getBuiltinModule(name: 'node:fs'): { readFileSync(path: URL, encoding: 'utf8'): string } }
}).process.getBuiltinModule('node:fs')
const cssSource = readFileSync(new URL('../src/client/workspace-tabs.module.css', import.meta.url), 'utf8')

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
    const blocks = [...cssSource.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]

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
})
