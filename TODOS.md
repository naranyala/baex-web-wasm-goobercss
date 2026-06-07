# BAEX Framework TODOs

## ✅ Completed
- [x] Automatic TypeScript type generation from Rust structs (`ts-rs`).
- [x] Unified Rust IR crate (merging `wasm-src` and `core/rust`).
- [x] Typed WasmBridge with generated interfaces.
- [x] EventBus (Typed Pub/Sub).
- [x] Client-side Router.
- [x] Template Compiler with HTML escaping.
- [x] Component Lifecycle Hooks (`onMount`, `onUpdate`, `onDestroy`).

## 🚀 Performance Roadmap (Current Focus)
- [ ] **Fine-grained Reactivity**: Move from `innerHTML` replacement to Signal-based DOM patching to avoid full re-renders.
- [ ] **Binary Bridge**: Replace JSON serialization with a binary protocol (e.g., MessagePack or Bincode) to reduce WASM boundary overhead.
- [ ] **AOT Compilation**: Move template compilation from runtime to build-time.
- [ ] **State Optimization**: Implement immutable state updates via Immer for more predictable performance.

## 🛠️ Other Improvements
- [ ] Centralize IR error handling to map Rust anomalies to user-friendly UI feedback.
- [ ] Improve cross-layer stack tracing to debug failures across JS/WASM boundaries.
- [ ] Refactor initialization lifecycle to be explicit (`BAEX.ready()`).
