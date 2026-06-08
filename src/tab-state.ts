export const tabs = new Map<string, { label: string; action: () => void }>();
export const state = {
  activeTabId: null as string | null,
};

export const STORAGE_KEY = 'baex-tabs';

export function saveTabState() {
  const data = {
    tabs: Array.from(tabs.entries()).map(([id, { label }]) => ({ id, label })),
    activeTabId: state.activeTabId,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save tab state:', e);
  }
}

export function restoreTabState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved?.tabs?.length) return null;
    return saved;
  } catch (e) {
    console.error('Failed to restore tab state:', e);
    return null;
  }
}

export function renderTabBar() {
  saveTabState();
  const tabBar = document.querySelector('tab-bar') as HTMLElement;
  if (tabBar) {
    const tabList = Array.from(tabs.entries()).map(([id, { label }]) => ({ id, label }));
    tabBar.setAttribute('tabs', JSON.stringify(tabList));
    (tabBar as any).setActive(state.activeTabId);
    tabBar.style.display = tabList.length > 0 ? 'flex' : 'none';
  }
}
