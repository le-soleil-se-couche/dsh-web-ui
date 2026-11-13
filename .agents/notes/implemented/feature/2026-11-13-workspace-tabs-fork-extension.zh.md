# Agent Note: Workspace Tabs fork extension

Status: implemented

## Problem

本 fork 需要通过一个可安装扩展提供工作区与会话导航、紧凑窗口顶栏和暖色外观。上游 v0.4.18 已移除旧画廊，并将皮肤资产迁至卫星仓库。

## Decision

扩展位于 `packages/dsh-workspace-tabs`，包名为 `@linxin666/dsh-client-ui-workspace-tabs`。它是可选的浏览器端 Cordis 插件，不包含宿主端行为，不发布 npm，也不默认加入聚合包。浏览器代码共同负责导航和限定作用域的样式，使用上游共享构建预设及当前 SDK 队列。

原生拖动属性与 CSS 仅对报告 `data-platform="darwin"` 的宿主生效。其他平台保留导航控件。安装、语言和宿主要求由包 README 维护。

## Alternatives considered

将包留在旧皮肤目录会为这一个扩展恢复已退役的注册表和画廊。功能插件边界保留了上游的移除结果。

将顶栏和样式拆成两个包，会为用户请求的同一界面引入额外安装与生命周期依赖。单插件边界保留了所需安装方式。

## Consequences

本 fork 跟随上游架构，同时保留这个可选扩展。用户通过本地路径显式安装；仓库同步不会改写运行中的 profile。实际原生窗口移动仍需桌面宿主验收，DOM 平台测试验证拖动标记边界。

导入的附件测试在 macOS 上先规范化临时根目录，再验证既有的禁止符号链接策略；生产路径校验保持不变。
