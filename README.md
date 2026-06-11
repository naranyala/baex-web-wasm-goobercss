# EXBA Framework (Extended Browser Api)

EXBA is a modular web framework designed to bridge Rust-powered business logic with a reactive TypeScript frontend. It utilizes a WebAssembly-first architecture to deliver high-performance state management and surgical UI updates.

## Architecture

The codebase follows a Modular Layered Architecture to ensure strict separation of concerns and maintainability.

### Layered Structure

*   **core/**: The EXBA Framework Engine. Contains reactivity (Signals/Effects), DOM patching, routing, and base component lifecycle logic.
*   **wasm/**: The Native Logic Layer. High-performance Rust code compiled to WebAssembly. Manages canonical state and business rules.
*   **bridge/**: The Interop Layer. Handles the communication between TypeScript and the WebAssembly module.
*   **shell/**: The Application Orchestrator. Manages the main entry point, global configurations, and the theme system.
*   **components/**: The UI Library.
    *   `shell/`: Dashboard components like the status bar and tab bar.
    *   `widgets/`: Reusable primitives such as accordions and date pickers.
    *   `demos/`: High-level feature demonstrations including Kanban and Mindmaps.
*   **utils/**: Generic TypeScript utility helpers used across the project.
*   **tools/**: Internal development tools, including the API documentation generator.

## Core Concepts

### Signal-Based Reactivity
EXBA uses a granular reactivity system. Signals are lightweight value holders that automatically notify subscribers when their values change.

### Surgical DOM Patching
Instead of re-rendering entire components, EXBA's patching engine performs targeted updates to text content, attributes, and classes. It supports a two-tier execution model where high-performance diffing can be performed in Rust.

### WASM-First Interop
Business logic resides in Rust. The TypeScript layer communicates with Rust through a type-safe bridge, allowing for direct execution of native methods.

## Code Examples

### Rust: Exporting WASM Functions
Defined in the `wasm/` directory, Rust functions are exported using `wasm_bindgen`.

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn fibonacci(n: i32) -> i32 {
    if n <= 1 { return n; }
    let mut a = 0;
    let mut b = 1;
    for _ in 0..n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    a
}
```

### TypeScript: Reactive Component
Components extend `ExbaComponent` and use static property and style definitions.

```typescript
import { ExbaComponent } from '@core/lifecycle/component';
import { html } from '@core/dom/dom';

export class SimpleCounter extends ExbaComponent {
  static props = {
    initial: 'number'
  };

  static styles = {
    container: 'padding: 1rem; border: 1px solid var(--exba-border);',
    value: 'font-weight: bold; color: var(--exba-primary);'
  };

  protected onMount() {
    // Create a local signal scoped to this component
    this.count = this.useSignal(this.state.initial || 0);
  }

  render() {
    return html`
      <div class="container">
        <span class="value">Count: ${this.count.value}</span>
        <button onclick="this.getRootNode().host.count.value++">
          Increment
        </button>
      </div>
    `;
  }
}
```

### TypeScript: Bridge Execution
Call native Rust methods from TypeScript using the unified bridge.

```typescript
import { EXBA } from '@core/lifecycle/exba';

async function calculate() {
  // Call Rust 'add' method through the bridge
  const sum = await EXBA.callBridge<number>('add', 10, 20);
  console.log(`Sum from Rust: ${sum}`);

  // Call Rust 'fibonacci' method
  const fib = await EXBA.callBridge<number>('fibonacci', 10);
  console.log(`Fibonacci(10) from Rust: ${fib}`);
}
```

## Getting Started

### Installation

Install dependencies:
```bash
bun install
```

### Development

Build the WebAssembly module and start the dev server:
```bash
bun run build
bun run dev
```

### Testing

Execute the test suite:
```bash
bun run test
```

## API Documentation

The project includes a custom documentation generator located in `tools/docs-api-generator`. It parses both TypeScript and Rust sources to generate an interactive documentation site.

Generate documentation:
```bash
bun run docs:gen
```

Serve documentation:
```bash
bun run docs:serve
```
