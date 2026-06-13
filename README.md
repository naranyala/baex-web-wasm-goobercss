# EXBA Framework (Extended Browser API)

EXBA is a modular web framework designed to integrate Rust-powered business logic with a reactive TypeScript frontend. It utilizes a WebAssembly-first architecture to deliver high-performance state management and granular UI updates.

## Architecture

The codebase follows a Modular Layered Architecture to ensure strict separation of concerns and maintainability.

### Layered Structure

*   **core/**: The EXBA Framework Engine. Contains reactivity (Signals/Effects), DOM patching, routing, and base component lifecycle logic.
*   **wasm/**: The Native Logic Layer. High-performance Rust code compiled to WebAssembly. Manages canonical state and business rules.
*   **bridge/**: The Interop Layer. Handles communication between TypeScript and the WebAssembly module.
*   **shell/**: The Application Orchestrator. Manages the main entry point, global configurations, and the theme system.
*   **components/**: The UI Library.
    *   `internal/`: Shell components such as the status bar and navigation systems.
    *   `widgets/`: Reusable primitives including accordions and date pickers.
    *   `features/`: High-level feature demonstrations such as Kanban and Analytics dashboards.
*   **utils/**: Generic TypeScript utility helpers used across the project.
*   **docs-api-generator/**: Internal development tools, including the automated API documentation generator.

## Core Concepts

### Signal-Based Reactivity
EXBA employs a granular reactivity system. Signals are lightweight value holders that automatically notify subscribers when their values change, enabling efficient updates without global re-renders.

### Surgical DOM Patching
Instead of re-rendering entire components, EXBA's patching engine performs targeted updates to text content, attributes, and classes. It supports a two-tier execution model where high-performance diffing can be offloaded to Rust.

### WASM-First Interoperability
Business logic resides in Rust. The TypeScript layer communicates with Rust through a type-safe bridge, allowing for direct execution of native methods with minimal overhead.

## Advanced Framework Features

### 1. Component Composition Engine
The framework provides a sophisticated component composition system that supports:
- Dynamic component factories for creating reusable component families.
- Slot-based content projection for flexible component layouts.
- Component composition APIs for building complex UIs from modular primitives.
- Runtime component registration for dynamic loading.

### 2. State Management Middleware
EXBA implements a comprehensive state management middleware system that enables:
- State validation and transformation prior to application.
- State persistence with automated serialization.
- State history for undo/redo functionality.
- Middleware composition for cross-cutting concerns.

### 3. Virtual DOM and Custom Directives
EXBA provides a Virtual DOM engine that supports:
- A custom directive system for extending component capabilities.
- Intersection observer directives for performance optimization.
- Event-based directives such as click-outside detection.
- Custom element lifecycle hooks for advanced interactions.

### 4. Advanced Routing System
The routing architecture supports:
- Nested route handling for complex application structures.
- Route guards and authentication mechanisms for secure navigation.
- Route transitions and animations for fluid user experiences.
- Route middleware and validation for advanced navigation logic.

### 5. Event Composition System
The event composition system enables:
- Event chaining and piping for complex data flows.
- Filtering and transformation for efficient data processing.
- Debouncing and throttling for performance optimization.
- Event middleware for consistent cross-cutting logic.

### 6. Lifecycle Management
A comprehensive lifecycle management system enables:
- Middleware pipelines for cross-cutting lifecycle concerns.
- Asynchronous lifecycle composition for complex initialization sequences.
- Specialized lifecycle events for advanced component orchestration.
- Integrated debugging and profiling capabilities.

### 7. Theming and Accessibility
The system provides:
- A centralized theming engine for consistent application aesthetics.
- Accessibility compliance tools for inclusive user experiences.
- Dynamic theme switching with persistence.
- Automated accessibility testing integrations.

### 8. Performance Monitoring
The performance optimization system includes:
- Real-time metrics collection and monitoring.
- Component-level performance profiling.
- Event handling overhead tracking.
- Middleware execution analysis.

## Getting Started

### Installation
Ensure you have Bun and the Rust toolchain installed.

```bash
bun install
```

### Development
Build the WebAssembly module and start the development server:

```bash
bun run build
bun run dev
```

### Testing
Execute the comprehensive test suite:

```bash
bun run test
```

## API Documentation
The project includes a custom documentation generator located in `docs-api-generator`. It parses both TypeScript and Rust sources to generate an interactive documentation site.

To generate and serve documentation:

```bash
bun run docs:gen
bun run docs:serve
```

## Conclusion
The EXBA Framework is designed to bridge the gap between high-performance native logic and modern web interfaces. By prioritizing modularity, performance, and developer experience, EXBA provides a robust foundation for building complex, data-intensive web applications.
