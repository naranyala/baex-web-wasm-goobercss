import './index.css';
import { framework } from './framework/Core';
import { MENU_ITEMS, fuzzySearch, MenuItem } from './framework/Menu';
import { CODE_EXAMPLES, CodeExample } from './framework/Examples';
import { hostApi } from './framework/HostAPI';

async function initApp() {
  try {
    await framework.registerModule('math', '/wasm/math.wasm');
    await framework.registerModule('logic', '/wasm/logic.wasm');
    await framework.registerModule('utils', '/wasm/utils.wasm');
    await framework.registerModule('browser_ext', '/wasm/browser_ext.wasm');
    
    framework.globalize('utils');

    const rootEl = document.querySelector('#root');
    if (!rootEl) return;

    const loadedModules = framework.getModuleNames();
    const extensions = hostApi.getExtensions();

    rootEl.innerHTML = `
    <div class="flex flex-col items-center gap-8 min-h-screen py-12 px-4 text-center">
      <h1 class="text-5xl font-bold tracking-tight text-white mb-4">WASM Console</h1>
      
      <!-- Loaded Modules Summary -->
      <div class="flex gap-2 flex-wrap justify-center mb-4">
        ${loadedModules.map(m => `<span class="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">${m}.wasm</span>`).join('')}
      </div>

      <!-- WASM Modules Section -->
      <details class="w-full max-w-6xl group" open>
        <summary class="list-none cursor-pointer bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-between text-left group-open:rounded-b-none">
          <span class="text-2xl font-semibold text-indigo-400">📦 WASM Modules</span>
          <span class="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div class="bg-slate-900 p-6 border-x border-b border-slate-700 rounded-b-2xl space-y-8">
          <div class="w-full max-w-2xl mx-auto">
            <input type="text" id="menu-search" 
                   class="w-full px-4 py-3 text-lg rounded-xl border border-slate-700 bg-slate-800 text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" 
                   placeholder="Search for WASM functions...">
          </div>
          <div id="menu-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
      </details>

      <!-- Browser API Extensions Section -->
      <details class="w-full max-w-6xl group">
        <summary class="list-none cursor-pointer bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-between text-left group-open:rounded-b-none">
          <span class="text-2xl font-semibold text-amber-400">🌐 Browser API Extensions</span>
          <span class="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div class="bg-slate-900 p-6 border-x border-b border-slate-700 rounded-b-2xl">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${extensions.map(ext => `
              <div class="p-4 rounded-xl bg-slate-800 border border-slate-700 text-left">
                <code class="text-amber-400 font-mono font-bold block mb-1">${ext.name}</code>
                <p class="text-sm text-slate-400">${ext.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </details>

      <!-- Code Examples Section -->
      <details class="w-full max-w-6xl group">
        <summary class="list-none cursor-pointer bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-between text-left group-open:rounded-b-none">
          <span class="text-2xl font-semibold text-emerald-400">💻 Code Examples</span>
          <span class="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div class="bg-slate-900 p-6 border-x border-b border-slate-700 rounded-b-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          ${CODE_EXAMPLES.map(ex => `
            <div class="flex flex-col text-left bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h3 class="text-lg font-medium text-emerald-400 mb-1">${ex.title}</h3>
              <p class="text-sm text-slate-400 mb-3">${ex.description}</p>
              <pre class="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-300 border border-slate-800"><code>${escapeHtml(ex.code)}</code></pre>
            </div>
          `).join('')}
        </div>
      </details>
    </div>
  `;

    const searchInput = document.querySelector('#menu-search') as HTMLInputElement;
    const menuGrid = document.querySelector('#menu-grid') as HTMLDivElement;

    function escapeHtml(unsafe: string) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function showResult(text: string) {
      const overlay = document.createElement('div');
      overlay.className = 'result-overlay';
      overlay.innerText = text;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 3000);
    }

    function renderMenu(items: MenuItem[]) {
      menuGrid.innerHTML = '';
      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'bg-slate-800 border border-slate-700 p-6 rounded-2xl cursor-pointer transition-all hover:bg-slate-700 hover:border-indigo-500 hover:-translate-y-1 text-left flex flex-col gap-2';
        el.innerHTML = `
          <h3 class="text-xl font-semibold text-indigo-400">${item.label}</h3>
          <p class="text-sm text-slate-400">${item.description}</p>
        `;
        el.onclick = () => {
          const res = framework.call(item.module, item.function, ...item.args);
          showResult(`Result: ${res}`);
        };
        menuGrid.appendChild(el);
      });
    }

    searchInput.oninput = (e) => {
      const query = (e.target as HTMLInputElement).value;
      const filtered = fuzzySearch(query, MENU_ITEMS);
      renderMenu(filtered);
    };

    renderMenu(MENU_ITEMS);
  } catch (err) {
    console.error('App initialization error:', err);
    const rootEl = document.querySelector('#root');
    if (rootEl) {
      rootEl.innerHTML = `<p class="text-red-500">Error initializing WASM framework: ${err.message}</p>`;
    }
  }
}

initApp();


