import './style.css'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './components/tab-bar.js'
import './components/accordion-demo.js'
import './components/treeview-demo.js'
import { css, setup } from 'goober';
import { WasmBridge } from './framework/WasmBridge.js';
import { defineComponent } from './framework/Component.js';
import init from '../public/wasm/wasm_logic.js';

setup(null);

defineComponent({
  name: 'table-view',
  initialState: {
    tableName: '',
    data: [] as any[],
    loading: false,
    error: '' as string | null,
    editingRowId: null as number | null,
    formValues: {} as any,
  },
  render: (state, { setState }) => {
    if (state.loading) return `<div style="text-align: center; padding: 2rem; color: var(--zinc-400);">Loading <strong>${state.tableName}</strong>...</div>`;
    if (state.error) return `<div style="color: var(--red-500); padding: 1.5rem; background: rgba(239,68,68,0.1); border-radius: var(--radius-lg);">${state.error}</div>`;
    if (state.data.length === 0) return `<div style="padding: 2rem; text-align: center; color: var(--zinc-400);">Table <strong>${state.tableName}</strong> is empty.</div>`;

    const columns = Object.keys(state.data[0]).filter(c => c !== 'rowid');

    const tableHtml = `
      <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="background: var(--zinc-800); text-align: left;">
              ${columns.map(col => `<th style="padding: 0.75rem; border: 1px solid var(--zinc-700); color: var(--zinc-400); font-weight: 500; white-space: nowrap;">${col}</th>`).join('')}
              <th style="padding: 0.75rem; border: 1px solid var(--zinc-700); color: var(--zinc-400); text-align: center; width: 120px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.data.map(row => `
              <tr style="${state.editingRowId === row.rowid ? 'background: rgba(99, 102, 241, 0.08);' : ''} transition: background var(--transition);">
                ${columns.map(col => `<td style="padding: 0.75rem; border: 1px solid var(--zinc-700); color: var(--zinc-300);">${row[col]}</td>`).join('')}
                <td style="padding: 0.75rem; border: 1px solid var(--zinc-700); text-align: center; white-space: nowrap;">
                  <button class="${crudButton}" onclick="window.handleEditRow('${state.tableName}', ${row.rowid})">Edit</button>
                  <button class="${crudButton}" style="color: var(--red-500);" onclick="window.handleDeleteRow('${state.tableName}', ${row.rowid})">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const formHtml = `
      <div class="${formPanel}">
        <h3 style="margin: 0 0 0.5rem; font-size: 1rem; color: var(--zinc-100);">Edit Row #${state.editingRowId}</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${columns.map(col => `
            <div class="${formField}">
              <label>${col}</label>
              <input type="text" value="${state.formValues[col] || ''}"
                oninput="window.handleFormInput('${col}', this.value)" />
            </div>
          `).join('')}
        </div>
        <div class="${formActions}">
          <button class="${addButton}" style="margin: 0; flex: 1;" onclick="window.handleFormSubmit('${state.tableName}', ${state.editingRowId})">Save</button>
          <button class="${crudButton}" style="flex: 1;" onclick="window.handleCancelEdit()">Cancel</button>
        </div>
      </div>
    `;

    return `
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">${state.tableName}</h2>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="color: var(--zinc-400); font-size: 0.875rem;">${state.data.length} rows</span>
          <button class="${addButton}" style="margin: 0;" onclick="window.handleAddRow('${state.tableName}', ${JSON.stringify(columns)})">+ Add Row</button>
        </div>
      </div>
      <div class="${splitPanel}">
        <div class="${tableContainer}">
          ${tableHtml}
        </div>
        ${state.editingRowId ? formHtml : ''}
      </div>
    `;
  }
});

const navBar = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  background: rgba(24, 24, 27, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--zinc-700);
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  gap: 0.5rem;
  z-index: 100;
`;

const homeButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: var(--zinc-800);
  border: 1px solid var(--zinc-700);
  color: var(--zinc-100);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  white-space: nowrap;
  transition: all var(--transition);
  &:hover { background: var(--zinc-700); border-color: var(--zinc-600); }
  &:active { transform: scale(0.97); }
`;

