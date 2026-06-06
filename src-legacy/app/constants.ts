import { updateResult } from './utils';

export const MENU_ITEMS = [
  { 
    id: 'zig-backend', 
    label: 'Native Engine', 
    icon: '⚙️', 
    code: `const version = await (window as any).ipcRenderer.invoke('zig-engine:version');\nconst sum = await (window as any).ipcRenderer.invoke('zig-engine:add', [10, 20]);`,
    action: async () => {
      const version = await (window as any).ipcRenderer.invoke('zig-engine:version');
      const sum = await (window as any).ipcRenderer.invoke('zig-engine:add', [10, 20]);
      updateResult(`[Native Zig] Version: ${version}\nCalculation: 10 + 20 = ${sum}`, `const version = await (window as any).ipcRenderer.invoke('zig-engine:version');\nconst sum = await (window as any).ipcRenderer.invoke('zig-engine:add', [10, 20]);`);
    } 
  },
  { 
    id: 'wasm-math', 
    label: 'Wasm Math', 
    icon: '⚡', 
    code: `const res = (window as any).add(10, 32);\nconst fib = (window as any).fibonacci(7);`,
    action: () => {
      const res = (window as any).add(10, 32);
      const fib = (window as any).fibonacci(7);
      updateResult(`[Wasm] 10 + 32 = ${res}\nFibonacci(7) = ${fib}`, `const res = (window as any).add(10, 32);\nconst fib = (window as any).fibonacci(7);`);
    } 
  },
  { 
    id: 'wasm-extended', 
    label: 'Extended API', 
    icon: '🌐', 
    code: `(window as any).wasmGreet('Developer');`,
    action: () => {
      (window as any).wasmGreet('Developer');
      updateResult(`[Wasm Extended] Check the browser tab title and console!`, `(window as any).wasmGreet('Developer');`);
    } 
  },
  { id: 'settings', label: 'Settings', icon: '🛠️', code: `// Settings`, action: () => updateResult('Settings Panel', '// Settings') },
  { id: 'profile', label: 'Profile', icon: '👤', code: `// Profile`, action: () => updateResult('Profile Panel', '// Profile') },
  { id: 'analytics', label: 'Analytics', icon: '📊', code: `// Analytics`, action: () => updateResult('Analytics Panel', '// Analytics') },
  { id: 'messages', label: 'Messages', icon: '✉️', code: `// Messages`, action: () => updateResult('Messages Panel', '// Messages') },
  { id: 'cloud', label: 'Cloud Storage', icon: '☁️', code: `// Cloud`, action: () => updateResult('Cloud Panel', '// Cloud') },
  { id: 'security', label: 'Security', icon: '🛡️', code: `// Security`, action: () => updateResult('Security Panel', '// Security') },
  { id: 'help', label: 'Help Center', icon: '❓', code: `// Help`, action: () => updateResult('Help Panel', '// Help') },
  { id: 'terminal', label: 'Terminal', icon: '💻', code: `// Terminal`, action: () => updateResult('Terminal Panel', '// Terminal') },
  { id: 'network', label: 'Network', icon: '🌐', code: `// Network`, action: () => updateResult('Network Panel', '// Network') },
  { id: 'files', label: 'File Manager', icon: '📂', code: `// Files`, action: () => updateResult('Files Panel', '// Files') },
  { id: 'database', label: 'Database', icon: '🗄️', code: `// Database`, action: () => updateResult('Database Panel', '// Database') },
];

export const CODE_EXAMPLES = [
  { 
    title: 'Zig Wasm Export', 
    language: 'zig', 
    code: `export fn add(a: i32, b: i32) i32 {\n    return a + b;\n}` 
  },
  { 
    title: 'Wasm Fetch & Instantiate', 
    language: 'typescript', 
    code: `const response = await fetch('./main.wasm');\nconst bytes = await response.arrayBuffer();\nconst { instance } = await WebAssembly.instantiate(bytes);` 
  },
  { 
    title: 'Tailwind Grid', 
    language: 'html', 
    code: `<div class="grid grid-cols-4 gap-4">\n  <div class="bg-zinc-800 p-4">Item</div>\n</div>` 
  },
];
