window.__ModuleLoader__.load({
	id: "@linxin666/dsh-client-ui-workspace-tabs",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_slots = require("@deepseek-ai/dsh-client-ui-slots");
		//#region src/client/locales.ts
		/** Locale namespace and Chinese source dictionary for Workspace Tabs. */
		const NS = "workspace-tabs";
		const zh = {
			"workspace.default": "工作区",
			"workspace.ungrouped": "未分组",
			"workspace.switch": "切换工作区：{workspace}",
			"workspace.sessions": "展开「{workspace}」的对话",
			"session.new": "新建对话",
			"session.newInWorkspace": "在「{workspace}」新建对话",
			"session.none": "未选择对话",
			"session.back": "返回上一个对话",
			"session.forward": "前进到下一个对话",
			"session.all": "查看「{workspace}」的全部对话（{count}）",
			"session.filter": "筛选工作区和对话…",
			"session.noMatches": "没有匹配的对话",
			"session.justNow": "刚刚",
			"chrome.sidebar": "展开或收起侧栏",
			"chrome.switchSession": "切换工作区和对话",
			"chrome.classic": "经典顶栏",
			"chrome.classicHint": "切换到紧凑的经典顶栏",
			"chrome.browser": "浏览器顶栏",
			"chrome.browserHint": "切换到双行工作区和对话标签栏",
			"chrome.search": "搜索",
			"chrome.searchHint": "搜索全部工作区和对话",
			"panel.plugins": "插件",
			"panel.pluginsHint": "打开或关闭插件面板",
			"panel.schedules": "自动化",
			"panel.schedulesHint": "打开或关闭自动化任务",
			"panel.more": "更多",
			"panel.moreHint": "显示全局面板",
			"panel.all": "全局面板（{count}）",
			"panel.usage": "用量",
			"panel.usageHint": "打开用量统计",
			"panel.remote": "远程",
			"panel.remoteHint": "打开远程连接",
			"panel.settings": "设置",
			"panel.settingsHint": "打开账号和系统设置"
		};
		/** Complete English mirror of the Chinese keys. */
		const en = {
			"workspace.default": "Workspace",
			"workspace.ungrouped": "Ungrouped",
			"workspace.switch": "Switch workspace: {workspace}",
			"workspace.sessions": "Show conversations in {workspace}",
			"session.new": "New conversation",
			"session.newInWorkspace": "New conversation in {workspace}",
			"session.none": "No conversation selected",
			"session.back": "Back to previous conversation",
			"session.forward": "Forward to next conversation",
			"session.all": "Show all conversations in {workspace} ({count})",
			"session.filter": "Filter workspaces and conversations…",
			"session.noMatches": "No matching conversations",
			"session.justNow": "Just now",
			"chrome.sidebar": "Toggle sidebar",
			"chrome.switchSession": "Switch workspace and conversation",
			"chrome.classic": "Classic bar",
			"chrome.classicHint": "Switch to the compact classic bar",
			"chrome.browser": "Browser bar",
			"chrome.browserHint": "Switch to the two-row workspace and conversation tabs",
			"chrome.search": "Search",
			"chrome.searchHint": "Search all workspaces and conversations",
			"panel.plugins": "Plugins",
			"panel.pluginsHint": "Toggle the plugins panel",
			"panel.schedules": "Schedules",
			"panel.schedulesHint": "Toggle scheduled tasks",
			"panel.more": "More",
			"panel.moreHint": "Show global panels",
			"panel.all": "Global panels ({count})",
			"panel.usage": "Usage",
			"panel.usageHint": "Open usage statistics",
			"panel.remote": "Remote",
			"panel.remoteHint": "Open remote access",
			"panel.settings": "Settings",
			"panel.settingsHint": "Open account and system settings"
		};
		//#endregion
		//#region src/client/shell.ts
		const USAGE_SECTION_ID = "dsh-usage";
		const REMOTE_WEB_TRIGGER = "button[data-testid=\"remote-trigger\"]";
		const REMOTE_PAIR_TRIGGER = "button[data-dsh-plugin=\"remote-bridge\"][data-dsh-part=\"entry\"]";
		const panelSlots = ["sidebar.panellist", "main"];
		const actionSlots = [
			"sidebar.settings",
			"settings.section",
			"sidebar.footer.action"
		];
		/** Pair sidebar metadata with real main-slot entries; orphan rows cannot navigate. */
		function panelEntries(slots) {
			const panels = new Set(slots.entriesOfSlot("main").map(({ options }) => options.key));
			return slots.entriesOfSlot("sidebar.panellist").flatMap(({ options: { id, label, order } }) => {
				if (!id || !panels.has(id)) return [];
				let text;
				try {
					text = (0, _deepseek_ai_dsh_client_ui_slots.resolveSlotLabel)(label);
				} catch {}
				return [{
					id,
					label: text || id,
					order: order ?? 0
				}];
			}).sort((a, b) => a.order - b.order);
		}
		/** The official sidebar Settings occupant shares one root store with its keyboard command. */
		function settingsStore(slots) {
			const store = slots.entriesOfSlot("sidebar.settings")[0]?.store;
			return store && "create" in store && typeof store.create === "function" ? store : void 0;
		}
		function usageExtensions(ctx) {
			const service = ctx.get("webUiExtensions");
			return typeof service?.getPages === "function" && typeof service.open === "function" && service.getPages().some(({ key }) => key === USAGE_SECTION_ID) ? service : void 0;
		}
		function shellActions(ctx) {
			const { slots } = ctx;
			const hasStandaloneUsage = () => slots.entriesOfSlot("settings.section").some(({ options }) => options.id === USAGE_SECTION_ID);
			return {
				get settingsAvailable() {
					return settingsStore(slots) !== void 0;
				},
				get usageAvailable() {
					return settingsStore(slots) !== void 0 && (usageExtensions(ctx) !== void 0 || hasStandaloneUsage());
				},
				get remoteAvailable() {
					return slots.entriesOfSlot("sidebar.footer.action").some(({ options }) => options.id === "remote-web-ui" || options.id === "remote-bridge");
				},
				openSettings() {
					(settingsStore(slots)?.create().actions)?.open?.();
				},
				openUsage() {
					if (usageExtensions(ctx)?.open(USAGE_SECTION_ID)) return;
					if (!hasStandaloneUsage()) return;
					(settingsStore(slots)?.create().actions)?.openSection?.(USAGE_SECTION_ID);
				},
				openRemote() {
					(document.querySelector(REMOTE_WEB_TRIGGER) ?? document.querySelector(REMOTE_PAIR_TRIGGER))?.click();
				}
			};
		}
		//#endregion
		//#region src/client/workspaces.ts
		const UNGROUPED_ID = "__ungrouped__";
		/** Strip a ChatML prompt prefix without exposing it in the tab label. */
		function cleanSessionTitle(raw, fallback) {
			const title = raw?.trim() ?? "";
			if (!title.startsWith("<|im_start|>")) return title || fallback;
			return title.replace(/^<\|im_start\|>[^\n]*\n?/, "").replace(/<[^>]+>/g, " ").trim() || fallback;
		}
		/** Main-area ownership is published through the list; the UI service keeps its reference private. */
		function mainSession(sessions) {
			return Object.values(sessions.byId).find((row) => (row?.retainedBy.mainView ?? 0) > 0);
		}
		/** Combine the host workspace registry and session list without exposing archived or unused blank rows. */
		function buildWorkspaceGroups(workspaces, sessions, active, t) {
			const archived = new Set(workspaces.archivedSessionIds);
			const claimed = /* @__PURE__ */ new Set();
			const visible = (id) => {
				const session = sessions.byId[id];
				return session && !archived.has(id) && (!session.blank || id === active?.id) ? [session] : [];
			};
			const sortRecent = (a, b) => b.updatedAt - a.updatedAt;
			const groups = workspaces.items.map(({ workspaceId, title, path, sessionIds }) => {
				for (const id of sessionIds) claimed.add(id);
				const members = sessionIds.flatMap(visible).sort(sortRecent);
				return {
					id: workspaceId,
					workspaceId,
					title: title || path.split(/[/\\]/).findLast(Boolean) || t("workspace.default"),
					path,
					sessions: members,
					running: members.some((session) => session.running)
				};
			});
			const allIds = new Set(sessions.ids);
			if (active) allIds.add(active.id);
			const members = [...allIds].filter((id) => !claimed.has(id)).flatMap(visible).sort(sortRecent);
			if (members.length > 0 || groups.length === 0) groups.push({
				id: UNGROUPED_ID,
				title: t("workspace.ungrouped"),
				path: "",
				sessions: members,
				running: members.some((session) => session.running)
			});
			return groups;
		}
		/** Format the numeric SDK timestamp using the active locale, including plural rules. */
		function relativeTime(timestamp, now, t, format) {
			if (!Number.isFinite(timestamp)) return "";
			const minutes = Math.floor(Math.max(0, now - timestamp) / 6e4);
			if (minutes === 0) return t("session.justNow");
			if (minutes < 60) return format.format(-minutes, "minute");
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return format.format(-hours, "hour");
			const days = Math.floor(hours / 24);
			return days < 30 ? format.format(-days, "day") : format.format(-Math.floor(days / 30), "month");
		}
		//#endregion
		//#region \0dsh-css:packages/dsh-workspace-tabs/src/client/workspace-tabs.module.css.mjs
		const css = "body[data-dsh-workspace-tabs]{--workspace-tabs-ui-font:var(--dsh-appearance-ui-font,\"Source Han Serif SC VF\", \"Source Han Serif SC\", serif);--workspace-tabs-code-font:var(--dsh-appearance-code-font,\"SF Mono\", Consolas, \"Courier New\", monospace);--workspace-tabs-accent:var(--dsh-appearance-light-accent,#da7756);--workspace-tabs-canvas:var(--dsh-appearance-light-canvas,#f5f3ee);--workspace-tabs-surface:var(--dsh-appearance-light-surface,#f1eee8);--workspace-tabs-foreground:var(--dsh-appearance-light-foreground,#1d1b16);--workspace-tabs-brand-invert:var(--workspace-tabs-canvas);--workspace-tabs-brand-text:color-mix(in srgb, var(--workspace-tabs-accent) 72%, var(--workspace-tabs-foreground) 28%);--workspace-tabs-layer-2:color-mix(in srgb, var(--workspace-tabs-surface) 94%, var(--workspace-tabs-foreground) 6%);--workspace-tabs-layer-3:color-mix(in srgb, var(--workspace-tabs-surface) 90%, var(--workspace-tabs-foreground) 10%);--workspace-tabs-label-primary-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 82%, var(--workspace-tabs-canvas) 18%);--workspace-tabs-label-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 68%, var(--workspace-tabs-canvas) 32%);--workspace-tabs-label-caption:color-mix(in srgb, var(--workspace-tabs-foreground) 48%, var(--workspace-tabs-canvas) 52%);--workspace-tabs-border-l1:color-mix(in srgb, var(--workspace-tabs-surface) 82%, var(--workspace-tabs-foreground) 18%);--workspace-tabs-border-l2:color-mix(in srgb, var(--workspace-tabs-surface) 76%, var(--workspace-tabs-foreground) 24%);--workspace-tabs-border-l3:color-mix(in srgb, var(--workspace-tabs-surface) 68%, var(--workspace-tabs-foreground) 32%);--workspace-tabs-border-l4:color-mix(in srgb, var(--workspace-tabs-surface) 60%, var(--workspace-tabs-foreground) 40%);--workspace-tabs-hover:color-mix(in srgb, var(--workspace-tabs-surface) 92%, var(--workspace-tabs-foreground) 8%);--workspace-tabs-active:color-mix(in srgb, var(--workspace-tabs-surface) 86%, var(--workspace-tabs-foreground) 14%);--workspace-tabs-accent-hover:color-mix(in srgb, var(--workspace-tabs-accent) 88%, var(--workspace-tabs-foreground) 12%);--workspace-tabs-accent-soft:color-mix(in srgb, var(--workspace-tabs-accent) 14%, transparent 86%);--workspace-tabs-accent-solid:color-mix(in srgb, var(--workspace-tabs-accent) 22%, transparent 78%);--workspace-tabs-raised:color-mix(in srgb, var(--workspace-tabs-canvas) 78%, var(--workspace-tabs-surface) 22%);--workspace-tabs-titlebar-surface:var(--workspace-tabs-canvas);--dsw-font-family:var(--workspace-tabs-ui-font);--ds-font-family-code:var(--workspace-tabs-code-font);--dsw-alias-brand-primary:var(--workspace-tabs-accent);--dsw-alias-brand-primary-invert:var(--workspace-tabs-brand-invert);--dsw-alias-brand-primary-new-colorprimary-new-color:var(--workspace-tabs-accent);--dsw-alias-brand-text:var(--workspace-tabs-brand-text);--dsw-alias-bg-base:var(--workspace-tabs-canvas);--dsw-alias-bg-layer-1:var(--workspace-tabs-surface);--dsw-alias-bg-layer-2:var(--workspace-tabs-layer-2);--dsw-alias-bg-layer-3:var(--workspace-tabs-layer-3);--dsw-alias-label-primary:var(--workspace-tabs-foreground);--dsw-alias-label-primary-foreground:var(--workspace-tabs-foreground);--dsw-alias-label-primary-bluish:var(--workspace-tabs-foreground);--dsw-alias-label-primary-dimmed:var(--workspace-tabs-label-primary-dimmed);--dsw-alias-label-primary-inverted:var(--workspace-tabs-canvas);--dsw-alias-label-dimmed:var(--workspace-tabs-label-dimmed);--dsw-alias-label-caption:var(--workspace-tabs-label-caption);--dsw-alias-border-l1:var(--workspace-tabs-border-l1);--dsw-alias-border-l2:var(--workspace-tabs-border-l2);--dsw-alias-border-l3:var(--workspace-tabs-border-l3);--dsw-alias-border-l4:var(--workspace-tabs-border-l4);--dsw-alias-border-inverted:var(--workspace-tabs-foreground);--dsw-alias-border-inverted2:var(--workspace-tabs-foreground);--dsw-alias-interactive-bg-hover:var(--workspace-tabs-hover);--dsw-alias-interactive-bg-active:var(--workspace-tabs-active);--dsw-alias-interactive-bg-hover-accent:var(--workspace-tabs-accent-soft);--dsw-alias-interactive-bg-hover-solid:var(--workspace-tabs-accent-solid);--dsw-alias-button-primary-fill:var(--workspace-tabs-accent);--dsw-alias-button-primary-hover:var(--workspace-tabs-accent-hover);--dsw-alias-button-primary-dimmed:var(--workspace-tabs-accent-solid);--dsw-alias-button-elevated-fill:var(--workspace-tabs-raised);--dsw-alias-button-floating-fill:var(--workspace-tabs-raised);--dsw-alias-button-tool-bar-fill:var(--workspace-tabs-canvas);--dsw-alias-button-contrast-fill:var(--workspace-tabs-foreground);--workspace-tabs-height:68px;--workspace-tabs-caption:0px;--dsh-frame-chrome-top:calc(var(--workspace-tabs-height) + var(--workspace-tabs-caption));--dsh-frame-overlay-top:var(--dsh-frame-chrome-top);color:var(--workspace-tabs-foreground);background-color:var(--workspace-tabs-canvas);padding-top:var(--workspace-tabs-height);box-sizing:border-box}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic]{--workspace-tabs-height:40px}html[data-windows-titlebar]:not([data-fullscreen]) body[data-dsh-workspace-tabs]{--workspace-tabs-caption:var(--dsh-windows-titlebar-height,0px)}body[data-dsh-workspace-tabs][data-ds-dark-theme]{--workspace-tabs-accent:var(--dsh-appearance-dark-accent,#da7756);--workspace-tabs-canvas:var(--dsh-appearance-dark-canvas,#1d1b16);--workspace-tabs-surface:var(--dsh-appearance-dark-surface,#262119);--workspace-tabs-foreground:var(--dsh-appearance-dark-foreground,#f5f3ee);--workspace-tabs-brand-invert:var(--workspace-tabs-canvas);--workspace-tabs-brand-text:color-mix(in srgb, var(--workspace-tabs-accent) 78%, var(--workspace-tabs-foreground) 22%);--workspace-tabs-layer-2:color-mix(in srgb, var(--workspace-tabs-surface) 94%, var(--workspace-tabs-foreground) 6%);--workspace-tabs-layer-3:color-mix(in srgb, var(--workspace-tabs-surface) 90%, var(--workspace-tabs-foreground) 10%);--workspace-tabs-label-primary-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 84%, var(--workspace-tabs-canvas) 16%);--workspace-tabs-label-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 70%, var(--workspace-tabs-canvas) 30%);--workspace-tabs-label-caption:color-mix(in srgb, var(--workspace-tabs-foreground) 48%, var(--workspace-tabs-canvas) 52%);--workspace-tabs-border-l1:color-mix(in srgb, var(--workspace-tabs-surface) 82%, var(--workspace-tabs-foreground) 18%);--workspace-tabs-border-l2:color-mix(in srgb, var(--workspace-tabs-surface) 76%, var(--workspace-tabs-foreground) 24%);--workspace-tabs-border-l3:color-mix(in srgb, var(--workspace-tabs-surface) 68%, var(--workspace-tabs-foreground) 32%);--workspace-tabs-border-l4:color-mix(in srgb, var(--workspace-tabs-surface) 60%, var(--workspace-tabs-foreground) 40%);--workspace-tabs-hover:color-mix(in srgb, var(--workspace-tabs-surface) 90%, var(--workspace-tabs-foreground) 10%);--workspace-tabs-active:color-mix(in srgb, var(--workspace-tabs-surface) 84%, var(--workspace-tabs-foreground) 16%);--workspace-tabs-accent-hover:color-mix(in srgb, var(--workspace-tabs-accent) 88%, var(--workspace-tabs-foreground) 12%);--workspace-tabs-accent-soft:color-mix(in srgb, var(--workspace-tabs-accent) 18%, transparent 82%);--workspace-tabs-accent-solid:color-mix(in srgb, var(--workspace-tabs-accent) 28%, transparent 72%);--workspace-tabs-raised:color-mix(in srgb, var(--workspace-tabs-canvas) 62%, var(--workspace-tabs-surface) 38%);--workspace-tabs-titlebar-surface:var(--workspace-tabs-surface)}html[data-platform=darwin] body[data-dsh-workspace-tabs] [data-slot=sidebar]>div>[data-window-drag]:has(>[data-sidebar-toggle]){display:none!important}html[data-platform=darwin] body[data-dsh-workspace-tabs] [data-slot=sidebar]>div>[data-window-drag]:has(>[data-sidebar-toggle])+[data-window-drag]{height:44px!important;margin-top:0!important}body[data-dsh-workspace-tabs] [data-shell-leading]{display:none!important}html[data-platform=darwin] body[data-dsh-workspace-tabs]:not([data-window-drag-recall]) .hDV6xa_titlebar[data-window-drag],html[data-platform=darwin] body[data-dsh-workspace-tabs]:not([data-window-drag-recall]) .hDV6xa_titlebar [data-window-drag]{-webkit-app-region:drag!important}html[data-platform=darwin] body[data-dsh-workspace-tabs] .hDV6xa_titlebar [data-no-drag],html[data-platform=darwin] body[data-dsh-workspace-tabs] .hDV6xa_titlebar button,html[data-platform=darwin] body[data-dsh-workspace-tabs] .hDV6xa_titlebar input,html[data-platform=darwin] body[data-dsh-workspace-tabs] .hDV6xa_dropdown{-webkit-app-region:no-drag!important}body[data-dsh-workspace-tabs] .hDV6xa_titlebar{top:var(--workspace-tabs-caption);z-index:400;height:var(--workspace-tabs-height);background:var(--workspace-tabs-titlebar-surface);border-bottom:1px solid var(--workspace-tabs-border-l1);color:var(--workspace-tabs-foreground);font-family:var(--workspace-tabs-ui-font);user-select:none;box-sizing:border-box;flex-direction:column;font-size:12px;display:flex;position:fixed;left:0;right:0}body[data-dsh-workspace-tabs] .hDV6xa_row1{box-sizing:border-box;align-items:center;gap:6px;height:40px;min-height:40px;padding:0 10px;display:flex;position:relative}html[data-platform=darwin]:not([data-fullscreen]) body[data-dsh-workspace-tabs] .hDV6xa_row1{padding-left:84px}body[data-dsh-workspace-tabs] .hDV6xa_row2{box-sizing:border-box;background:color-mix(in srgb, var(--workspace-tabs-canvas) 65%, var(--workspace-tabs-surface) 35%);border-top:1px solid color-mix(in srgb, var(--workspace-tabs-border-l1) 60%, transparent 40%);align-items:center;gap:4px;height:28px;min-height:28px;padding:0 10px;font-size:12px;display:flex}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] .hDV6xa_row2{display:none}body[data-dsh-workspace-tabs] .hDV6xa_navGroup{flex:none;align-items:center;gap:3px;display:inline-flex}body[data-dsh-workspace-tabs] .hDV6xa_iconBtn{min-width:26px;height:26px;color:var(--workspace-tabs-label-primary-dimmed);cursor:pointer;white-space:nowrap;background:0 0;border:1px solid #0000;border-radius:6px;justify-content:center;align-items:center;gap:4px;padding:0 7px;font-family:inherit;font-size:12px;transition:background .12s,color .12s,border-color .12s;display:inline-flex}body[data-dsh-workspace-tabs] .hDV6xa_iconBtn:hover{background:var(--workspace-tabs-hover);color:var(--workspace-tabs-foreground)}body[data-dsh-workspace-tabs] .hDV6xa_iconBtn[data-active=true]{background:var(--workspace-tabs-accent-soft);color:var(--workspace-tabs-brand-text);border-color:color-mix(in srgb, var(--workspace-tabs-accent) 35%, transparent 65%);font-weight:600}body[data-dsh-workspace-tabs] .hDV6xa_iconBtn:disabled{opacity:.38;cursor:default;pointer-events:none}body[data-dsh-workspace-tabs] .hDV6xa_tabStripWrap{flex:auto;align-items:center;gap:4px;min-width:0;height:100%;display:flex;overflow:hidden}body[data-dsh-workspace-tabs] .hDV6xa_tabStrip{scrollbar-width:none;box-sizing:border-box;align-items:flex-end;gap:3px;max-width:100%;height:100%;padding-top:6px;display:flex;overflow-x:auto}body[data-dsh-workspace-tabs] .hDV6xa_tabStrip::-webkit-scrollbar{display:none}body[data-dsh-workspace-tabs] .hDV6xa_tab{background:color-mix(in srgb, var(--workspace-tabs-surface) 75%, transparent 25%);min-width:84px;max-width:200px;height:32px;color:var(--workspace-tabs-label-dimmed);cursor:pointer;box-sizing:border-box;border:1px solid #0000;border-bottom:none;border-radius:8px 8px 0 0;flex:0 auto;align-items:center;gap:6px;padding:0 10px;font-family:inherit;font-size:12px;transition:background .12s,color .12s;display:inline-flex;position:relative}body[data-dsh-workspace-tabs] .hDV6xa_tab:hover{background:var(--workspace-tabs-hover);color:var(--workspace-tabs-foreground)}body[data-dsh-workspace-tabs] .hDV6xa_tab[data-active=true]{background:var(--workspace-tabs-canvas);color:var(--workspace-tabs-foreground);border-color:var(--workspace-tabs-border-l1);box-shadow:0 -2px 0 0 var(--workspace-tabs-accent) inset;font-weight:600}body[data-dsh-workspace-tabs] .hDV6xa_tabTitle{text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:auto;overflow:hidden}body[data-dsh-workspace-tabs] .hDV6xa_dot{background:var(--workspace-tabs-label-caption);border-radius:50%;flex:none;width:6px;height:6px}body[data-dsh-workspace-tabs] .hDV6xa_dot[data-running=true]{background:#2eab5c;box-shadow:0 0 0 2px #2eab5c40}body[data-dsh-workspace-tabs] .hDV6xa_dot[data-active=true]:not([data-running=true]){background:var(--workspace-tabs-accent)}body[data-dsh-workspace-tabs] .hDV6xa_dragSpacer{flex:24px;min-width:24px;height:100%}body[data-dsh-workspace-tabs] .hDV6xa_classicCenter{flex:auto;justify-content:center;align-items:center;gap:6px;min-width:0;height:100%;display:none}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] .hDV6xa_classicCenter{display:flex}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] .hDV6xa_tabStripWrap{display:none}body[data-dsh-workspace-tabs] .hDV6xa_classicPill{background:color-mix(in srgb, var(--workspace-tabs-surface) 82%, var(--workspace-tabs-foreground) 4%);border:1px solid var(--workspace-tabs-border-l1);max-width:460px;color:var(--workspace-tabs-foreground);cursor:pointer;text-overflow:ellipsis;white-space:nowrap;border-radius:7px;align-items:center;gap:6px;padding:4px 12px;font-family:inherit;font-size:12px;display:inline-flex;overflow:hidden}body[data-dsh-workspace-tabs] .hDV6xa_classicPill:hover{background:var(--workspace-tabs-hover)}body[data-dsh-workspace-tabs] .hDV6xa_classicWs{color:var(--workspace-tabs-brand-text);flex:none;font-weight:600}body[data-dsh-workspace-tabs] .hDV6xa_classicSep{color:var(--workspace-tabs-label-caption);flex:none}body[data-dsh-workspace-tabs] .hDV6xa_classicSes{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}body[data-dsh-workspace-tabs] .hDV6xa_extBar{border-left:1px solid var(--workspace-tabs-border-l1);flex:none;align-items:center;gap:3px;padding-left:6px;display:inline-flex}body[data-dsh-workspace-tabs] .hDV6xa_divider{background:var(--workspace-tabs-border-l1);flex:none;width:1px;height:14px;margin:0 2px}body[data-dsh-workspace-tabs] .hDV6xa_modeBtn{border:1px solid var(--workspace-tabs-border-l1);background:var(--workspace-tabs-raised);font-weight:500}body[data-dsh-workspace-tabs] .hDV6xa_compactLabel{display:none}@media (width<=760px){body[data-dsh-workspace-tabs] .hDV6xa_extBar{scrollbar-width:none;flex:0 auto;min-width:0;overflow-x:auto}body[data-dsh-workspace-tabs] .hDV6xa_fullLabel{display:none}body[data-dsh-workspace-tabs] .hDV6xa_compactLabel{display:inline}body[data-dsh-workspace-tabs] .hDV6xa_iconBtn{padding-inline:4px}body[data-dsh-workspace-tabs] .hDV6xa_dragSpacer{min-width:0}}body[data-dsh-workspace-tabs] .hDV6xa_wsBar{scrollbar-width:none;flex:0 auto;align-items:center;gap:4px;min-width:0;height:100%;display:flex;overflow-x:auto}body[data-dsh-workspace-tabs] .hDV6xa_wsBar::-webkit-scrollbar{display:none}body[data-dsh-workspace-tabs] .hDV6xa_wsChip{height:22px;color:var(--workspace-tabs-label-primary-dimmed);background:0 0;border:1px solid #0000;border-radius:5px;flex:none;align-items:center;font-size:12px;transition:background .12s,border-color .12s,color .12s;display:inline-flex;overflow:hidden}body[data-dsh-workspace-tabs] .hDV6xa_wsChip:hover{background:var(--workspace-tabs-hover);color:var(--workspace-tabs-foreground)}body[data-dsh-workspace-tabs] .hDV6xa_wsChip[data-active=true]{background:var(--workspace-tabs-accent-soft);color:var(--workspace-tabs-brand-text);border-color:color-mix(in srgb, var(--workspace-tabs-accent) 32%, transparent 68%);font-weight:600}body[data-dsh-workspace-tabs] .hDV6xa_wsMain{height:100%;color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;align-items:center;gap:4px;padding:0 6px 0 7px;display:inline-flex}body[data-dsh-workspace-tabs] .hDV6xa_wsCaret{border:none;border-left:1px solid color-mix(in srgb, var(--workspace-tabs-border-l1) 50%, transparent 50%);width:16px;height:100%;color:inherit;cursor:pointer;opacity:.75;background:0 0;justify-content:center;align-items:center;font-size:10px;display:inline-flex}body[data-dsh-workspace-tabs] .hDV6xa_wsCaret:hover{opacity:1;background:color-mix(in srgb, var(--workspace-tabs-foreground) 8%, transparent 92%)}body[data-dsh-workspace-tabs] .hDV6xa_wsCount{opacity:.72;background:color-mix(in srgb, var(--workspace-tabs-foreground) 8%, transparent 92%);border-radius:4px;padding:0 4px;font-size:10px}body[data-dsh-workspace-tabs] .hDV6xa_dropdown{z-index:950;background:var(--workspace-tabs-canvas);border:1px solid var(--workspace-tabs-border-l2);min-width:240px;max-width:340px;max-height:420px;font-family:var(--workspace-tabs-ui-font);color:var(--workspace-tabs-foreground);border-radius:10px;padding:6px;font-size:12px;position:fixed;overflow-y:auto;box-shadow:0 10px 28px #0000002e}body[data-dsh-workspace-tabs] .hDV6xa_ddHeader{border-bottom:1px solid var(--workspace-tabs-border-l1);color:var(--workspace-tabs-label-dimmed);justify-content:space-between;align-items:center;margin-bottom:4px;padding:4px 8px 6px;font-weight:600;display:flex}body[data-dsh-workspace-tabs] .hDV6xa_ddSearch{box-sizing:border-box;border:1px solid var(--workspace-tabs-border-l2);background:var(--workspace-tabs-surface);width:100%;color:var(--workspace-tabs-foreground);border-radius:6px;outline:none;margin-bottom:6px;padding:5px 8px;font-family:inherit;font-size:12px}body[data-dsh-workspace-tabs] .hDV6xa_ddSearch:focus{border-color:var(--workspace-tabs-accent)}body[data-dsh-workspace-tabs] .hDV6xa_ddItem{box-sizing:border-box;width:100%;color:var(--workspace-tabs-foreground);font:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:6px;align-items:center;gap:8px;padding:6px 8px;display:flex}body[data-dsh-workspace-tabs] .hDV6xa_ddItem:hover{background:var(--workspace-tabs-hover)}body[data-dsh-workspace-tabs] .hDV6xa_ddItem[data-active=true]{background:var(--workspace-tabs-accent-soft);color:var(--workspace-tabs-brand-text);font-weight:600}body[data-dsh-workspace-tabs] .hDV6xa_ddItemTitle{text-overflow:ellipsis;white-space:nowrap;flex:auto;overflow:hidden}body[data-dsh-workspace-tabs] .hDV6xa_ddItemMeta{color:var(--workspace-tabs-label-caption);flex:none;font-size:11px}body[data-dsh-workspace-tabs] .hDV6xa_ddEmpty{text-align:center;color:var(--workspace-tabs-label-caption);padding:12px 8px}";
		const tagId = "@linxin666/dsh-client-ui-workspace-tabs/packages/dsh-workspace-tabs/src/client/workspace-tabs.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-client-ui-workspace-tabs";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var workspace_tabs_module_css_default = {
			"classicCenter": "hDV6xa_classicCenter",
			"classicPill": "hDV6xa_classicPill",
			"classicSep": "hDV6xa_classicSep",
			"classicSes": "hDV6xa_classicSes",
			"classicWs": "hDV6xa_classicWs",
			"compactLabel": "hDV6xa_compactLabel",
			"ddEmpty": "hDV6xa_ddEmpty",
			"ddHeader": "hDV6xa_ddHeader",
			"ddItem": "hDV6xa_ddItem",
			"ddItemMeta": "hDV6xa_ddItemMeta",
			"ddItemTitle": "hDV6xa_ddItemTitle",
			"ddSearch": "hDV6xa_ddSearch",
			"divider": "hDV6xa_divider",
			"dot": "hDV6xa_dot",
			"dragSpacer": "hDV6xa_dragSpacer",
			"dropdown": "hDV6xa_dropdown",
			"extBar": "hDV6xa_extBar",
			"fullLabel": "hDV6xa_fullLabel",
			"iconBtn": "hDV6xa_iconBtn",
			"modeBtn": "hDV6xa_modeBtn",
			"navGroup": "hDV6xa_navGroup",
			"row1": "hDV6xa_row1",
			"row2": "hDV6xa_row2",
			"tab": "hDV6xa_tab",
			"tabStrip": "hDV6xa_tabStrip",
			"tabStripWrap": "hDV6xa_tabStripWrap",
			"tabTitle": "hDV6xa_tabTitle",
			"titlebar": "hDV6xa_titlebar",
			"wsBar": "hDV6xa_wsBar",
			"wsCaret": "hDV6xa_wsCaret",
			"wsChip": "hDV6xa_wsChip",
			"wsCount": "hDV6xa_wsCount",
			"wsMain": "hDV6xa_wsMain"
		};
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"locale",
			"workspaces",
			"sessions",
			"uiWorkspace",
			"layout",
			"slots"
		];
		const MODE_STORAGE_KEY = "dsh-workspace-tabs:chrome-mode";
		const WS_STORAGE_KEY = "dsh-workspace-tabs:selected-workspace";
		const DEFAULT_APP_TITLE = "DeepSeek Harness";
		const MAX_VISIBLE_TABS = 12;
		const cls = (name) => workspace_tabs_module_css_default[name] ?? "";
		function readStorage(key) {
			try {
				return localStorage.getItem(key);
			} catch {
				return null;
			}
		}
		function writeStorage(key, val) {
			try {
				localStorage.setItem(key, val);
			} catch {}
		}
		function makeIconButton(label, tooltip, opts) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = opts.extraClass ? `${cls("iconBtn")} ${opts.extraClass}` : cls("iconBtn");
			if (opts.active) btn.dataset.active = "true";
			if (opts.disabled) btn.disabled = true;
			btn.title = tooltip;
			btn.setAttribute("aria-label", tooltip);
			if (opts.compactLabel) {
				const full = document.createElement("span");
				full.className = cls("fullLabel");
				full.textContent = label;
				const compact = document.createElement("span");
				compact.className = cls("compactLabel");
				compact.textContent = opts.compactLabel;
				btn.append(full, compact);
			} else btn.textContent = label;
			btn.onclick = opts.onClick;
			return btn;
		}
		/** Mount with the locale and state services already available through Cordis injection. */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "workspace-tabs: dictionaries");
			ctx.effect(() => mount(ctx), "workspace-tabs: chrome");
		}
		function mount(ctx) {
			const { layout, locale, sessions, slots, uiWorkspace, workspaces } = ctx;
			const t = locale.bind(NS);
			const actions = shellActions(ctx);
			const body = document.body;
			const isMacOS = document.documentElement.dataset.platform === "darwin";
			const markWindowRegion = (element, draggable) => {
				if (isMacOS) element.setAttribute(draggable ? "data-window-drag" : "data-no-drag", "true");
			};
			const originalTitle = document.title;
			let lastSkinTitle = null;
			let mode = readStorage(MODE_STORAGE_KEY) === "classic" ? "classic" : "browser";
			let selectedWorkspaceId = readStorage(WS_STORAGE_KEY) || null;
			const sessionHistory = [];
			let historyIndex = -1;
			let lastActiveSessionId = null;
			let activeDropdown = null;
			let activeAnchor = null;
			let lastRenderKey = "";
			const closeDropdown = () => {
				if (activeDropdown) {
					activeDropdown.remove();
					activeDropdown = null;
					activeAnchor = null;
				}
			};
			body.setAttribute("data-dsh-workspace-tabs", "");
			body.setAttribute("data-workspace-tabs-mode", mode);
			const titlebar = document.createElement("div");
			titlebar.className = cls("titlebar");
			titlebar.dataset.skinChrome = "titlebar";
			titlebar.dataset.dshPlugin = "workspace-tabs";
			markWindowRegion(titlebar, true);
			const row1 = document.createElement("div");
			row1.className = cls("row1");
			markWindowRegion(row1, true);
			const row2 = document.createElement("div");
			row2.className = cls("row2");
			markWindowRegion(row2, true);
			titlebar.append(row1, row2);
			body.append(titlebar);
			const sessionTitle = (session) => cleanSessionTitle(session.title || (session.blank ? void 0 : session.displayTitle), t("session.new"));
			const openSessionById = (sessionId) => {
				uiWorkspace.openSession(sessionId);
				closeDropdown();
			};
			const startNewSessionInWorkspace = (group) => {
				uiWorkspace.startSession(group.workspaceId);
				closeDropdown();
			};
			const moveInHistory = (step) => {
				const targetId = sessionHistory[historyIndex + step];
				if (!targetId) return;
				openSessionById(targetId);
				historyIndex += step;
				render();
			};
			const createAnchoredDropdown = (anchorEl, anchorId, alignRight = false) => {
				if (activeDropdown && activeAnchor === anchorEl && activeDropdown.dataset.anchorId === anchorId) {
					closeDropdown();
					return null;
				}
				closeDropdown();
				const rect = anchorEl.getBoundingClientRect();
				const dd = document.createElement("div");
				dd.className = cls("dropdown");
				dd.dataset.skinChrome = "dropdown";
				dd.dataset.anchorId = anchorId;
				dd.dataset.dshPlugin = "workspace-tabs";
				activeAnchor = anchorEl;
				markWindowRegion(dd, false);
				const top = Math.min(window.innerHeight - 80, Math.round(rect.bottom + 4));
				const rawLeft = alignRight ? rect.right - 260 : rect.left;
				const left = Math.max(8, Math.min(window.innerWidth - 320, Math.round(rawLeft)));
				dd.style.top = `${top}px`;
				dd.style.left = `${left}px`;
				return dd;
			};
			const openSessionsDropdown = (anchorEl, group, allGroups, activeSessionId) => {
				const dd = createAnchoredDropdown(anchorEl, `ws:${group.id}`);
				if (!dd) return;
				const header = document.createElement("div");
				header.className = cls("ddHeader");
				const hTitle = document.createElement("span");
				hTitle.textContent = `${group.title} (${group.sessions.length})`;
				const newBtn = makeIconButton(`+ ${t("session.new")}`, t("session.newInWorkspace", { workspace: group.title }), { onClick: (e) => {
					e.stopPropagation();
					startNewSessionInWorkspace(group);
				} });
				header.append(hTitle, newBtn);
				dd.append(header);
				const searchInput = document.createElement("input");
				searchInput.type = "search";
				searchInput.className = cls("ddSearch");
				searchInput.placeholder = t("session.filter");
				searchInput.setAttribute("aria-label", searchInput.placeholder);
				dd.append(searchInput);
				const listWrap = document.createElement("div");
				dd.append(listWrap);
				const now = Date.now();
				const format = new Intl.RelativeTimeFormat(locale.getSnapshot().active, { style: "short" });
				const renderItems = (q) => {
					listWrap.replaceChildren();
					const query = q.trim().toLowerCase();
					const pool = (query ? allGroups : [group]).flatMap((owner) => owner.sessions.map((session) => ({
						session,
						owner
					})));
					const filtered = query ? pool.filter(({ session, owner }) => sessionTitle(session).toLowerCase().includes(query) || owner.title.toLowerCase().includes(query)) : pool;
					if (filtered.length === 0) {
						const empty = document.createElement("div");
						empty.className = cls("ddEmpty");
						empty.textContent = t("session.noMatches");
						listWrap.append(empty);
						return;
					}
					for (const { session: s, owner } of filtered) {
						const item = document.createElement("button");
						item.type = "button";
						item.className = cls("ddItem");
						if (s.id === activeSessionId) item.dataset.active = "true";
						const dot = document.createElement("span");
						dot.className = cls("dot");
						if (s.running) dot.dataset.running = "true";
						else if (s.id === activeSessionId) dot.dataset.active = "true";
						const tSpan = document.createElement("span");
						tSpan.className = cls("ddItemTitle");
						const clean = sessionTitle(s);
						tSpan.textContent = query ? `[${owner.title}] ${clean}` : clean;
						tSpan.title = clean;
						const meta = document.createElement("span");
						meta.className = cls("ddItemMeta");
						meta.textContent = relativeTime(s.updatedAt, now, t, format);
						item.append(dot, tSpan, meta);
						item.onclick = (e) => {
							e.stopPropagation();
							selectedWorkspaceId = owner.id;
							writeStorage(WS_STORAGE_KEY, selectedWorkspaceId);
							openSessionById(s.id);
						};
						listWrap.append(item);
					}
				};
				searchInput.oninput = () => renderItems(searchInput.value);
				renderItems("");
				body.append(dd);
				activeDropdown = dd;
				searchInput.focus();
			};
			const togglePanel = (panelId) => {
				if (!slots.entriesOfSlot("main").some(({ options }) => options.key === panelId)) return;
				layout.selectPanel(layout.panelInfo.getSnapshot().activePanelId === panelId ? null : panelId);
			};
			const openPanelsDropdown = (anchorEl, panels, activePanelId) => {
				const dd = createAnchoredDropdown(anchorEl, "more:panels", true);
				if (!dd) return;
				const header = document.createElement("div");
				header.className = cls("ddHeader");
				const hTitle = document.createElement("span");
				hTitle.textContent = t("panel.all", { count: panels.length });
				header.append(hTitle);
				dd.append(header);
				for (const p of panels) {
					const item = document.createElement("button");
					item.type = "button";
					item.className = cls("ddItem");
					if (p.id === activePanelId) item.dataset.active = "true";
					const dot = document.createElement("span");
					dot.className = cls("dot");
					if (p.id === activePanelId) dot.dataset.active = "true";
					const labelSpan = document.createElement("span");
					labelSpan.className = cls("ddItemTitle");
					labelSpan.textContent = p.label;
					const idSpan = document.createElement("span");
					idSpan.className = cls("ddItemMeta");
					idSpan.textContent = p.id;
					item.append(dot, labelSpan, idSpan);
					item.onclick = (e) => {
						e.stopPropagation();
						togglePanel(p.id);
						closeDropdown();
					};
					dd.append(item);
				}
				body.append(dd);
				activeDropdown = dd;
			};
			const updateWindowTitle = (hasSession, wsTitle, sesTitle) => {
				if (document.title !== originalTitle && document.title !== "" && document.title !== lastSkinTitle) return;
				const nextTitle = hasSession ? `${wsTitle} / ${sesTitle} — ${DEFAULT_APP_TITLE}` : DEFAULT_APP_TITLE;
				if (document.title !== nextTitle) document.title = nextTitle;
				lastSkinTitle = nextTitle;
			};
			const setMode = (nextMode) => {
				mode = nextMode;
				body.setAttribute("data-workspace-tabs-mode", mode);
				writeStorage(MODE_STORAGE_KEY, mode);
				closeDropdown();
				render();
			};
			const render = () => {
				const workspaceSnapshot = workspaces.list.getSnapshot();
				const sessionSnapshot = sessions.list.getSnapshot();
				const { activePanelId } = layout.panelInfo.getSnapshot();
				const activeSession = mainSession(sessionSnapshot);
				const activeSessionId = activeSession?.id ?? null;
				const panels = panelEntries(slots);
				const groups = buildWorkspaceGroups(workspaceSnapshot, sessionSnapshot, activeSession, t);
				const groupWithActiveSession = groups.find((group) => group.sessions.some((session) => session.id === activeSessionId));
				if (activeSessionId !== lastActiveSessionId) {
					if (activeSessionId) {
						if (sessionHistory[historyIndex] !== activeSessionId) {
							sessionHistory.splice(historyIndex + 1);
							sessionHistory.push(activeSessionId);
							historyIndex = sessionHistory.length - 1;
						}
						if (lastActiveSessionId && groupWithActiveSession) selectedWorkspaceId = groupWithActiveSession.id;
					}
					lastActiveSessionId = activeSessionId;
				}
				if (workspaceSnapshot.phase === "ready" && sessionSnapshot.phase === "ready") {
					const navigable = new Set(groups.flatMap((group) => group.sessions.map((session) => session.id)));
					for (let index = sessionHistory.length - 1; index >= 0; index -= 1) {
						if (navigable.has(sessionHistory[index])) continue;
						sessionHistory.splice(index, 1);
						if (index <= historyIndex) historyIndex -= 1;
					}
				}
				const currentGroup = groups.find((group) => group.id === selectedWorkspaceId) ?? groupWithActiveSession ?? groups[0];
				const activeSessionTitle = activeSession ? sessionTitle(activeSession) : t("session.none");
				const activeWsTitle = groupWithActiveSession?.title ?? currentGroup.title;
				const { settingsAvailable, usageAvailable, remoteAvailable } = actions;
				const localeRevision = locale.getSnapshot().revision;
				updateWindowTitle(Boolean(activeSession), activeWsTitle, activeSessionTitle);
				const visibleTabs = currentGroup.sessions.slice(0, MAX_VISIBLE_TABS);
				const canBack = historyIndex > 0;
				const canFwd = historyIndex >= 0 && historyIndex < sessionHistory.length - 1;
				const nextRenderKey = JSON.stringify({
					mode,
					localeRevision,
					settingsAvailable,
					usageAvailable,
					remoteAvailable,
					activePanelId,
					activeSessionId,
					currentGroupId: currentGroup.id,
					canBack,
					canFwd,
					groups: groups.map((group) => [
						group.id,
						group.title,
						group.path,
						group.sessions.map((s) => [
							s.id,
							s.displayTitle,
							s.title,
							s.updatedAt,
							s.running
						])
					]),
					panels
				});
				if (nextRenderKey === lastRenderKey) return;
				lastRenderKey = nextRenderKey;
				row1.replaceChildren();
				const navGroup = document.createElement("div");
				navGroup.className = cls("navGroup");
				markWindowRegion(navGroup, false);
				navGroup.append(makeIconButton("◧", t("chrome.sidebar"), { onClick: () => layout.toggleSidebar() }), makeIconButton("←", t("session.back"), {
					disabled: !canBack,
					onClick: () => moveInHistory(-1)
				}), makeIconButton("→", t("session.forward"), {
					disabled: !canFwd,
					onClick: () => moveInHistory(1)
				}));
				row1.append(navGroup);
				const tabStripWrap = document.createElement("div");
				tabStripWrap.className = cls("tabStripWrap");
				markWindowRegion(tabStripWrap, true);
				const tabStrip = document.createElement("div");
				tabStrip.className = cls("tabStrip");
				markWindowRegion(tabStrip, false);
				for (const s of visibleTabs) {
					const tab = document.createElement("button");
					tab.type = "button";
					tab.className = cls("tab");
					const isTabActive = activePanelId === null && s.id === activeSessionId;
					if (isTabActive) tab.dataset.active = "true";
					const fullTitle = sessionTitle(s);
					tab.title = `${currentGroup.title} · ${fullTitle}`;
					const dot = document.createElement("span");
					dot.className = cls("dot");
					if (s.running) dot.dataset.running = "true";
					else if (isTabActive) dot.dataset.active = "true";
					const tSpan = document.createElement("span");
					tSpan.className = cls("tabTitle");
					tSpan.textContent = fullTitle;
					tab.append(dot, tSpan);
					tab.onclick = () => openSessionById(s.id);
					tabStrip.append(tab);
				}
				const newTabBtn = makeIconButton("+", t("session.newInWorkspace", { workspace: currentGroup.title }), { onClick: () => startNewSessionInWorkspace(currentGroup) });
				const allTabsBtn = makeIconButton(`▾ ${currentGroup.sessions.length}`, t("session.all", {
					workspace: currentGroup.title,
					count: currentGroup.sessions.length
				}), { onClick: (e) => {
					e.stopPropagation();
					openSessionsDropdown(allTabsBtn, currentGroup, groups, activeSessionId);
				} });
				const row1Spacer = document.createElement("div");
				row1Spacer.className = cls("dragSpacer");
				markWindowRegion(row1Spacer, true);
				tabStripWrap.append(tabStrip, newTabBtn, allTabsBtn, row1Spacer);
				row1.append(tabStripWrap);
				const classicCenter = document.createElement("div");
				classicCenter.className = cls("classicCenter");
				markWindowRegion(classicCenter, true);
				const classicPill = document.createElement("button");
				classicPill.type = "button";
				classicPill.className = cls("classicPill");
				markWindowRegion(classicPill, false);
				classicPill.title = t("chrome.switchSession");
				classicPill.setAttribute("aria-label", classicPill.title);
				const wsSpan = document.createElement("span");
				wsSpan.className = cls("classicWs");
				wsSpan.textContent = activeWsTitle;
				const sepSpan = document.createElement("span");
				sepSpan.className = cls("classicSep");
				sepSpan.textContent = "/";
				const sesSpan = document.createElement("span");
				sesSpan.className = cls("classicSes");
				sesSpan.textContent = panels.find((panel) => panel.id === activePanelId)?.label ?? activeSessionTitle;
				const caretSpan = document.createElement("span");
				caretSpan.className = cls("classicSep");
				caretSpan.textContent = "▾";
				classicPill.append(wsSpan, sepSpan, sesSpan, caretSpan);
				classicPill.onclick = (e) => {
					e.stopPropagation();
					openSessionsDropdown(classicPill, groupWithActiveSession ?? currentGroup, groups, activeSessionId);
				};
				classicCenter.append(classicPill);
				row1.append(classicCenter);
				const extBar = document.createElement("div");
				extBar.className = cls("extBar");
				markWindowRegion(extBar, false);
				const plugins = panels.find((panel) => panel.id === "plugins");
				const schedules = panels.find((panel) => panel.id === "schedules");
				const otherPanelActive = activePanelId !== null && activePanelId !== "plugins" && activePanelId !== "schedules";
				const moreBtn = makeIconButton(`⊞ ${t("panel.more")}`, t("panel.moreHint"), {
					active: otherPanelActive,
					compactLabel: "⊞",
					disabled: panels.length === 0,
					onClick: (e) => {
						e.stopPropagation();
						openPanelsDropdown(moreBtn, panels, activePanelId);
					}
				});
				const modeBtn = makeIconButton(t(mode === "browser" ? "chrome.classic" : "chrome.browser"), t(mode === "browser" ? "chrome.classicHint" : "chrome.browserHint"), {
					extraClass: cls("modeBtn"),
					compactLabel: mode === "browser" ? "▬" : "▤",
					onClick: () => setMode(mode === "browser" ? "classic" : "browser")
				});
				const divider = document.createElement("span");
				divider.className = cls("divider");
				extBar.append(makeIconButton(t("panel.plugins"), t("panel.pluginsHint"), {
					active: activePanelId === "plugins",
					compactLabel: "P",
					disabled: !plugins,
					onClick: () => {
						if (plugins) togglePanel(plugins.id);
					}
				}), makeIconButton(t("panel.schedules"), t("panel.schedulesHint"), {
					active: activePanelId === "schedules",
					compactLabel: "S",
					disabled: !schedules,
					onClick: () => {
						if (schedules) togglePanel(schedules.id);
					}
				}), makeIconButton(t("panel.usage"), t("panel.usageHint"), {
					compactLabel: "U",
					disabled: !usageAvailable,
					onClick: () => actions.openUsage()
				}), makeIconButton(t("panel.remote"), t("panel.remoteHint"), {
					compactLabel: "R",
					disabled: !remoteAvailable,
					onClick: () => actions.openRemote()
				}), moreBtn, makeIconButton(t("panel.settings"), t("panel.settingsHint"), {
					compactLabel: "◈",
					disabled: !settingsAvailable,
					onClick: () => actions.openSettings()
				}), divider, modeBtn);
				row1.append(extBar);
				row2.replaceChildren();
				const wsBar = document.createElement("div");
				wsBar.className = cls("wsBar");
				for (const g of groups) {
					const chip = document.createElement("div");
					chip.className = cls("wsChip");
					markWindowRegion(chip, false);
					if (g.id === currentGroup.id) chip.dataset.active = "true";
					const mainBtn = document.createElement("button");
					mainBtn.type = "button";
					mainBtn.className = cls("wsMain");
					const switchLabel = t("workspace.switch", { workspace: g.title });
					mainBtn.title = g.path ? `${switchLabel} (${g.path})` : switchLabel;
					mainBtn.setAttribute("aria-label", switchLabel);
					const nameSpan = document.createElement("span");
					nameSpan.textContent = g.title;
					const countSpan = document.createElement("span");
					countSpan.className = cls("wsCount");
					countSpan.textContent = String(g.sessions.length);
					mainBtn.append(nameSpan, countSpan);
					if (g.running) {
						const rDot = document.createElement("span");
						rDot.className = cls("dot");
						rDot.dataset.running = "true";
						mainBtn.append(rDot);
					}
					mainBtn.onclick = () => {
						selectedWorkspaceId = g.id;
						writeStorage(WS_STORAGE_KEY, selectedWorkspaceId);
						const current = g.sessions.find((session) => session.id === activeSessionId);
						const target = current ?? g.sessions[0];
						if (target && (!current || activePanelId !== null)) openSessionById(target.id);
						closeDropdown();
						render();
					};
					const caretBtn = document.createElement("button");
					caretBtn.type = "button";
					caretBtn.className = cls("wsCaret");
					caretBtn.title = t("workspace.sessions", { workspace: g.title });
					caretBtn.setAttribute("aria-label", caretBtn.title);
					caretBtn.textContent = "▾";
					caretBtn.onclick = (e) => {
						e.stopPropagation();
						openSessionsDropdown(caretBtn, g, groups, activeSessionId);
					};
					chip.append(mainBtn, caretBtn);
					wsBar.append(chip);
				}
				const row2Spacer = document.createElement("div");
				row2Spacer.className = cls("dragSpacer");
				markWindowRegion(row2Spacer, true);
				const row2Right = document.createElement("div");
				row2Right.className = cls("navGroup");
				markWindowRegion(row2Right, false);
				const searchBtn = makeIconButton(t("chrome.search"), t("chrome.searchHint"), { onClick: (e) => {
					e.stopPropagation();
					openSessionsDropdown(searchBtn, currentGroup, groups, activeSessionId);
				} });
				row2Right.append(searchBtn);
				row2.append(wsBar, row2Spacer, row2Right);
			};
			let pendingRender = false;
			let disposed = false;
			const scheduleRender = () => {
				if (pendingRender || disposed) return;
				pendingRender = true;
				queueMicrotask(() => {
					pendingRender = false;
					if (!disposed) render();
				});
			};
			const stopWatching = [
				workspaces.list.subscribe(scheduleRender),
				sessions.list.subscribe(scheduleRender),
				layout.panelInfo.subscribe(scheduleRender),
				locale.subscribe(() => {
					closeDropdown();
					scheduleRender();
				}),
				...[...panelSlots, ...actionSlots].map((slot) => slots.subscribe(slot, scheduleRender)),
				ctx.on("slots/changed", (slot) => {
					if (slot === "web-ui.extension") scheduleRender();
				})
			];
			render();
			const onDocPointerDown = (e) => {
				if (activeDropdown && e.target instanceof Node && !activeDropdown.contains(e.target) && !activeAnchor?.contains(e.target)) closeDropdown();
			};
			document.addEventListener("pointerdown", onDocPointerDown);
			return () => {
				disposed = true;
				document.removeEventListener("pointerdown", onDocPointerDown);
				for (const stop of stopWatching) stop();
				closeDropdown();
				body.removeAttribute("data-dsh-workspace-tabs");
				body.removeAttribute("data-workspace-tabs-mode");
				titlebar.remove();
				if (lastSkinTitle !== null && document.title === lastSkinTitle) document.title = originalTitle;
			};
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map