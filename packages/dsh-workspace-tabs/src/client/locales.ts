/** Locale namespace and Chinese source dictionary for Workspace Tabs. */
export const NS = 'workspace-tabs'

export const zh = {
  'workspace.default': '工作区',
  'workspace.ungrouped': '未分组',
  'workspace.switch': '切换工作区：{workspace}',
  'workspace.sessions': '展开「{workspace}」的对话',
  'session.new': '新建对话',
  'session.newInWorkspace': '在「{workspace}」新建对话',
  'session.none': '未选择对话',
  'session.back': '返回上一个对话',
  'session.forward': '前进到下一个对话',
  'session.all': '查看「{workspace}」的全部对话（{count}）',
  'session.filter': '筛选工作区和对话…',
  'session.noMatches': '没有匹配的对话',
  'session.justNow': '刚刚',
  'chrome.sidebar': '展开或收起侧栏',
  'chrome.switchSession': '切换工作区和对话',
  'chrome.classic': '经典顶栏',
  'chrome.classicHint': '切换到紧凑的经典顶栏',
  'chrome.browser': '浏览器顶栏',
  'chrome.browserHint': '切换到双行工作区和对话标签栏',
  'chrome.search': '搜索',
  'chrome.searchHint': '搜索全部工作区和对话',
  'panel.plugins': '插件',
  'panel.pluginsHint': '打开或关闭插件面板',
  'panel.schedules': '自动化',
  'panel.schedulesHint': '打开或关闭自动化任务',
  'panel.more': '更多',
  'panel.moreHint': '显示全局面板',
  'panel.all': '全局面板（{count}）',
  'panel.usage': '用量',
  'panel.usageHint': '打开用量统计',
  'panel.remote': '远程',
  'panel.remoteHint': '打开远程连接',
  'panel.settings': '设置',
  'panel.settingsHint': '打开账号和系统设置',
} as const

export type WorkspaceTabsKey = keyof typeof zh

/** Complete English mirror of the Chinese keys. */
export const en: Record<WorkspaceTabsKey, string> = {
  'workspace.default': 'Workspace',
  'workspace.ungrouped': 'Ungrouped',
  'workspace.switch': 'Switch workspace: {workspace}',
  'workspace.sessions': 'Show conversations in {workspace}',
  'session.new': 'New conversation',
  'session.newInWorkspace': 'New conversation in {workspace}',
  'session.none': 'No conversation selected',
  'session.back': 'Back to previous conversation',
  'session.forward': 'Forward to next conversation',
  'session.all': 'Show all conversations in {workspace} ({count})',
  'session.filter': 'Filter workspaces and conversations…',
  'session.noMatches': 'No matching conversations',
  'session.justNow': 'Just now',
  'chrome.sidebar': 'Toggle sidebar',
  'chrome.switchSession': 'Switch workspace and conversation',
  'chrome.classic': 'Classic bar',
  'chrome.classicHint': 'Switch to the compact classic bar',
  'chrome.browser': 'Browser bar',
  'chrome.browserHint': 'Switch to the two-row workspace and conversation tabs',
  'chrome.search': 'Search',
  'chrome.searchHint': 'Search all workspaces and conversations',
  'panel.plugins': 'Plugins',
  'panel.pluginsHint': 'Toggle the plugins panel',
  'panel.schedules': 'Schedules',
  'panel.schedulesHint': 'Toggle scheduled tasks',
  'panel.more': 'More',
  'panel.moreHint': 'Show global panels',
  'panel.all': 'Global panels ({count})',
  'panel.usage': 'Usage',
  'panel.usageHint': 'Open usage statistics',
  'panel.remote': 'Remote',
  'panel.remoteHint': 'Open remote access',
  'panel.settings': 'Settings',
  'panel.settingsHint': 'Open account and system settings',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    [NS]: WorkspaceTabsKey
  }
}
