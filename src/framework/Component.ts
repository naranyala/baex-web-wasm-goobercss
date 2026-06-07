import { createReactiveState } from './ReactiveState';
import { globalBus } from './EventBus';
import { createSignal, Signal } from './Signal';

export interface LifecycleHooks {
  onMount?: () => void;
  onUpdate?: () => void;
  onDestroy?: () => void;
  onAttributeChange?: (name: string, oldValue: string | null, newValue: string | null) => void;
}

export interface ComponentConfig<S extends object> {
  name: string;
  initialState: S;
  render: (state: S, helpers: ComponentHelpers<S>) => string;
  reducer?: (state: S, action: any) => S;
  hooks?: LifecycleHooks;
  observedAttributes?: string[];
}

export interface ComponentHelpers<S> {
  setState: (update: Partial<S> | ((prev: S) => S)) => void;
  dispatch: (action: any) => void;
  emit: <T>(event: string, data: T) => void;
  on: <T>(event: string, listener: (data: T) => void) => () => void;
}

export function defineComponent<S extends object>(config: ComponentConfig<S>) {
  const { name, initialState, render, hooks, observedAttributes } = config;

  customElements.define(name, class extends HTMLElement {
    private state: S;
    private signals = new Map<string, Signal<any>>();
    private shadow: ShadowRoot;
    private unmountListeners: (() => void)[] = [];
    private _mounted = false;

    static get observedAttributes() {
      return observedAttributes ?? [];
    }

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
      
      // Initialize state with deep reactivity and signal integration
      this.state = this.createDeepReactiveState(initialState);
    }

    private createDeepReactiveState(obj: any, path: string = ''): any {
      if (obj === null || typeof obj !== 'object') return obj;

      const signalsMap: any = {};
      const proxy = new Proxy(obj, {
        get: (target, prop) => {
          const key = prop as string;
          const currentPath = path ? `${path}.${key}` : key;
          const value = Reflect.get(target, prop);
          
          if (value !== null && typeof value === 'object') {
            return this.createDeepReactiveState(value, currentPath);
          }
          return value;
        },
        set: (target, prop, value) => {
          const key = prop as string;
          const currentPath = path ? `${path}.${key}` : key;
          
          // Ensure a signal exists for this path
          if (!this.signals.has(currentPath)) {
            this.signals.set(currentPath, createSignal(value));
          }
          
          this.signals.get(currentPath)!.value = value;
          return Reflect.set(target, prop, value);
        }
      });

      // Pre-populate signals for initial state
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        const val = obj[key];
        if (val !== null && typeof val === 'object') {
          this.createDeepReactiveState(val, currentPath);
        } else {
          this.signals.set(currentPath, createSignal(val));
        }
      }

      return proxy;
    }

    connectedCallback() {
      this.update();
      this._mounted = true;
      hooks?.onMount?.();
    }

    disconnectedCallback() {
      this._mounted = false;
      hooks?.onDestroy?.();
      this.unmountListeners.forEach(fn => fn());
      this.unmountListeners = [];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
      hooks?.onAttributeChange?.(name, oldValue, newValue);
    }

    private emit = <T>(event: string, data: T) => {
      globalBus.emit(`${this.localName}:${event}`, data);
    };

    private on = <T>(event: string, listener: (data: T) => void) => {
      const unsub = globalBus.on(event, listener);
      this.unmountListeners.push(unsub);
      return unsub;
    };

    private helpers: ComponentHelpers<S> = {
      setState: (update: Partial<S> | ((prev: S) => S)) => {
        const nextState = typeof update === 'function' 
          ? (update as (prev: S) => S)(this.state) 
          : update;
        
        // Use Object.assign to trigger the Proxy's set traps
        Object.assign(this.state, nextState);
      },
      dispatch: (action: any) => {
        if (config.reducer) {
          const nextState = config.reducer(this.state, action);
          Object.assign(this.state, nextState);
        } else {
          console.warn(`[BAEX] Component ${name} received dispatch but has no reducer.`);
        }
      },
      emit: this.emit,
      on: this.on,
    };

    update() {
      const html = render(this.state, this.helpers);
      if (this.shadow.innerHTML !== html) {
        this.shadow.innerHTML = html;
        this.bindSignals();
        if (this._mounted) {
          hooks?.onUpdate?.();
        }
      }
    }

    private bindSignals() {
      const bindings = this.shadow.querySelectorAll('[data-bind]');
      bindings.forEach(el => {
        const path = el.getAttribute('data-bind');
        if (path) {
          const sig = this.signals.get(path);
          if (sig) {
            const unsub = sig.subscribe(val => {
              el.textContent = String(val);
            });
            this.unmountListeners.push(unsub);
          }
        }
      });
    }

    getComponentState(): S {
      return this.state;
    }
  });
}
