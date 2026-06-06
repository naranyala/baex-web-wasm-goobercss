// src/components/modal/index.ts
import { IRProcessor } from '../../core/processor';

export class WasmModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    
    // In a real app, we'd have a state store for IR data.
    // For now, demonstrate the devtools structure.
    const irLayers = [
        { name: 'HLIR', status: 'Active', info: 'High-level IR Analysis' },
        { name: 'LLIR', status: 'Dispatched', info: 'Low-level IR Instruction set' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        .backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal {
          background: #18181b; border: 1px solid #27272a; border-radius: 0.5rem;
          width: 600px; padding: 1.5rem; color: #e4e4e7;
        }
        h2 { margin-top: 0; color: #818cf8; }
        .layer { background: #27272a; padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.25rem; }
        .name { font-weight: bold; }
        .status { float: right; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 1rem; background: #3f3f46; }
      </style>
      <div class="backdrop" id="backdrop">
        <div class="modal">
          <h2>BAEX DevTools - IR Layers</h2>
          ${irLayers.map(layer => `
            <div class="layer">
              <span class="status">${layer.status}</span>
              <div class="name">${layer.name}</div>
              <div style="font-size: 0.85rem; color: #a1a1aa;">${layer.info}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('backdrop')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.remove();
    });
  }
}

customElements.define('wasm-modal', WasmModal);
