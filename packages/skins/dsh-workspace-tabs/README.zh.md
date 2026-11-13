# @linxin666/dsh-client-ui-workspace-tabs

[English](README.md) | 中文

工作区标签栏为 DeepSeek Harness 提供工作区与会话标签、浏览器式导航，以及暖色明暗外观。顶栏和外观由同一个插件提供。

## 能力

- 从顶栏切换工作区和会话。
- 导航最近访问的会话、新建会话、切换侧栏，并通过“更多”打开扩展面板。
- 在双行浏览器布局和紧凑经典布局之间切换。
- 仅在宿主报告 macOS（`data-platform="darwin"`）时启用原生窗口拖动区域；按钮保持可点击。

## 安装

克隆本仓库，安装已声明的依赖并构建插件：

```sh
git clone --branch feat/workspace-tabs https://github.com/le-soleil-se-couche/dsh-web-ui.git
cd dsh-web-ui
pnpm install
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs build
dsh plugin --profile <name> add "$PWD/packages/skins/dsh-workspace-tabs"
```

在所选 profile 中一次仅启用一个皮肤。本包以源码形式发布到 GitHub，尚未发布到 npm。

## 配置

使用顶栏布局按钮切换布局。布局和所选工作区保存在浏览器本地；字体与颜色跟随宿主的外观设置。无需配置模型提供方。

## 已知限制

- 原生窗口拖动需要 macOS 桌面宿主。Windows、Linux 和普通浏览器保留导航功能，不启用原生拖动区域。
- 工作区、会话和扩展操作依赖宿主版本提供的服务。
- 界面文案目前为中文；本文档提供中英两种语言。
- 所选工作区最多显示 12 个会话标签。

## 开发

```sh
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs typecheck
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs test
pnpm --filter @linxin666/dsh-client-ui-workspace-tabs build
```
