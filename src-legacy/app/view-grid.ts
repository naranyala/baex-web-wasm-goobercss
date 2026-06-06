import { MENU_ITEMS } from './constants';
import { fuzzySearch } from './utils';

export function renderTabBar(tabs: Map<string, any>, activeTabId: string | null) {
  const tabBar = document.querySelector('tab-bar') as any;
  if (tabBar) {
    tabBar.setAttribute('tabs', JSON.stringify(Array.from(tabs.entries()).map(([id, { label }]) => ({ id, label }))));
    if (activeTabId) tabBar.setActive(activeTabId);
  }
}

export function renderGridMenu(items: typeof MENU_ITEMS) {
  const grid = document.querySelector<HTMLDivElement>('#menu-grid');
  if (!grid) return;
  grid.innerHTML = items.map(item => `
    <div class="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors" onclick="window.dispatchMenuAction('${item.id}')">
      <div class="text-xl">${item.icon}</div>
      <div class="text-sm font-medium text-zinc-300">${item.label}</div>
    </div>
  `).join('');
}

export function initApp() {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) {
      console.error('Element #app not found');
      return;
  }
  
  app.innerHTML = `
    <div class="flex h-screen bg-zinc-900 text-zinc-100">
      <!-- Sidebar -->
      <div class="w-64 border-r border-zinc-700 flex flex-col bg-zinc-800">
        <div class="p-6 text-xl font-bold border-b border-zinc-700">BAEX Menu</div>
        <input 
            type="text" 
            id="menu-search" 
            class="m-4 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 focus:border-indigo-500 outline-none text-sm" 
            placeholder="Search..." 
        />
        <div id="menu-grid" class="flex-1 overflow-y-auto p-4 flex flex-col gap-2"></div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <tab-bar id="main-tab-bar" class="h-12 border-b border-zinc-700"></tab-bar>
        <div class="flex-1 p-8 overflow-y-auto">
            <div id="view-container">
                <h1 class="text-2xl font-bold mb-4">Select an item</h1>
            </div>
            <div id="execution-log" class="text-sm font-mono text-indigo-400"></div>
        </div>
      </div>
    </div>
    
    <status-bar id="app-status-bar"></status-bar>
  `;
  
  const searchInput = document.querySelector<HTMLInputElement>('#menu-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      const filtered = fuzzySearch(query, MENU_ITEMS);
      renderGridMenu(filtered);
    });
  }

  renderGridMenu(MENU_ITEMS);
}
