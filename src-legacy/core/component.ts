import { BAEX } from './baex';

export abstract class BaexComponent extends HTMLElement {
  protected activeSubscriptions: Array<() => void> = [];
  
  // New: Simple state binding
  protected state: any = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  abstract render(): string;

  connectedCallback() {
    this.update();
  }

  disconnectedCallback() {
    this.activeSubscriptions.forEach(unsub => unsub());
    this.activeSubscriptions = [];
  }

  // Simplified: Auto-re-render on state change
  setState(newState: any) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  update() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();
    }
  }

  protected subscribeToState(key: string) {
    const unsub = BAEX.subscribe(key, (val) => {
      this.setState({ [key]: val });
    });
    this.activeSubscriptions.push(unsub);
  }

  protected async callWasm<T>(method: string, ...args: any[]): Promise<T> {
    return BAEX.callBridge<T>(method, ...args);
  }
}
