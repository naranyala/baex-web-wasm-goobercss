import { Context } from './context';
import { patch } from './dom';
import { EXBA } from './exba';

export interface ComponentState {
  [key: string]: any;
}

export interface ComponentProps {
  [key: string]: 'string' | 'number' | 'boolean' | 'json';
}

export abstract class ExbaComponent extends HTMLElement {
  protected activeSubscriptions: Array<() => void> = [];
  protected state: ComponentState = {};

  /**
   * Define the properties the component should observe.
   * Example: static props = { count: 'number', name: 'string' };
   */
  static props: ComponentProps = {};

  /**
   * Define the scoped styles for the component as an object.
   * Key: class name, Value: CSS rules.
   * Example: static styles = { container: 'padding: 1rem; color: red;' };
   */
  static styles: Record<string, string> = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return Object.keys((this as any).props);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) return;

    const propType = (this.constructor as typeof ExbaComponent).props[name];
    let value: any = newValue;

    if (propType) {
      switch (propType) {
        case 'number':
          value = Number(newValue);
          break;
        case 'boolean':
          value = newValue === 'true' || newValue === '';
          break;
        case 'json':
          try {
            value = JSON.parse(newValue || 'null');
          } catch {
            value = null;
          }
          break;
      }
    }

    this.setState({ [name]: value });
  }

  /**
   * The core rendering method. Should return a string of HTML.
   */
  abstract render(): string;

  /**
   * Lifecycle hooks
   */
  protected onMount(): void {}
  protected onUpdate(): void {}
  protected onUnmount(): void {}

  connectedCallback() {
    this.onMount();
    this.safeUpdate();
  }

  disconnectedCallback() {
    this.onUnmount();
    this.activeSubscriptions.forEach((unsub) => {
      unsub();
    });
    this.activeSubscriptions = [];
  }

  /**
   * Updates the component state and triggers a re-render.
   */
  setState(newState: Partial<ComponentState>) {
    this.state = { ...this.state, ...newState };
    this.safeUpdate();
    this.onUpdate();
  }

  /**
   * Emits a custom event from the component.
   */
  protected emit(eventName: string, detail?: any) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Context API: Access values from a Provider higher up the tree.
   */
  protected useContext<T>(contextId: string): T | null {
    return Context.consume<T>(this, contextId) || null;
  }

  protected slot(name: string = 'default'): string {
    const slot =
      this.getRootNode() instanceof ShadowRoot
        ? this.getRootNode().querySelector(`slot[name="${name}"]`)
        : null;
    return slot ? slot.innerHTML : '';
  }

  private safeUpdate() {
    if (!this.shadowRoot) return;
    try {
      const html = this.render();

      // Generate style block from styles object
      const stylesObj = (this.constructor as typeof ExbaComponent).styles;
      let styleContent = '';
      if (stylesObj) {
        styleContent = Object.entries(stylesObj)
          .map(([cls, rules]) => `.${cls} { ${rules} }`)
          .join('\n');
      }
      const styleTag = styleContent ? `<style>${styleContent}</style>` : '';

      const fullHTML = `${styleTag}${html}`;
      patch(this.shadowRoot, fullHTML);
    } catch (e) {
      console.error(
        `[EXBA] Render error in <${this.tagName.toLowerCase()}>:`,
        e,
      );
      this.shadowRoot.innerHTML = `
        <div style="padding: 0.5rem; color: #ef4444; font-size: 0.8125rem; font-family: monospace;">
          Render error: ${e instanceof Error ? e.message : String(e)}
        </div>
      `;
    }
  }

  protected subscribeToState(key: string) {
    const unsub = EXBA.subscribe(key, (val) => {
      this.setState({ [key]: val });
    });
    this.activeSubscriptions.push(unsub);
  }

  protected async callWasm<T>(method: string, ...args: any[]): Promise<T> {
    return EXBA.callBridge<T>(method, ...args);
  }
}