const appContainer = css`
  min-height: 100vh;
  background: var(--zinc-900);
  color: var(--zinc-100);
  padding-top: 4.5rem;
  padding-bottom: 2.5rem;
`;

const contentWrapper = css`
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.5rem;
  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const searchInput = css`
  width: 100%;
  max-width: 28rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 0.9375rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--zinc-700);
  background: var(--zinc-800);
  color: var(--zinc-100);
  outline: none;
  transition: all var(--transition);
  &::placeholder { color: var(--zinc-400); }
  &:focus {
    border-color: var(--indigo-500);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const sectionContainer = css`
  border: 1px solid var(--zinc-700);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: rgba(39, 39, 42, 0.4);
  box-shadow: var(--shadow-lg);
`;

const menuGrid = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.25rem;
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0.75rem;
  }
`;

const menuItem = css`
  aspect-ratio: 1;
  padding: 1rem;
  background: var(--zinc-800);
  border: 1px solid var(--zinc-700);
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  &:hover {
    background: var(--zinc-700);
    border-color: var(--indigo-500);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  }
  &:active { transform: scale(0.97); }
  div:first-child { font-size: 1.75rem; }
`;

const statusBar = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rem;
  background: rgba(24, 24, 27, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid var(--zinc-700);
  color: var(--zinc-400);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  z-index: 100;
  font-family: 'SF Mono', 'Fira Code', monospace;
  cursor: pointer;
  transition: background var(--transition);
  &:hover { background: rgba(39, 39, 42, 0.95); }
  @media (max-width: 640px) {
    font-size: 0.625rem;
    height: 1.75rem;
  }
`;

const modalBackdrop = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 1rem;
`;

const modalContent = css`
  background: var(--zinc-900);
  border: 1px solid var(--zinc-700);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 44rem;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: var(--zinc-100);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  @media (max-width: 640px) {
    max-height: 90vh;
    border-radius: var(--radius-lg);
    padding: 1rem;
  }
`;

const modalSearch = css`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: var(--zinc-800);
  border: 1px solid var(--zinc-700);
  border-radius: var(--radius-md);
  color: var(--zinc-100);
  outline: none;
  font-size: 0.9375rem;
  &:focus { border-color: var(--indigo-500); }
`;

const modalList = css`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const crudButton = css`
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  border: 1px solid var(--zinc-700);
  background: var(--zinc-800);
  color: var(--zinc-400);
  transition: all var(--transition);
  &:hover { background: var(--zinc-700); color: var(--zinc-100); }
`;

const addButton = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  border: 1px solid var(--indigo-500);
  background: var(--indigo-500);
  color: white;
  font-weight: 500;
  transition: all var(--transition);
  &:hover { background: var(--indigo-600); border-color: var(--indigo-600); }
  &:active { transform: scale(0.97); }
`;

const splitPanel = css`
  display: flex;
  gap: 1rem;
  min-height: 0;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const tableContainer = css`
  flex: 1;
  min-width: 0;
  overflow: auto;
  border: 1px solid var(--zinc-700);
  border-radius: var(--radius-lg);
  background: var(--zinc-900);
`;

const formPanel = css`
  width: 22rem;
  flex-shrink: 0;
  padding: 1.25rem;
  background: var(--zinc-800);
  border: 1px solid var(--zinc-700);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 70vh;
  @media (max-width: 768px) {
    width: 100%;
    max-height: none;
  }
`;

const formField = css`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  label { font-size: 0.75rem; color: var(--zinc-400); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  input {
    padding: 0.5rem 0.625rem;
    background: var(--zinc-900);
    border: 1px solid var(--zinc-700);
    color: var(--zinc-100);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    outline: none;
    transition: border-color var(--transition);
    &:focus { border-color: var(--indigo-500); }
  }
`;

const formActions = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const tabs = new Map();
let activeTabId: string | null = null;

async function fetchTables() {
  console.log('Mocking fetchTables...');
  return ['users', 'posts'];
}

