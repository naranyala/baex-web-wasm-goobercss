import { ease, t } from '../../styles';

const styles = `
  :host {
    display: block;
  }
  .host {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    background: ${t.zinc950};
    border-top: 1px solid ${t.zinc800a};
    align-items: center;
    padding: 0 1rem;
    font-size: 0.6875rem;
    font-family: inherit;
    color: ${t.zinc500};
    z-index: 100;
    gap: 1.5rem;
    box-sizing: border-box;
  }
  .stat {
    cursor: pointer;
    transition: color ${ease};
  }
  .stat:hover {
    color: ${t.zinc200};
  }
`;

export class StatusBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['primitives', 'wasm-functions'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const primitives = this.getAttribute('primitives') || '0';
    const wasmFuncs = this.getAttribute('wasm-functions') || '0';

    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="host">
        <div class="stat" id="status-click">Primitives: <span>${primitives}</span></div>
        <div class="stat" id="status-click">WASM Functions: <span>${wasmFuncs}</span></div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('#status-click').forEach((el) => {
      el.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('show-modal', { bubbles: true, composed: true }),
        );
      });
    });
  }
}

customElements.define('status-bar', StatusBar);
