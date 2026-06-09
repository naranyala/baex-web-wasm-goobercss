# EXBA Framework Development Roadmap

## Phase 1: Core Infrastructure & Stability
*Goal: Transition from a "demo" prototype to a stable, predictable framework.*

- [ ] **Re-render Strategy**: Replace full `innerHTML` overwrites with targeted DOM updates or a basic diffing mechanism to preserve DOM state (focus, cursor).
- [ ] **Formal Prop System**: Implement a system to map HTML attributes to component props and trigger re-renders automatically.
- [ ] **Type-Safe Bridge**: Move away from string-based `callBridge` calls to a typed interface between TypeScript and Rust.
- [ ] **Declarative Router**: Replace manual `showHome/showView` logic with a router that maps state to component views.

## Phase 2: DX, Performance & Advanced Features
*Goal: Enhance developer productivity and system performance.*

- [ ] **Context API**: Implement a provider/consumer pattern for global state (themes, user sessions) to avoid prop-drilling.
- [ ] **Scoped Styling Primitive**: Automate the injection and management of component-specific styles.
- [ ] **Async Push Streams**: Enable the Rust side to push updates to the frontend without a request (WebSocket/Channel integration).
- [ ] **Binary Serialization**: Transition from JSON to a binary format (e.g., Protobuf) for the WASM bridge.
- [ ] **High-level UI Primitives**: Create a library of accessible, state-aware components (Forms, Modals, Data-tables).
- [ ] **Dynamic Theming**: Implement CSS Variable-based theming managed by the framework.
