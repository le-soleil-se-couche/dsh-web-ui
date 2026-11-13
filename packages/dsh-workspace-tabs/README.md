# @linxin666/dsh-client-ui-workspace-tabs

English | [中文](README.zh.md)

Workspace Tabs adds workspace and conversation tabs, browser-style navigation, and a warm light/dark appearance to DeepSeek Harness. The top bar and appearance are provided by one plugin.

## What it does

- Switch between workspaces and conversations from the top bar.
- Navigate recent conversations, create a conversation, toggle the sidebar, and open extension panels through More.
- Switch between a two-row browser layout and a compact classic layout.
- Use native window drag regions only when the host reports macOS (`data-platform="darwin"`); buttons remain clickable.

## Install

Requires Node.js >=24.9 and DeepSeek Harness >=0.2.2-rc.2. This fork is based on upstream dsh-web v0.4.18. Clone this repository, install its declared dependencies, and build the package:

```sh
git clone --branch main https://github.com/le-soleil-se-couche/dsh-web-ui.git
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
