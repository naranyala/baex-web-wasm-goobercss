# EXBA Framework

EXBA is a high-performance, **WASM-First** web framework that bridges Rust-powered business logic with a modern, reactive TypeScript frontend. It is designed for applications that require complex state transitions, heavy computation, and ultra-fast UI updates.

## 🧠 Philosophy: Two-Tier Execution Model

EXBA utilizes a dual-tier architecture to balance native performance with web flexibility:

1. **Tier 1: Rust-WASM Core (The Brain)**:
   - Manages the **Canonical State** and complex business rules.
   - Generates **IR (Intermediate Representation)** bundles for DOM mutations.
   - Performs heavy-duty tree diffing and data processing.
2. **Tier 2: TypeScript Shell (The Interface)**:
   - Reactive components with surgical DOM updates via a **Tree-Diffing Patcher**.
   - Ergonomic API Proxy for zero-config WASM method calls.
   - Seamless fallback logic if the WASM engine is unavailable.

## 🛠️ Key Features

- **Surgical Reactivity**: Signal-based state management with `createSignal`, `createComputed`, and automated batching.
- **Unified Component Pattern**: Class-based Web Components with scoped styles and declarative prop-mapping.
- **Ergonomic Bridge**: Call Rust methods directly as `EXBA.api.methodName(...)` using our Type-Safe Proxy.
- **Tagged Templates**: Optimized rendering using the `html` tagged template literal.
- **Persistent Management**: Built-in persistence for navigation, tabs, and global state.

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development (WASM + Frontend)
```bash
# Build WASM and start the dev server
npm run build
npm run dev
```

### Testing
```bash
npm test
```

## 🛠️ Technical Stack
- **Core**: Rust 1.75+ (wasm-bindgen, serde)
- **Frontend**: TypeScript, Custom Web Components
- **Styling**: Unified Goober-based design tokens
- **Build System**: Rsbuild / Rspack
- **Verification**: Vitest (28+ integration and core tests)

## 📋 Example Component

```typescript
import { ExbaComponent, html, EXBA } from '../framework';

export class MyCounter extends ExbaComponent {
  // 1. Reactive Prop Definition
  static props = { initial: 'number' };

  // 2. Object-based Scoped Styles
  static styles = {
    container: 'padding: 1rem; border: 1px solid var(--exba-border);',
    btn: 'background: var(--exba-primary); color: white; border-radius: 0.5rem;'
  };

  // 3. Reactive Lifecycle & Logic
  protected onMount() {
    this.count = this.useSignal(this.state.initial || 0);
  }

  render() {
    return html`
      <div class="container">
        <h3>Count: ${this.count.value}</h3>
        <button class="btn" onclick="this.getRootNode().host.count.value++">
          Increment
        </button>
      </div>
    `;
  }
}
```

## 📚 Component Library
The framework includes several high-level reactive primitives:
- **Kanban Board**: WASM-managed state transitions with glassmorphism UI.
- **Activity Feed**: Live signal-driven feed tracking global application events.
- **Web Neofetch**: Hardware and system info gathering via Rust bridge.
- **Interactive UI**: Accordion, Drawer, and Tab Management systems.
