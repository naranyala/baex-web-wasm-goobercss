# BAEX Framework TODOs

## Architectural Maturity
- [ ] Implement automatic TypeScript type generation from Rust structs (e.g., using `ts-rs`) to ensure interface sync.
- [ ] Implement runtime schema validation for IR command payloads using `zod`.
- [ ] Refactor initialization lifecycle to be explicit (e.g., `BAEX.ready()`) rather than relying on DOM events.

## Error Handling & Debugging
- [ ] Centralize IR error handling to map Rust anomalies to user-friendly UI feedback.
- [ ] Improve cross-layer stack tracing to debug failures across JS/WASM boundaries.

## Performance
- [ ] Evaluate reducing serialization overhead for high-frequency bridge calls.

## Component System
- [ ] Simplify component registration and state subscription mechanics.
