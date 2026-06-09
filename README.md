# EXBA Framework

EXBA is a high-performance, WASM-driven web framework designed for applications requiring complex state logic and near-native execution speed.

## 🧠 Philosophy: Heavy Core, Light Shell

Unlike traditional frameworks that put the "brain" in JavaScript, EXBA moves the entire decision engine into a Rust-compiled WASM binary.

### The Architecture
1. **Heavy Core (Rust/WASM)**: 
   - Holds the **Canonical State**.
   - Manages the **Route Graph**.
   - Processes all business logic and computes state transitions.
   - Returns an **Effect List** (a sequence of high-level and low-level instructions).

2. **Light Shell (TypeScript)**:
   - **Renders** components based on the state.
   - **Executes** effects returned by the core (DOM updates, navigation, notifications).
   - **Dispatches** user intents as `IRCommands` to the WASM bridge.

### Core Primitives
- **`ExbaComponent`**: Shadow-DOM based components with reactive state and prop-mapping.
- **`IRBundle`**: The communication protocol between Rust and JS, consisting of `Effects` (what to do) and `LLIR` (how to mutate the DOM).
- **`ReactiveStateProxy`**: A synchronization layer that mirrors the Rust state in the JS environment.

## 🛠️ Component Development Guide

To ensure reusability and consistency, all components must follow the **EXBA Blueprint**.

### 1. The Blueprint
Every component extends `ExbaComponent` and implements three core pillars:

| Pillar | Property | Purpose |
| :--- | :--- | :--- |
| **Interface** | `static props` | Defines the API. Map attributes to types: `'string'`, `'number'`, `'boolean'`, or `'json'`. |
| **Look** | `static styles` | Scoped CSS injected into the Shadow Root. |
| **Logic** | `render()` | Returns the HTML template. Use `this.state` for reactivity. |

### 2. Implementation Example
```typescript
import { ExbaComponent } from '../framework/core/component';

export class ExbaUserCard extends ExbaComponent {
  // 1. Define API
  static props = {
    username: 'string',
    isAdmin: 'boolean',
  };

  // 2. Define Scoped Styles
  static styles = `
    .card { padding: 1rem; border: 1px solid #333; border-radius: 8px; }
    .admin-badge { color: gold; font-weight: bold; }
  `;

  // 3. Define Logic & Template
  render() {
    const { username, isAdmin } = this.state;
    return `
      <div class="card">
        <span>User: ${username}</span>
        ${isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
        <button onclick="this.getRootNode().host.emit('profile-click', { id: ${username} })">
          View Profile
        </button>
      </div>
    `;
  }
}
customElements.define('exba-user-card', ExbaUserCard);
```

### 3. Core Rules
- **Data Flow**: Props flow **down** (via attributes), Events flow **up** (via `this.emit()`).
- **Reactivity**: Never mutate `this.state` directly. Always use `this.setState({ key: value })` to trigger the DOM patcher.
- **WASM Bridge**: Use `this.callWasm('method', ...args)` to offload heavy logic to Rust.
- **Naming**: Use kebab-case for custom element tags (e.g., `exba-custom-button`).

## 🚀 Getting Started

### Installation
```bash
bun install
```

### Development
```bash
bun run dev
```

### Build for Production
```bash
bun run build
```

## 🛠️ Technical Stack
- **Core**: Rust 1.75+ $\rightarrow$ WASM (wasm-pack)
- **Frontend**: TypeScript, Goober CSS, Custom Web Components
- **Build System**: Rsbuild / Rspack
- **State Management**: Rust-side Mutex Store $\rightarrow$ TS-side Reactive Proxy

