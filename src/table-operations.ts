import { tableContainer } from './styles.js';

export async function fetchTables() {
  console.log('Mocking fetchTables...');
  return ['users', 'posts'];
}

export async function renderTableContent(tableName: string) {
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

export async function handleAddRow(tableName: string, columns: string[]) {
  const values = columns.map(col => prompt(`Value for ${col}:`) || '');
  console.log('Mocking INSERT action:', tableName, columns, values);
  await renderTableContent(tableName);
}

export async function handleDeleteRow(tableName: string, id: any) {
  if (!confirm(`Delete row with ID ${id}?`)) return;
  console.log('Mocking DELETE action:', tableName, id);
  await renderTableContent(tableName);
}

export async function handleUpdateRow(tableName: string, id: any, columns: string[]) {
  const updates = columns.map(col => {
    const val = prompt(`New value for ${col}:`);
    return val !== null ? `${col} = '${val.replace(/'/g, "''")}'` : null;
  }).filter(Boolean);

  if (updates.length === 0) return;

  console.log('Mocking UPDATE action:', tableName, id, updates);
  await renderTableContent(tableName);
}
