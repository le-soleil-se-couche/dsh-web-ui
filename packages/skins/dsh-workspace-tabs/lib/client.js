window.__ModuleLoader__.load({
	id: "@linxin666/dsh-client-ui-workspace-tabs",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0dsh-css:/Users/ewin/Dev/dsh-workspace-tabs/packages/skins/dsh-workspace-tabs/src/client/workspace-tabs.module.css.mjs
		const css = "body[data-dsh-workspace-tabs]{--workspace-tabs-ui-font:var(--dsh-appearance-ui-font,\"思源宋体 VF\", \"Source Han Serif SC VF\", \"思源宋体\", serif);--workspace-tabs-code-font:var(--dsh-appearance-code-font,\"SF Mono\", Consolas, \"Courier New\", monospace);--workspace-tabs-accent:var(--dsh-appearance-light-accent,#da7756);--workspace-tabs-canvas:var(--dsh-appearance-light-canvas,#f5f3ee);--workspace-tabs-surface:var(--dsh-appearance-light-surface,#f1eee8);--workspace-tabs-foreground:var(--dsh-appearance-light-foreground,#1d1b16);--workspace-tabs-brand-invert:var(--workspace-tabs-canvas);--workspace-tabs-brand-text:color-mix(in srgb, var(--workspace-tabs-accent) 72%, var(--workspace-tabs-foreground) 28%);--workspace-tabs-layer-2:color-mix(in srgb, var(--workspace-tabs-surface) 94%, var(--workspace-tabs-foreground) 6%);--workspace-tabs-layer-3:color-mix(in srgb, var(--workspace-tabs-surface) 90%, var(--workspace-tabs-foreground) 10%);--workspace-tabs-label-primary-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 82%, var(--workspace-tabs-canvas) 18%);--workspace-tabs-label-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 68%, var(--workspace-tabs-canvas) 32%);--workspace-tabs-label-caption:color-mix(in srgb, var(--workspace-tabs-foreground) 48%, var(--workspace-tabs-canvas) 52%);--workspace-tabs-border-l1:color-mix(in srgb, var(--workspace-tabs-surface) 82%, var(--workspace-tabs-foreground) 18%);--workspace-tabs-border-l2:color-mix(in srgb, var(--workspace-tabs-surface) 76%, var(--workspace-tabs-foreground) 24%);--workspace-tabs-border-l3:color-mix(in srgb, var(--workspace-tabs-surface) 68%, var(--workspace-tabs-foreground) 32%);--workspace-tabs-border-l4:color-mix(in srgb, var(--workspace-tabs-surface) 60%, var(--workspace-tabs-foreground) 40%);--workspace-tabs-hover:color-mix(in srgb, var(--workspace-tabs-surface) 92%, var(--workspace-tabs-foreground) 8%);--workspace-tabs-active:color-mix(in srgb, var(--workspace-tabs-surface) 86%, var(--workspace-tabs-foreground) 14%);--workspace-tabs-accent-hover:color-mix(in srgb, var(--workspace-tabs-accent) 88%, var(--workspace-tabs-foreground) 12%);--workspace-tabs-accent-soft:color-mix(in srgb, var(--workspace-tabs-accent) 14%, transparent 86%);--workspace-tabs-accent-solid:color-mix(in srgb, var(--workspace-tabs-accent) 22%, transparent 78%);--workspace-tabs-raised:color-mix(in srgb, var(--workspace-tabs-canvas) 78%, var(--workspace-tabs-surface) 22%);--workspace-tabs-titlebar-surface:var(--workspace-tabs-canvas);--dsw-font-family:var(--workspace-tabs-ui-font);--ds-font-family-code:var(--workspace-tabs-code-font);--dsw-alias-brand-primary:var(--workspace-tabs-accent);--dsw-alias-brand-primary-invert:var(--workspace-tabs-brand-invert);--dsw-alias-brand-primary-new-colorprimary-new-color:var(--workspace-tabs-accent);--dsw-alias-brand-text:var(--workspace-tabs-brand-text);--dsw-alias-bg-base:var(--workspace-tabs-canvas);--dsw-alias-bg-layer-1:var(--workspace-tabs-surface);--dsw-alias-bg-layer-2:var(--workspace-tabs-layer-2);--dsw-alias-bg-layer-3:var(--workspace-tabs-layer-3);--dsw-alias-label-primary:var(--workspace-tabs-foreground);--dsw-alias-label-primary-foreground:var(--workspace-tabs-foreground);--dsw-alias-label-primary-bluish:var(--workspace-tabs-foreground);--dsw-alias-label-primary-dimmed:var(--workspace-tabs-label-primary-dimmed);--dsw-alias-label-primary-inverted:var(--workspace-tabs-canvas);--dsw-alias-label-dimmed:var(--workspace-tabs-label-dimmed);--dsw-alias-label-caption:var(--workspace-tabs-label-caption);--dsw-alias-border-l1:var(--workspace-tabs-border-l1);--dsw-alias-border-l2:var(--workspace-tabs-border-l2);--dsw-alias-border-l3:var(--workspace-tabs-border-l3);--dsw-alias-border-l4:var(--workspace-tabs-border-l4);--dsw-alias-border-inverted:var(--workspace-tabs-foreground);--dsw-alias-border-inverted2:var(--workspace-tabs-foreground);--dsw-alias-interactive-bg-hover:var(--workspace-tabs-hover);--dsw-alias-interactive-bg-active:var(--workspace-tabs-active);--dsw-alias-interactive-bg-hover-accent:var(--workspace-tabs-accent-soft);--dsw-alias-interactive-bg-hover-solid:var(--workspace-tabs-accent-solid);--dsw-alias-button-primary-fill:var(--workspace-tabs-accent);--dsw-alias-button-primary-hover:var(--workspace-tabs-accent-hover);--dsw-alias-button-primary-dimmed:var(--workspace-tabs-accent-solid);--dsw-alias-button-elevated-fill:var(--workspace-tabs-raised);--dsw-alias-button-floating-fill:var(--workspace-tabs-raised);--dsw-alias-button-tool-bar-fill:var(--workspace-tabs-canvas);--dsw-alias-button-contrast-fill:var(--workspace-tabs-foreground);--dsh-frame-chrome-top:68px;--dsh-frame-overlay-top:68px;color:var(--workspace-tabs-foreground);background-color:var(--workspace-tabs-canvas);box-sizing:border-box;padding-top:68px}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic]{--dsh-frame-chrome-top:40px;--dsh-frame-overlay-top:40px;padding-top:40px}body[data-dsh-workspace-tabs][data-ds-dark-theme]{--workspace-tabs-accent:var(--dsh-appearance-dark-accent,#da7756);--workspace-tabs-canvas:var(--dsh-appearance-dark-canvas,#1d1b16);--workspace-tabs-surface:var(--dsh-appearance-dark-surface,#262119);--workspace-tabs-foreground:var(--dsh-appearance-dark-foreground,#f5f3ee);--workspace-tabs-brand-invert:var(--workspace-tabs-canvas);--workspace-tabs-brand-text:color-mix(in srgb, var(--workspace-tabs-accent) 78%, var(--workspace-tabs-foreground) 22%);--workspace-tabs-layer-2:color-mix(in srgb, var(--workspace-tabs-surface) 94%, var(--workspace-tabs-foreground) 6%);--workspace-tabs-layer-3:color-mix(in srgb, var(--workspace-tabs-surface) 90%, var(--workspace-tabs-foreground) 10%);--workspace-tabs-label-primary-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 84%, var(--workspace-tabs-canvas) 16%);--workspace-tabs-label-dimmed:color-mix(in srgb, var(--workspace-tabs-foreground) 70%, var(--workspace-tabs-canvas) 30%);--workspace-tabs-label-caption:color-mix(in srgb, var(--workspace-tabs-foreground) 48%, var(--workspace-tabs-canvas) 52%);--workspace-tabs-border-l1:color-mix(in srgb, var(--workspace-tabs-surface) 82%, var(--workspace-tabs-foreground) 18%);--workspace-tabs-border-l2:color-mix(in srgb, var(--workspace-tabs-surface) 76%, var(--workspace-tabs-foreground) 24%);--workspace-tabs-border-l3:color-mix(in srgb, var(--workspace-tabs-surface) 68%, var(--workspace-tabs-foreground) 32%);--workspace-tabs-border-l4:color-mix(in srgb, var(--workspace-tabs-surface) 60%, var(--workspace-tabs-foreground) 40%);--workspace-tabs-hover:color-mix(in srgb, var(--workspace-tabs-surface) 90%, var(--workspace-tabs-foreground) 10%);--workspace-tabs-active:color-mix(in srgb, var(--workspace-tabs-surface) 84%, var(--workspace-tabs-foreground) 16%);--workspace-tabs-accent-hover:color-mix(in srgb, var(--workspace-tabs-accent) 88%, var(--workspace-tabs-foreground) 12%);--workspace-tabs-accent-soft:color-mix(in srgb, var(--workspace-tabs-accent) 18%, transparent 82%);--workspace-tabs-accent-solid:color-mix(in srgb, var(--workspace-tabs-accent) 28%, transparent 72%);--workspace-tabs-raised:color-mix(in srgb, var(--workspace-tabs-canvas) 62%, var(--workspace-tabs-surface) 38%);--workspace-tabs-titlebar-surface:var(--workspace-tabs-surface)}body[data-dsh-workspace-tabs] .kB3qhq_topStrip{display:none!important}body[data-dsh-workspace-tabs] .kB3qhq_logoRow{height:44px!important;margin-top:0!important}body[data-dsh-workspace-tabs] [data-shell-leading]{display:none!important}html[data-platform=darwin] body[data-dsh-workspace-tabs]:not([data-window-drag-recall]) ._3FD72q_titlebar[data-window-drag],html[data-platform=darwin] body[data-dsh-workspace-tabs]:not([data-window-drag-recall]) ._3FD72q_titlebar [data-window-drag]{-webkit-app-region:drag!important}html[data-platform=darwin] body[data-dsh-workspace-tabs] ._3FD72q_titlebar [data-no-drag],html[data-platform=darwin] body[data-dsh-workspace-tabs] ._3FD72q_titlebar button,html[data-platform=darwin] body[data-dsh-workspace-tabs] ._3FD72q_titlebar input,html[data-platform=darwin] body[data-dsh-workspace-tabs] ._3FD72q_dropdown{-webkit-app-region:no-drag!important}body[data-dsh-workspace-tabs] ._3FD72q_titlebar{z-index:400;background:var(--workspace-tabs-titlebar-surface);border-bottom:1px solid var(--workspace-tabs-border-l1);height:68px;color:var(--workspace-tabs-foreground);font-family:var(--workspace-tabs-ui-font);user-select:none;box-sizing:border-box;flex-direction:column;font-size:12px;display:flex;position:fixed;top:0;left:0;right:0}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] ._3FD72q_titlebar{height:40px}body[data-dsh-workspace-tabs] ._3FD72q_row1{box-sizing:border-box;align-items:center;gap:6px;height:40px;min-height:40px;padding:0 10px;display:flex;position:relative}html[data-platform=darwin]:not([data-fullscreen]) body[data-dsh-workspace-tabs] ._3FD72q_row1{padding-left:84px}body[data-dsh-workspace-tabs] ._3FD72q_row2{box-sizing:border-box;background:color-mix(in srgb, var(--workspace-tabs-canvas) 65%, var(--workspace-tabs-surface) 35%);border-top:1px solid color-mix(in srgb, var(--workspace-tabs-border-l1) 60%, transparent 40%);align-items:center;gap:4px;height:28px;min-height:28px;padding:0 10px;font-size:12px;display:flex}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] ._3FD72q_row2{display:none}body[data-dsh-workspace-tabs] ._3FD72q_navGroup{flex:none;align-items:center;gap:3px;display:inline-flex}body[data-dsh-workspace-tabs] ._3FD72q_iconBtn{min-width:26px;height:26px;color:var(--workspace-tabs-label-primary-dimmed);cursor:pointer;white-space:nowrap;background:0 0;border:1px solid #0000;border-radius:6px;justify-content:center;align-items:center;gap:4px;padding:0 7px;font-family:inherit;font-size:12px;transition:background .12s,color .12s,border-color .12s;display:inline-flex}body[data-dsh-workspace-tabs] ._3FD72q_iconBtn:hover{background:var(--workspace-tabs-hover);color:var(--workspace-tabs-foreground)}body[data-dsh-workspace-tabs] ._3FD72q_iconBtn[data-active=true]{background:var(--workspace-tabs-accent-soft);color:var(--workspace-tabs-brand-text);border-color:color-mix(in srgb, var(--workspace-tabs-accent) 35%, transparent 65%);font-weight:600}body[data-dsh-workspace-tabs] ._3FD72q_iconBtn:disabled{opacity:.38;cursor:default;pointer-events:none}body[data-dsh-workspace-tabs] ._3FD72q_tabStripWrap{flex:auto;align-items:center;gap:4px;min-width:0;height:100%;display:flex;overflow:hidden}body[data-dsh-workspace-tabs] ._3FD72q_tabStrip{scrollbar-width:none;box-sizing:border-box;align-items:flex-end;gap:3px;max-width:100%;height:100%;padding-top:6px;display:flex;overflow-x:auto}body[data-dsh-workspace-tabs] ._3FD72q_tabStrip::-webkit-scrollbar{display:none}body[data-dsh-workspace-tabs] ._3FD72q_tab{background:color-mix(in srgb, var(--workspace-tabs-surface) 75%, transparent 25%);min-width:84px;max-width:200px;height:32px;color:var(--workspace-tabs-label-dimmed);cursor:pointer;box-sizing:border-box;border:1px solid #0000;border-bottom:none;border-radius:8px 8px 0 0;flex:0 auto;align-items:center;gap:6px;padding:0 10px;font-family:inherit;font-size:12px;transition:background .12s,color .12s;display:inline-flex;position:relative}body[data-dsh-workspace-tabs] ._3FD72q_tab:hover{background:var(--workspace-tabs-hover);color:var(--workspace-tabs-foreground)}body[data-dsh-workspace-tabs] ._3FD72q_tab[data-active=true]{background:var(--workspace-tabs-canvas);color:var(--workspace-tabs-foreground);border-color:var(--workspace-tabs-border-l1);box-shadow:0 -2px 0 0 var(--workspace-tabs-accent) inset;font-weight:600}body[data-dsh-workspace-tabs] ._3FD72q_tabTitle{text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:auto;overflow:hidden}body[data-dsh-workspace-tabs] ._3FD72q_dot{background:var(--workspace-tabs-label-caption);border-radius:50%;flex:none;width:6px;height:6px}body[data-dsh-workspace-tabs] ._3FD72q_dot[data-running=true]{background:#2eab5c;box-shadow:0 0 0 2px #2eab5c40}body[data-dsh-workspace-tabs] ._3FD72q_dot[data-active=true]:not([data-running=true]){background:var(--workspace-tabs-accent)}body[data-dsh-workspace-tabs] ._3FD72q_dragSpacer{flex:24px;min-width:24px;height:100%}body[data-dsh-workspace-tabs] ._3FD72q_classicCenter{flex:auto;justify-content:center;align-items:center;gap:6px;min-width:0;height:100%;display:none}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] ._3FD72q_classicCenter{display:flex}body[data-dsh-workspace-tabs][data-workspace-tabs-mode=classic] ._3FD72q_tabStripWrap{display:none}body[data-dsh-workspace-tabs] ._3FD72q_classicPill{background:color-mix(in srgb, var(--workspace-tabs-surface) 82%, var(--workspace-tabs-foreground) 4%);border:1px solid var(--workspace-tabs-border-l1);max-width:460px;color:var(--workspace-tabs-foreground);cursor:pointer;text-overflow:ellipsis;white-space:nowrap;border-radius:7px;align-items:center;gap:6px;padding:4px 12px;font-family:inherit;font-size:12px;display:inline-flex;overflow:hidden}body[data-dsh-workspace-tabs] ._3FD72q_classicPill:hover{background:var(--workspace-tabs-hover)}body[data-dsh-workspace-tabs] ._3FD72q_classicWs{color:var(--workspace-tabs-brand-text);flex:none;font-weight:600}body[data-dsh-workspace-tabs] ._3FD72q_classicSep{color:var(--workspace-tabs-label-caption);flex:none}body[data-dsh-workspace-tabs] ._3FD72q_classicSes{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}body[data-dsh-workspace-tabs] ._3FD72q_extBar{border-left:1px solid var(--workspace-tabs-border-l1);flex:none;align-items:center;gap:3px;padding-left:6px;display:inline-flex}body[data-dsh-workspace-tabs] ._3FD72q_divider{background:var(--workspace-tabs-border-l1);flex:none;width:1px;height:14px;margin:0 2px}body[data-dsh-workspace-tabs] ._3FD72q_modeBtn{border:1px solid var(--workspace-tabs-border-l1);background:var(--workspace-tabs-raised);font-weight:500}body[data-dsh-workspace-tabs] ._3FD72q_wsBar{scrollbar-width:none;flex:0 auto;align-items:center;gap:4px;min-width:0;height:100%;display:flex;overflow-x:auto}body[data-dsh-workspace-tabs] ._3FD72q_wsBar::-webkit-scrollbar{display:none}body[data-dsh-workspace-tabs] ._3FD72q_wsChip{height:22px;color:var(--workspace-tabs-label-primary-dimmed);background:0 0;border:1px solid #0000;border-radius:5px;flex:none;align-items:center;font-size:12px;transition:background .12s,border-color .12s,color .12s;display:inline-flex;overflow:hidden}body[data-dsh-workspace-tabs] ._3FD72q_wsChip:hover{background:var(--workspace-tabs-hover);color:var(--workspace-tabs-foreground)}body[data-dsh-workspace-tabs] ._3FD72q_wsChip[data-active=true]{background:var(--workspace-tabs-accent-soft);color:var(--workspace-tabs-brand-text);border-color:color-mix(in srgb, var(--workspace-tabs-accent) 32%, transparent 68%);font-weight:600}body[data-dsh-workspace-tabs] ._3FD72q_wsMain{height:100%;color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;align-items:center;gap:4px;padding:0 6px 0 7px;display:inline-flex}body[data-dsh-workspace-tabs] ._3FD72q_wsCaret{border:none;border-left:1px solid color-mix(in srgb, var(--workspace-tabs-border-l1) 50%, transparent 50%);width:16px;height:100%;color:inherit;cursor:pointer;opacity:.75;background:0 0;justify-content:center;align-items:center;font-size:10px;display:inline-flex}body[data-dsh-workspace-tabs] ._3FD72q_wsCaret:hover{opacity:1;background:color-mix(in srgb, var(--workspace-tabs-foreground) 8%, transparent 92%)}body[data-dsh-workspace-tabs] ._3FD72q_wsCount{opacity:.72;background:color-mix(in srgb, var(--workspace-tabs-foreground) 8%, transparent 92%);border-radius:4px;padding:0 4px;font-size:10px}body[data-dsh-workspace-tabs] ._3FD72q_dropdown{z-index:950;background:var(--workspace-tabs-canvas);border:1px solid var(--workspace-tabs-border-l2);min-width:240px;max-width:340px;max-height:420px;font-family:var(--workspace-tabs-ui-font);color:var(--workspace-tabs-foreground);border-radius:10px;padding:6px;font-size:12px;position:fixed;overflow-y:auto;box-shadow:0 10px 28px #0000002e}body[data-dsh-workspace-tabs] ._3FD72q_ddHeader{border-bottom:1px solid var(--workspace-tabs-border-l1);color:var(--workspace-tabs-label-dimmed);justify-content:space-between;align-items:center;margin-bottom:4px;padding:4px 8px 6px;font-weight:600;display:flex}body[data-dsh-workspace-tabs] ._3FD72q_ddSearch{box-sizing:border-box;border:1px solid var(--workspace-tabs-border-l2);background:var(--workspace-tabs-surface);width:100%;color:var(--workspace-tabs-foreground);border-radius:6px;outline:none;margin-bottom:6px;padding:5px 8px;font-family:inherit;font-size:12px}body[data-dsh-workspace-tabs] ._3FD72q_ddSearch:focus{border-color:var(--workspace-tabs-accent)}body[data-dsh-workspace-tabs] ._3FD72q_ddItem{box-sizing:border-box;width:100%;color:var(--workspace-tabs-foreground);font:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:6px;align-items:center;gap:8px;padding:6px 8px;display:flex}body[data-dsh-workspace-tabs] ._3FD72q_ddItem:hover{background:var(--workspace-tabs-hover)}body[data-dsh-workspace-tabs] ._3FD72q_ddItem[data-active=true]{background:var(--workspace-tabs-accent-soft);color:var(--workspace-tabs-brand-text);font-weight:600}body[data-dsh-workspace-tabs] ._3FD72q_ddItemTitle{text-overflow:ellipsis;white-space:nowrap;flex:auto;overflow:hidden}body[data-dsh-workspace-tabs] ._3FD72q_ddItemMeta{color:var(--workspace-tabs-label-caption);flex:none;font-size:11px}body[data-dsh-workspace-tabs] ._3FD72q_ddEmpty{text-align:center;color:var(--workspace-tabs-label-caption);padding:12px 8px}";
		const tagId = "@linxin666/dsh-client-ui-workspace-tabs/workspace-tabs.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-client-ui-workspace-tabs";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var workspace_tabs_module_css_default = {
			"classicCenter": "_3FD72q_classicCenter",
			"classicPill": "_3FD72q_classicPill",
			"classicSep": "_3FD72q_classicSep",
			"classicSes": "_3FD72q_classicSes",
			"classicWs": "_3FD72q_classicWs",
			"ddEmpty": "_3FD72q_ddEmpty",
			"ddHeader": "_3FD72q_ddHeader",
			"ddItem": "_3FD72q_ddItem",
			"ddItemMeta": "_3FD72q_ddItemMeta",
			"ddItemTitle": "_3FD72q_ddItemTitle",
			"ddSearch": "_3FD72q_ddSearch",
			"divider": "_3FD72q_divider",
			"dot": "_3FD72q_dot",
			"dragSpacer": "_3FD72q_dragSpacer",
			"dropdown": "_3FD72q_dropdown",
			"extBar": "_3FD72q_extBar",
			"iconBtn": "_3FD72q_iconBtn",
			"modeBtn": "_3FD72q_modeBtn",
			"navGroup": "_3FD72q_navGroup",
			"row1": "_3FD72q_row1",
			"row2": "_3FD72q_row2",
			"tab": "_3FD72q_tab",
			"tabStrip": "_3FD72q_tabStrip",
			"tabStripWrap": "_3FD72q_tabStripWrap",
			"tabTitle": "_3FD72q_tabTitle",
			"titlebar": "_3FD72q_titlebar",
			"wsBar": "_3FD72q_wsBar",
			"wsCaret": "_3FD72q_wsCaret",
			"wsChip": "_3FD72q_wsChip",
			"wsCount": "_3FD72q_wsCount",
			"wsMain": "_3FD72q_wsMain"
		};
		//#endregion
		//#region src/client/index.ts
		const MODE_STORAGE_KEY = "dsh-workspace-tabs:chrome-mode";
		const WS_STORAGE_KEY = "dsh-workspace-tabs:selected-workspace";
		const UNGROUPED_ID = "__ungrouped__";
		const DEFAULT_APP_TITLE = "DeepSeek Harness";
		const MAX_VISIBLE_TABS = 12;
		const cls = (name) => workspace_tabs_module_css_default[name] ?? "";
		/** Strip ChatML tags and fallback cleanly for blank session titles. */
		function cleanSessionTitle(raw) {
			if (!raw || typeof raw !== "string") return "新对话";
			let s = raw.trim();
			if (s.startsWith("<|im_start|>")) s = s.replace(/^<\|im_start\|>[^\n]*\n?/g, "").replace(/<[^>]+>/g, " ").trim();
			return s || "新对话";
		}
		function formatRelativeTime(isoOrMs) {
			if (!isoOrMs) return "";
			const ts = typeof isoOrMs === "number" ? isoOrMs : Date.parse(isoOrMs);
			if (!Number.isFinite(ts)) return "";
			const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1e3));
			if (diffSec < 60) return "刚刚";
			const diffMin = Math.floor(diffSec / 60);
			if (diffMin < 60) return `${diffMin}分钟`;
			const diffHr = Math.floor(diffMin / 60);
			if (diffHr < 24) return `${diffHr}小时`;
			const diffDay = Math.floor(diffHr / 24);
			if (diffDay < 30) return `${diffDay}天`;
			return `${Math.floor(diffDay / 30)}月`;
		}
		function clickDomSelector(selector, textHint) {
			const nodes = Array.from(document.querySelectorAll(selector));
			if (textHint) {
				const matched = nodes.find((el) => {
					const txt = el.textContent || "";
					const label = el.getAttribute("aria-label") || "";
					return txt.includes(textHint) || label.includes(textHint);
				});
				if (matched instanceof HTMLElement) {
					matched.click();
					return true;
				}
			}
			const first = nodes[0];
			if (first instanceof HTMLElement) {
				first.click();
				return true;
			}
			return false;
		}
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
		function resolveSlotLabel(raw, fallback) {
			if (typeof raw === "function") try {
				return raw() || fallback;
			} catch {
				return fallback;
			}
			return raw || fallback;
		}
		function getPanelEntries(slots) {
			return (slots?.entriesOfSlot?.("sidebar.panellist") ?? []).map((entry) => {
				const id = entry.options?.id ?? "";
				if (!id) return null;
				return {
					id,
					order: entry.options?.order ?? 0,
					label: resolveSlotLabel(entry.options?.label, id)
				};
			}).filter((item) => item !== null).sort((a, b) => a.order - b.order);
		}
		function makeIconButton(label, tooltip, opts) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = opts.extraClass ? `${cls("iconBtn")} ${opts.extraClass}` : cls("iconBtn");
			if (opts.active) btn.dataset.active = "true";
			if (opts.disabled) btn.disabled = true;
			btn.title = tooltip;
			btn.textContent = label;
			btn.onclick = opts.onClick;
			return btn;
		}
		/**
		* Apply the Workspace Tabs skin: scoped palette variables, macOS draggable chrome bar
		* (Chrome Browser mode / Classic Mac mode), clean window title, and store reactivity.
		*/
		function apply(ctx) {
			const body = document.body;
			const isMacOS = document.documentElement.dataset.platform === "darwin";
			const markWindowRegion = (element, draggable) => {
				if (isMacOS) element.setAttribute(draggable ? "data-window-drag" : "data-no-drag", "true");
			};
			const originalTitle = document.title;
			let lastSkinTitle = null;
			for (const stale of Array.from(document.querySelectorAll("[data-skin-chrome=\"titlebar\"], [data-skin-chrome=\"dropdown\"]"))) stale.remove();
			let mode = readStorage(MODE_STORAGE_KEY) === "classic" ? "classic" : "browser";
			let selectedWorkspaceId = readStorage(WS_STORAGE_KEY) || null;
			const sessionHistory = [];
			let historyIndex = -1;
			let lastActiveSessionId = null;
			let activeDropdown = null;
			let lastRenderKey = "";
			const closeDropdown = () => {
				if (activeDropdown) {
					activeDropdown.remove();
					activeDropdown = null;
				}
			};
			body.setAttribute("data-dsh-workspace-tabs", "");
			body.setAttribute("data-workspace-tabs-mode", mode);
			const titlebar = document.createElement("div");
			titlebar.className = cls("titlebar");
			titlebar.dataset.skinChrome = "titlebar";
			markWindowRegion(titlebar, true);
			const row1 = document.createElement("div");
			row1.className = cls("row1");
			markWindowRegion(row1, true);
			const row2 = document.createElement("div");
			row2.className = cls("row2");
			markWindowRegion(row2, true);
			titlebar.append(row1, row2);
			body.append(titlebar);
			const getServices = () => {
				const get = ctx.get;
				if (typeof get !== "function") return {};
				return {
					workspaces: get.call(ctx, "workspaces"),
					sessions: get.call(ctx, "sessions"),
					uiWorkspace: get.call(ctx, "uiWorkspace"),
					layout: get.call(ctx, "layout"),
					slots: get.call(ctx, "slots")
				};
			};
			const getActiveSessionId = (sesSnap, uiWorkspace) => {
				const mainRefId = uiWorkspace?.mainReference?.sessionId;
				if (mainRefId && sesSnap?.byId?.[mainRefId]) return mainRefId;
				const selId = uiWorkspace?.selection?.getSnapshot?.()?.sessionId;
				if (selId && sesSnap?.byId?.[selId]) return selId;
				if (sesSnap?.byId) {
					for (const s of Object.values(sesSnap.byId)) if ((s?.retainedBy?.mainView ?? 0) > 0) return s.id;
				}
				return null;
			};
			const buildWorkspaceGroups = (wsSnap, sesSnap) => {
				const items = wsSnap?.items ?? [];
				const archived = new Set(wsSnap?.archivedSessionIds ?? []);
				const byId = sesSnap?.byId ?? {};
				const allIds = sesSnap?.ids ?? Object.keys(byId);
				const claimed = /* @__PURE__ */ new Set();
				const groups = items.map((ws) => {
					const rawIds = ws.sessionIds ?? [];
					const validSessions = [];
					for (const id of rawIds) {
						claimed.add(id);
						if (archived.has(id)) continue;
						const s = byId[id];
						if (!s || s.blank) continue;
						validSessions.push(s);
					}
					validSessions.sort((a, b) => (Date.parse(String(b.updatedAt || 0)) || 0) - (Date.parse(String(a.updatedAt || 0)) || 0));
					return {
						id: ws.workspaceId,
						title: ws.title || (ws.path ? ws.path.split("/").pop() || "工作区" : "工作区"),
						path: ws.path || "",
						sessions: validSessions,
						running: validSessions.some((s) => Boolean(s.running))
					};
				});
				const ungroupedSessions = [];
				for (const id of allIds) {
					if (claimed.has(id) || archived.has(id)) continue;
					const s = byId[id];
					if (!s || s.blank) continue;
					ungroupedSessions.push(s);
				}
				ungroupedSessions.sort((a, b) => (Date.parse(String(b.updatedAt || 0)) || 0) - (Date.parse(String(a.updatedAt || 0)) || 0));
				if (ungroupedSessions.length > 0 || groups.length === 0) groups.push({
					id: UNGROUPED_ID,
					title: "未分组",
					path: "",
					sessions: ungroupedSessions,
					running: ungroupedSessions.some((s) => Boolean(s.running))
				});
				return groups;
			};
			const openSessionById = (sessionId) => {
				if (!sessionId) return;
				const { uiWorkspace, layout } = getServices();
				try {
					layout?.selectPanel?.(null);
				} catch {}
				try {
					uiWorkspace?.openSession?.(sessionId);
				} catch {}
				closeDropdown();
			};
			const startNewSessionInWorkspace = (wsId) => {
				const { uiWorkspace, layout } = getServices();
				try {
					layout?.selectPanel?.(null);
				} catch {}
				try {
					if (!wsId || wsId === UNGROUPED_ID) uiWorkspace?.startSession?.();
					else uiWorkspace?.startSession?.(wsId);
				} catch {}
				closeDropdown();
			};
			const createAnchoredDropdown = (anchorEl, anchorId, alignRight = false) => {
				if (activeDropdown && activeDropdown.dataset.anchorId === anchorId) {
					closeDropdown();
					return null;
				}
				closeDropdown();
				const rect = anchorEl.getBoundingClientRect();
				const dd = document.createElement("div");
				dd.className = cls("dropdown");
				dd.dataset.skinChrome = "dropdown";
				dd.dataset.anchorId = anchorId;
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
				hTitle.textContent = ` ${group.title} (${group.sessions.length})`;
				const newBtn = makeIconButton("+ 新建对话", `在「${group.title}」新建对话`, { onClick: (e) => {
					e.stopPropagation();
					startNewSessionInWorkspace(group.id);
				} });
				header.append(hTitle, newBtn);
				dd.append(header);
				const searchInput = document.createElement("input");
				searchInput.type = "search";
				searchInput.className = cls("ddSearch");
				searchInput.placeholder = "筛选此工作目录或全部会话...";
				dd.append(searchInput);
				const listWrap = document.createElement("div");
				dd.append(listWrap);
				const renderItems = (q) => {
					listWrap.replaceChildren();
					const query = q.trim().toLowerCase();
					const pool = query ? allGroups.flatMap((g) => g.sessions.map((s) => ({
						s,
						gTitle: g.title
					}))) : group.sessions.map((s) => ({
						s,
						gTitle: null
					}));
					const filtered = query ? pool.filter(({ s, gTitle }) => cleanSessionTitle(s.displayTitle || s.title).toLowerCase().includes(query) || gTitle !== null && gTitle.toLowerCase().includes(query)) : pool;
					if (filtered.length === 0) {
						const empty = document.createElement("div");
						empty.className = cls("ddEmpty");
						empty.textContent = "暂无匹配的对话";
						listWrap.append(empty);
						return;
					}
					for (const { s, gTitle } of filtered) {
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
						const clean = cleanSessionTitle(s.displayTitle || s.title);
						tSpan.textContent = gTitle ? `[${gTitle}] ${clean}` : clean;
						tSpan.title = s.displayTitle || s.title || clean;
						const meta = document.createElement("span");
						meta.className = cls("ddItemMeta");
						meta.textContent = formatRelativeTime(s.updatedAt);
						item.append(dot, tSpan, meta);
						item.onclick = (e) => {
							e.stopPropagation();
							selectedWorkspaceId = group.id;
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
				setTimeout(() => searchInput.focus(), 0);
			};
			const openPanelsDropdown = (anchorEl, panelEntries, activePanelId, layout) => {
				if (panelEntries.length === 0) {
					clickDomSelector(".kB3qhq_moreAnchor button", "更多");
					return;
				}
				const dd = createAnchoredDropdown(anchorEl, "more:panels", true);
				if (!dd) return;
				const header = document.createElement("div");
				header.className = cls("ddHeader");
				const hTitle = document.createElement("span");
				hTitle.textContent = `全部全局面板 (${panelEntries.length})`;
				header.append(hTitle);
				dd.append(header);
				for (const p of panelEntries) {
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
						try {
							layout?.selectPanel?.(p.id === activePanelId ? null : p.id);
						} catch {
							clickDomSelector(".kB3qhq_panelList button", p.label);
						}
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
				const { workspaces, sessions, uiWorkspace, layout, slots } = getServices();
				const wsSnap = workspaces?.list?.getSnapshot?.();
				const sesSnap = sessions?.list?.getSnapshot?.();
				const activePanelId = (layout?.panelInfo?.getSnapshot?.())?.activePanelId ?? null;
				const activeSessionId = getActiveSessionId(sesSnap, uiWorkspace);
				const panelEntries = getPanelEntries(slots);
				if (activeSessionId && activeSessionId !== lastActiveSessionId) {
					lastActiveSessionId = activeSessionId;
					if (sessionHistory[historyIndex] !== activeSessionId) {
						sessionHistory.splice(historyIndex + 1);
						sessionHistory.push(activeSessionId);
						historyIndex = sessionHistory.length - 1;
					}
				}
				const groups = buildWorkspaceGroups(wsSnap, sesSnap);
				const groupWithActiveSession = groups.find((g) => g.sessions.some((s) => s.id === activeSessionId));
				if (!selectedWorkspaceId || !groups.some((g) => g.id === selectedWorkspaceId)) selectedWorkspaceId = groupWithActiveSession?.id ?? groups[0]?.id ?? UNGROUPED_ID;
				const currentGroup = groups.find((g) => g.id === selectedWorkspaceId) ?? groups[0] ?? {
					id: UNGROUPED_ID,
					title: "未分组",
					path: "",
					sessions: [],
					running: false
				};
				const activeSessionObj = sesSnap?.byId && activeSessionId ? sesSnap.byId[activeSessionId] : void 0;
				const activeSessionTitle = activeSessionObj ? cleanSessionTitle(activeSessionObj.displayTitle || activeSessionObj.title) : "未选择会话";
				const activeWsTitle = groupWithActiveSession?.title ?? currentGroup.title;
				updateWindowTitle(Boolean(activeSessionObj), activeWsTitle, activeSessionTitle);
				const visibleTabs = currentGroup.sessions.slice(0, MAX_VISIBLE_TABS);
				const canBack = historyIndex > 0;
				const canFwd = historyIndex >= 0 && historyIndex < sessionHistory.length - 1;
				const nextRenderKey = JSON.stringify({
					mode,
					activePanelId,
					activeSessionId,
					currentGroupId: currentGroup.id,
					canBack,
					canFwd,
					tabs: visibleTabs.map((s) => [
						s.id,
						s.running ? 1 : 0,
						s.displayTitle || s.title || ""
					]),
					groups: groups.map((g) => [
						g.id,
						g.title,
						g.sessions.length,
						g.running ? 1 : 0
					]),
					panels: panelEntries.map((p) => [p.id, p.label])
				});
				if (nextRenderKey === lastRenderKey) return;
				lastRenderKey = nextRenderKey;
				row1.replaceChildren();
				const navGroup = document.createElement("div");
				navGroup.className = cls("navGroup");
				markWindowRegion(navGroup, false);
				navGroup.append(makeIconButton("◧", "展开/收起左侧边栏 (⌘B)", { onClick: () => {
					if (layout?.toggleSidebar) layout.toggleSidebar();
					else clickDomSelector("[data-sidebar-toggle], [data-sidebar-opener]");
				} }), makeIconButton("←", "返回上一个会话", {
					disabled: !canBack,
					onClick: () => {
						if (historyIndex > 0) {
							historyIndex -= 1;
							const targetId = sessionHistory[historyIndex];
							lastActiveSessionId = targetId;
							openSessionById(targetId);
						}
					}
				}), makeIconButton("→", "前进到下一个会话", {
					disabled: !canFwd,
					onClick: () => {
						if (historyIndex < sessionHistory.length - 1) {
							historyIndex += 1;
							const targetId = sessionHistory[historyIndex];
							lastActiveSessionId = targetId;
							openSessionById(targetId);
						}
					}
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
					const fullTitle = cleanSessionTitle(s.displayTitle || s.title);
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
				const newTabBtn = makeIconButton("+", `在「${currentGroup.title}」新建对话`, { onClick: () => startNewSessionInWorkspace(currentGroup.id) });
				const allTabsBtn = makeIconButton(`▾ ${currentGroup.sessions.length}`, `查看「${currentGroup.title}」全部 ${currentGroup.sessions.length} 个对话`, { onClick: (e) => {
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
				classicPill.title = "点击快速切换工作区与对话";
				const wsSpan = document.createElement("span");
				wsSpan.className = cls("classicWs");
				wsSpan.textContent = activeWsTitle;
				const sepSpan = document.createElement("span");
				sepSpan.className = cls("classicSep");
				sepSpan.textContent = "/";
				const sesSpan = document.createElement("span");
				sesSpan.className = cls("classicSes");
				const activePanelObj = panelEntries.find((p) => p.id === activePanelId);
				sesSpan.textContent = activePanelObj ? activePanelObj.label : activePanelId === "plugins" ? "插件管理" : activePanelId === "schedules" ? "自动化任务" : activeSessionTitle;
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
				const togglePanel = (panelId, labelHint) => {
					try {
						layout?.selectPanel?.(activePanelId === panelId ? null : panelId);
					} catch {
						clickDomSelector(".kB3qhq_panelList button", labelHint);
					}
				};
				const moreBtn = makeIconButton("⊞ 更多", "更多全局面板", {
					active: activePanelId !== null && activePanelId !== "plugins" && activePanelId !== "schedules",
					onClick: (e) => {
						e.stopPropagation();
						openPanelsDropdown(moreBtn, panelEntries, activePanelId, layout);
					}
				});
				const modeBtn = makeIconButton(mode === "browser" ? "⌘ 经典顶栏" : "浏览器顶栏", mode === "browser" ? "一键切换回经典 Mac 紧凑顶栏模式" : "一键切换到 Chrome 风格工作目录+会话标签栏模式", {
					extraClass: cls("modeBtn"),
					onClick: () => setMode(mode === "browser" ? "classic" : "browser")
				});
				const divider = document.createElement("span");
				divider.className = cls("divider");
				extBar.append(makeIconButton("插件", "打开/关闭插件面板", {
					active: activePanelId === "plugins",
					onClick: () => togglePanel("plugins", "插件")
				}), makeIconButton("自动化", "打开/关闭自动化任务", {
					active: activePanelId === "schedules",
					onClick: () => togglePanel("schedules", "自动化")
				}), makeIconButton("用量", "打开全量 Token / 费用统计", { onClick: () => clickDomSelector("button.uh-side-entry, .kB3qhq_footerActions button", "用量") }), makeIconButton("Remote", "打开远程连接与控制 (ds-harness-remote)", { onClick: () => clickDomSelector(".kB3qhq_footerActions button", "R") }), moreBtn, makeIconButton("设置", "打开账号与系统设置 (⌘,)", { onClick: () => {
					if (!clickDomSelector(".kB3qhq_settingsArea button, .kB3qhq_footArea > button")) document.dispatchEvent(new KeyboardEvent("keydown", {
						key: ",",
						code: "Comma",
						metaKey: true,
						bubbles: true
					}));
				} }), divider, modeBtn);
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
					mainBtn.title = g.path ? `${g.title} (${g.path})\n点击切换工作目录` : `${g.title}\n点击切换工作目录`;
					const iconSpan = document.createElement("span");
					iconSpan.textContent = g.id === UNGROUPED_ID ? "Group" : "Folder";
					const nameSpan = document.createElement("span");
					nameSpan.textContent = g.title;
					const countSpan = document.createElement("span");
					countSpan.className = cls("wsCount");
					countSpan.textContent = String(g.sessions.length);
					mainBtn.append(iconSpan, nameSpan, countSpan);
					if (g.running) {
						const rDot = document.createElement("span");
						rDot.className = cls("dot");
						rDot.dataset.running = "true";
						mainBtn.append(rDot);
					}
					mainBtn.onclick = () => {
						selectedWorkspaceId = g.id;
						writeStorage(WS_STORAGE_KEY, selectedWorkspaceId);
						if (g.sessions.length > 0 && !g.sessions.some((s) => s.id === activeSessionId)) openSessionById(g.sessions[0].id);
						else render();
					};
					const caretBtn = document.createElement("button");
					caretBtn.type = "button";
					caretBtn.className = cls("wsCaret");
					caretBtn.title = `展开「${g.title}」的对话书签菜单`;
					caretBtn.textContent = "▾";
					caretBtn.onclick = (e) => {
						e.stopPropagation();
						selectedWorkspaceId = g.id;
						writeStorage(WS_STORAGE_KEY, selectedWorkspaceId);
						render();
						openSessionsDropdown(chip, g, groups, activeSessionId);
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
				const searchBtn = makeIconButton("搜索", "搜索全部工作目录与对话", { onClick: (e) => {
					e.stopPropagation();
					openSessionsDropdown(searchBtn, currentGroup, groups, activeSessionId);
				} });
				row2Right.append(searchBtn);
				row2.append(wsBar, row2Spacer, row2Right);
			};
			const unsubscribers = [];
			let bindAttempts = 0;
			let bindTimer = null;
			const bindStores = () => {
				while (unsubscribers.length > 0) try {
					unsubscribers.pop()?.();
				} catch {}
				const { workspaces, sessions, uiWorkspace, layout, slots } = getServices();
				let boundCore = 0;
				if (workspaces?.list?.subscribe) {
					unsubscribers.push(workspaces.list.subscribe(render));
					boundCore += 1;
				}
				if (sessions?.list?.subscribe) {
					unsubscribers.push(sessions.list.subscribe(render));
					boundCore += 1;
				}
				if (uiWorkspace?.selection?.subscribe) {
					unsubscribers.push(uiWorkspace.selection.subscribe(render));
					boundCore += 1;
				}
				if (layout?.panelInfo?.subscribe) {
					unsubscribers.push(layout.panelInfo.subscribe(render));
					boundCore += 1;
				}
				if (slots?.subscribe) unsubscribers.push(slots.subscribe("sidebar.panellist", render));
				render();
				return boundCore >= 4;
			};
			if (!bindStores()) bindTimer = setInterval(() => {
				bindAttempts += 1;
				if (bindStores() || bindAttempts >= 20) {
					if (bindTimer !== null) {
						clearInterval(bindTimer);
						bindTimer = null;
					}
				}
			}, 500);
			const onDocPointerDown = (e) => {
				if (activeDropdown && e.target instanceof Node && !activeDropdown.contains(e.target)) closeDropdown();
			};
			document.addEventListener("pointerdown", onDocPointerDown);
			ctx.effect(() => () => {
				if (bindTimer !== null) {
					clearInterval(bindTimer);
					bindTimer = null;
				}
				document.removeEventListener("pointerdown", onDocPointerDown);
				while (unsubscribers.length > 0) try {
					unsubscribers.pop()?.();
				} catch {}
				closeDropdown();
				body.removeAttribute("data-dsh-workspace-tabs");
				body.removeAttribute("data-workspace-tabs-mode");
				titlebar.remove();
				if (lastSkinTitle !== null && document.title === lastSkinTitle) document.title = originalTitle;
			}, "ui-skin-workspace-tabs: Workspace Tabs chrome");
		}
		//#endregion
		exports.apply = apply;
		exports.cleanSessionTitle = cleanSessionTitle;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map