async function renderTableContent(tableName: string) {
  const view = document.getElementById('dynamic-view');
  if (!view) return;

  view.style.display = 'block';

  const tableEl = document.createElement('table-view');

  const state = (tableEl as any).state;
  state.tableName = tableName;
  state.loading = true;

  view.innerHTML = '';
  view.appendChild(tableEl);

  try {
    console.log(`Mocking data fetch for ${tableName}`);
    state.data = [{rowid: 1, name: 'Sample Item 1'}, {rowid: 2, name: 'Sample Item 2'}];
    state.loading = false;
  } catch (e: any) {
    state.error = e.message || e;
    state.loading = false;
  }
}

export function fuzzySearch(query: string, items: any[]) {
  const q = query.toLowerCase().split('').filter(c => c !== ' ');
  return items.filter(item => {
    const label = item.label.toLowerCase();
    let i = 0;
    for (const char of q) {
      i = label.indexOf(char, i);
      if (i === -1) return false;
      i++;
    }
    return true;
  });
}

const devToolsStyles = {
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--zinc-700);
    margin-bottom: 1rem;
    h3 { margin: 0; color: var(--indigo-500); font-family: 'SF Mono', 'Fira Code', monospace; font-size: 1rem; }
  `,
  layerSection: css`
    margin-bottom: 1rem;
    padding: 0.875rem;
    background: var(--zinc-800);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--indigo-500);
    h4 { margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--zinc-400); text-transform: uppercase; letter-spacing: 0.05em; }
    .layer-content { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.75rem; color: var(--zinc-300); line-height: 1.5; }
    .tag {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.65rem;
      margin-right: 4px;
      background: var(--zinc-700);
    }
    .tag-wasm { color: #facc15; }
    .tag-rust { color: #f97316; }
    .tag-native { color: #22c55e; }
  `,
  layerDetail: css`
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    border-bottom: 1px solid rgba(63, 63, 70, 0.2);
    &:last-child { border-bottom: none; }
    .label { color: var(--zinc-400); }
    .value { color: var(--zinc-100); }
  `
};

function showBaexDevTools() {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const backdrop = document.createElement('div');
  backdrop.className = modalBackdrop;
  backdrop.id = 'devtools-backdrop';

  const content = document.createElement('div');
  content.className = modalContent;

  const irData = {
    jsLayer: {
      framework: 'BAEX-SPA v1.0',
      reactivity: 'Proxy-based Deep State',
      rendering: 'Declarative Template String',
      bridge: 'IPC-Invoke / Wasm-Bridge'
    },
    wasmLayer: {
      module: 'wasm_rust.wasm',
      target: 'web',
      primitives: Object.keys(WasmBridge).reduce((acc, cat) => acc + Object.keys((WasmBridge as any)[cat]).length, 0),
      exportType: 'ESM'
    },
    rustLayer: {
      compiler: 'rustc 1.75+',
      optimizations: 'release (LTO enabled)',
      memory: 'Linear Wasm Memory',
      core_crates: ['napi', 'rusqlite', 'serde']
    },
    nativeLayer: {
      ffi: 'napi-rs / Node-API',
      db_engine: 'SQLite 3.x (Bundled)',
      storage: 'app.db (userData)',
      binary: 'index.node'
    }
  };

  const createLayerHtml = (title: string, data: any, tagClass: string) => `
    <div class="${devToolsStyles.layerSection}">
      <h4>${title}</h4>
      <div class="layer-content">
        <span class="tag ${tagClass}">L${title.split(' ')[0]}</span>
        ${Object.entries(data).map(([k, v]) => `
          <div class="${devToolsStyles.layerDetail}">
            <span class="label">${k}:</span>
            <span class="value">${v}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const createApiHtml = () => {
    const categories = Object.entries(WasmBridge);
    return categories.map(([catName, methods]) => `
      <div class="${devToolsStyles.layerSection}" style="border-left-color: #a855f7;">
        <h4>API: ${catName.toUpperCase()}</h4>
        <div class="layer-content">
          ${Object.entries(methods).map(([methodName, methodFn]) => {
            const fnStr = methodFn.toString();
            const argsMatch = fnStr.match(/\\((.*?)\\)/);
            const args = argsMatch ? argsMatch[1] : '';
            return `
              <div class="${devToolsStyles.layerDetail}">
                <span class="label" style="color: #a855f7; font-weight: bold;">${methodName}(${args})</span>
                <span class="value" style="font-size: 0.65rem; opacity: 0.6;">async Promise&lt;any&gt;</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  };

  content.innerHTML = `
    <div class="${devToolsStyles.header}">
      <h3>BAEX IR Inspector</h3>
      <button id="close-devtools" style="background: none; border: none; color: var(--zinc-400); cursor: pointer; font-size: 1.5rem; padding: 0.25rem; line-height: 1;">&times;</button>
    </div>
    <div style="overflow-y: auto;">
      <div style="margin-bottom: 1.5rem;">
        ${createLayerHtml('JavaScript Layer', irData.jsLayer, 'tag-wasm')}
        ${createLayerHtml('Wasm Bridge', irData.wasmLayer, 'tag-wasm')}
        ${createLayerHtml('Rust Core', irData.rustLayer, 'tag-rust')}
        ${createLayerHtml('Native FFI', irData.nativeLayer, 'tag-native')}
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 0.8rem; color: var(--zinc-400); margin-bottom: 0.75rem; font-family: 'SF Mono', 'Fira Code', monospace;">BRIDGE API</h3>
        ${createApiHtml()}
      </div>

      <div class="${devToolsStyles.layerSection}" style="border-left-color: var(--red-500);">
        <h4>Pipeline Trace</h4>
        <div class="layer-content" style="text-align: center; font-size: 0.7rem; color: var(--zinc-400);">
          JS → IPC → Native-Rust → SQLite → FileSystem
        </div>
      </div>
    </div>
  `;

  backdrop.appendChild(content);
  app.appendChild(backdrop);

  content.querySelector('#close-devtools')?.addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
}

function renderTabBar() {
  const tabBar = document.querySelector('tab-bar') as HTMLElement;
  if (tabBar) {
    const tabList = Array.from(tabs.entries()).map(([id, { label }]) => ({ id, label }));
    tabBar.setAttribute('tabs', JSON.stringify(tabList));
    (tabBar as any).setActive(activeTabId);
    tabBar.style.display = tabList.length > 0 ? 'flex' : 'none';
  }
}

async function handleAddRow(tableName: string, columns: string[]) {
  const values = columns.map(col => prompt(`Value for ${col}:`) || '');
  console.log('Mocking INSERT action:', tableName, columns, values);
  await renderTableContent(tableName);
}

async function handleDeleteRow(tableName: string, id: any) {
  if (!confirm(`Delete row with ID ${id}?`)) return;
  console.log('Mocking DELETE action:', tableName, id);
  await renderTableContent(tableName);
}

async function handleUpdateRow(tableName: string, id: any, columns: string[]) {
  const updates = columns.map(col => {
    const val = prompt(`New value for ${col}:`);
    return val !== null ? `${col} = '${val.replace(/'/g, "''")}'` : null;
  }).filter(Boolean);

  if (updates.length === 0) return;

  console.log('Mocking UPDATE action:', tableName, id, updates);
  await renderTableContent(tableName);
}

(window as any).handleAddRow = handleAddRow;
(window as any).handleDeleteRow = handleDeleteRow;
(window as any).handleUpdateRow = handleUpdateRow;

async function initApp() {
  console.log('initApp called');
  const app = document.getElementById('app');
  if (!app) {
    console.error('Element #app not found. Body innerHTML:', document.body.innerHTML);
    return;
  }
  console.log('Populating #app');

  const primitiveCount = Object.values(WasmBridge).reduce((acc, cat) => acc + Object.keys(cat).length, 0);
  const regularCount = 3;
  const dirName = __DIRNAME__;
  document.title = dirName;


  const searchWrapper = css`
    position: relative;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    &::before {
      content: '🔍';
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.875rem;
      pointer-events: none;
      opacity: 0.5;
    }
  `;

  const homeHeader = css`
    text-align: center;
    margin-bottom: 1.5rem;
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
      background: linear-gradient(135deg, var(--zinc-100), var(--indigo-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    p {
      margin: 0;
      color: var(--zinc-400);
      font-size: 0.875rem;
    }
    @media (max-width: 640px) {
      h1 { font-size: 1.25rem; }
    }
  `;

  const sectionHeading = css`
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--zinc-400);
    margin: 1.5rem 0 0.5rem;
  `;

  app.innerHTML =
    '<div class="' + navBar + '">' +
      '<button class="' + homeButton + '" id="home-btn">' +
        '<span style="font-size: 1.125rem;">&#9670;</span> BAEX' +
      '</button>' +
      '<tab-bar id="main-tab-bar" style="flex: 1; min-width: 0;"></tab-bar>' +
    '</div>' +
    '<div class="' + appContainer + '"><div class="' + contentWrapper + '">' +
        '<div id="home-view">' +
           '<div class="' + homeHeader + '">' +
             '<h1>Database Explorer</h1>' +
             '<p>Browse and manage your SQLite tables</p>' +
           '</div>' +
           '<div class="' + searchWrapper + '"><input type="text" id="menu-search" class="' + searchInput + '" placeholder="Search tables..." /></div>' +
           '<div class="' + sectionContainer + '"><div id="menu-grid" class="' + menuGrid + '"></div></div>' +
            '<div class="' + sectionHeading + '">Components</div>' +
            '<div class="' + sectionContainer + '"><div id="demo-grid" class="' + menuGrid + '"></div></div>' +
            '<div class="' + sectionHeading + '">RAG System</div>' +
            '<div class="' + sectionContainer + '"><div id="rag-grid" class="' + menuGrid + '"></div></div>' +
         '</div>' +
        '<div id="dynamic-view" style="display: none;"></div>' +
    '</div></div>' +
    '<div class="' + statusBar + '" id="status-bar" style="display: flex; justify-content: space-between; align-items: center;">' +
      '<span style="display: flex; align-items: center; gap: 0.5rem;">' +
        dirName +
      '</span>' +
      '<span style="display: flex; align-items: center; gap: 0.5rem;">' +
        '<span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #22c55e;"></span>' +
        'WASM: ' + primitiveCount + ' primitives' +
        '<span style="opacity: 0.3;">|</span>' +
        'JS: ' + regularCount + ' fns' +
      '</span>' +
    '</div>';
  console.log('App HTML populated');

  document.getElementById('status-bar')?.addEventListener('click', showBaexDevTools);

  document.getElementById('home-btn')?.addEventListener('click', () => {
    activeTabId = null;
    tabs.clear();
    (document.getElementById('home-view') as HTMLElement).style.display = 'block';
    (document.getElementById('dynamic-view') as HTMLElement).style.display = 'none';
    renderTabBar();
  });

  const tabBar = document.getElementById('main-tab-bar');
  tabBar?.addEventListener('tab-selected', (e: any) => {
    activeTabId = e.detail;
    const homeView = document.getElementById('home-view') as HTMLElement;
    const dynamicView = document.getElementById('dynamic-view') as HTMLElement;
    if (homeView) homeView.style.display = 'none';
    if (dynamicView) dynamicView.style.display = 'block';

    const tab = tabs.get(activeTabId);
    if (tab) tab.action();
    renderTabBar();
  });

  const menuGridEl = document.getElementById('menu-grid');

  try {
    const leafletEl = document.createElement('div');
    leafletEl.className = menuItem;
    leafletEl.innerHTML = '<div>🗺️</div><div>Leaflet Map</div>';
    leafletEl.onclick = () => {
        const tabId = `leaflet-map`;
        tabs.set(tabId, {
          label: 'Leaflet Map',
          action: () => {
              const view = document.getElementById('dynamic-view');
              if (!view) return;
              view.style.display = 'block';
              view.innerHTML = '<div id="map" style="height: 500px; border-radius: var(--radius-lg); overflow: hidden;"></div>';
              const map = L.map('map').setView([51.505, -0.09], 13);
              L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);
          }
        });
        activeTabId = tabId;
        (document.getElementById('home-view') as HTMLElement).style.display = 'none';
        tabs.get(tabId).action();
        renderTabBar();
    };
    menuGridEl?.appendChild(leafletEl);

    const tables: string[] = await fetchTables();

    if (tables.length === 0) {
      menuGridEl!.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--zinc-400);">No tables found. Run some SQL to create them!</div>';
    } else {
      tables.forEach((tableName: string) => {
        const el = document.createElement('div');
        el.className = menuItem;
        el.innerHTML = '<div>📦</div><div>' + tableName + '</div>';
        el.onclick = () => {
          const tabId = `table-${tableName}`;
          tabs.set(tabId, {
            label: tableName,
            action: () => renderTableContent(tableName)
          });
          activeTabId = tabId;
          (document.getElementById('home-view') as HTMLElement).style.display = 'none';
          renderTableContent(tableName);
          renderTabBar();
        };
        menuGridEl?.appendChild(el);
      });
    }
  } catch (error: any) {
    menuGridEl!.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--red-500); background: rgba(239, 68, 68, 0.1); border: 1px solid var(--red-500); border-radius: var(--radius-lg);">
      <strong>Database Error:</strong><br/>${error.message || error}
    </div>`;
  }

  const demoGridEl = document.getElementById('demo-grid');

  const addDemoItem = (icon: string, label: string, tabId: string, action: () => void) => {
    const el = document.createElement('div');
    el.className = menuItem;
    el.innerHTML = '<div>' + icon + '</div><div>' + label + '</div>';
    el.onclick = () => {
      tabs.set(tabId, { label, action });
      activeTabId = tabId;
      (document.getElementById('home-view') as HTMLElement).style.display = 'none';
      action();
      renderTabBar();
    };
    demoGridEl?.appendChild(el);
  };

  addDemoItem('🔰', 'Accordion Demo', 'accordion-demo', () => {
    const view = document.getElementById('dynamic-view');
    if (!view) return;
    view.style.display = 'block';
    view.innerHTML = '<accordion-demo></accordion-demo>';
  });

  addDemoItem('🌳', 'Treeview Demo', 'treeview-demo', () => {
    const view = document.getElementById('dynamic-view');
    if (!view) return;
    view.style.display = 'block';
    view.innerHTML = '<treeview-demo></treeview-demo>';
  });

  const ragGridEl = document.getElementById('rag-grid');

  const addRagItem = (icon: string, label: string, tabId: string, action: () => void) => {
    const el = document.createElement('div');
    el.className = menuItem;
    el.innerHTML = '<div>' + icon + '</div><div>' + label + '</div>';
    el.onclick = () => {
      tabs.set(tabId, { label, action });
      activeTabId = tabId;
      (document.getElementById('home-view') as HTMLElement).style.display = 'none';
      action();
      renderTabBar();
    };
    ragGridEl?.appendChild(el);
  };

  const ragItems = [
    { icon: '📚', label: 'Knowledge Base', id: 'rag-kb' },
    { icon: '📦', label: 'Vector DB', id: 'rag-vector' },
    { icon: '✂️', label: 'Chunking', id: 'rag-chunk' },
    { icon: '🧠', label: 'Embeddings', id: 'rag-embed' },
    { icon: '✍️', label: 'Prompt Tuning', id: 'rag-prompt' },
    { icon: '🔍', label: 'Retrieval Tuning', id: 'rag-retrieve' },
    { icon: '💬', label: 'RAG Chat', id: 'rag-chat' },
    { icon: '📊', label: 'Eval & Benchmarks', id: 'rag-eval' },
  ];

  ragItems.forEach(item => {
    addRagItem(item.icon, item.label, item.id, () => {
      const view = document.getElementById('dynamic-view');
      if (!view) return;
      view.style.display = 'block';
      view.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--zinc-400);">
          <h2>${item.label}</h2>
          <p>The ${item.label} module is coming soon. This will be a dedicated RAG component.</p>
        </div>
      `;
    });
  });
}

export function startApp() {
  console.log('startApp called');
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded fired');
    await initApp();
    init().then(() => console.log('Wasm init complete')).catch(console.error);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startApp();
}
