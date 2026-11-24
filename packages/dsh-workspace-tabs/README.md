# @linxin666/dsh-client-ui-workspace-tabs

English | [中文](README.zh.md)

Workspace Tabs adds workspace and conversation tabs, browser-style navigation, and a warm light/dark appearance to DeepSeek Harness. The top bar and appearance are provided by one plugin.

## What it does

- Switch between workspaces and main conversations from the top bar. Open subagents from their parent conversation.
- Drag conversations within the same workspace to reorder them. The tab and conversation-list context menus also offer Move earlier and Move later. The bar saves each workspace's order in this browser.
- Navigate recent conversations, create a conversation, toggle the sidebar, and open extension panels through More.
- Switch between a two-row browser layout and a compact classic layout.
- In the macOS desktop app, drag the dotted grip at the right end of the first row or the gap beside the red, yellow, and green window buttons to move the window.

## Install

Requires Node.js >=24.9 and DeepSeek Harness >=0.2.2-rc.2. This fork is based on upstream dsh-web v0.4.18. Use the `feat/workspace-tabs` branch for the build with the conversation ordering and macOS window controls.

```sh
git clone --branch feat/workspace-tabs https://github.com/le-soleil-se-couche/dsh-web-ui.git
cd dsh-web-ui
pnpm run deps:install
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs build
dsh plugin --profile <name> add "$PWD/packages/dsh-workspace-tabs"
```

Enable only one skin at a time in the selected profile. This package is published as source on GitHub; it is not an npm release.

## Config

Use the top-bar layout button to switch layouts. The layout and selected workspace are stored locally in the browser. Fonts and colors follow the host Appearance settings. No model-provider configuration is required.

## Known limitations

- Native window dragging requires the macOS desktop host. Windows, Linux, and ordinary browser sessions retain navigation without native drag regions.
- Workspace, conversation, and extension actions depend on the services exposed by the host version.
- The interface follows the host language; the package provides Chinese and English dictionaries, with Russian supplied by the family language plugin.
- At most 12 conversation tabs are shown for the selected workspace.

## Development

```sh
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs typecheck
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs test
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs build
```
