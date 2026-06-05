export interface CodeExample {
  title: string;
  description: string;
  language: string;
  code: string;
}

export const CODE_EXAMPLES: CodeExample[] = [
  {
    title: 'Zig WASM Export',
    description: 'How to export a function from Zig for WASM',
    language: 'zig',
    code: `export fn add(a: i32, b: i32) i32 {
    return a + b;
}

export fn _start() void {
    return;
}`
  },
  {
    title: 'JS Wasm Loading',
    description: 'Loading a WASM module using instantiateStreaming',
    language: 'typescript',
    code: `async function loadWasm(path) {
  const response = await fetch(path);
  const { instance } = await WebAssembly.instantiateStreaming(response, {
    env: {}
  });
  return instance.exports;
}`
  },
  {
    title: 'Framework call',
    description: 'Calling a WASM function via our custom framework',
    language: 'typescript',
    code: `import { framework } from './framework/Core';

const result = framework.call('math', 'add', 10, 20);
console.log(result); // 30`
  }
];
