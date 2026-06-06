// src/components/status-bar/index.ts
export class StatusBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() { return ['primitives', 'wasm-functions']; }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const primitives = this.getAttribute('primitives') || '0';
    const wasmFuncs = this.getAttribute('wasm-functions') || '0';

    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2rem;
          background-color: #18181b; /* zinc-900 */
          border-top: 1px solid #27272a; /* zinc-800 */
          align-items: center;
          padding: 0 1rem;
          font-size: 0.75rem;
          color: #a1a1aa; /* zinc-400 */
          z-index: 100;
        }
        .stat { margin-right: 1.5rem; cursor: pointer; }
        .stat:hover { color: white; }
      </style>
      <div class="stat" id="status-click">Primitives: <span class="val">${primitives}</span></div>
      <div class="stat" id="status-click">WASM Functions: <span class="val">${wasmFuncs}</span></div>
    `;

    this.shadowRoot.querySelectorAll('#status-click').forEach(el => {
      el.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('show-modal', { bubbles: true, composed: true }));
      });
    });
  }
}

customElements.define('status-bar', StatusBar);
