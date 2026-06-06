import './style.css'
import './components/tab-bar/index';
import { BAEX } from './core/baex';
import { BaexGreeting } from './components/baex-greeting/index';
import { StatusBar } from './components/status-bar/index';
import { WasmModal } from './components/modal/index';
import { ReactiveStateProxy } from './state/proxy';
import { setupBridge, getExposedFunctions } from './bridge/manager';
import { initApp, renderTabBar } from './app/view-grid';
import { MENU_ITEMS } from './app/constants';
import { fuzzySearch } from './app/utils';

BAEX.register('baex-greeting', BaexGreeting);
BAEX.register('status-bar', StatusBar);
BAEX.register('wasm-modal', WasmModal);

function updateStatusBar() {
  const statusBar = document.getElementById('app-status-bar');
  if (statusBar) {
    // These are placeholders for the actual counts
    statusBar.setAttribute('primitives', '5');
    statusBar.setAttribute('wasm-functions', '12');
  }
}

const appState = new ReactiveStateProxy({ counter: 0 }, {
  onPropertyUpdate: (prop, value) => {
    if (prop === 'counter') {
      const el = document.getElementById('state-counter');
      if (el) el.innerText = `Counter: ${value}`;
    }
  }
});

async function waitForApp() {
  console.log('Waiting for #app...');
  return new Promise((resolve) => {
    const check = () => {
      const el = document.getElementById('app');
      if (el) {
        console.log('#app detected');
        resolve(el);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded, starting initialization');
  
  const displayError = (message: string, error: any) => {
      console.error(message, error);
      const app = document.getElementById('app');
      if (app) {
          app.innerHTML = `<div style="color: red; padding: 20px;">
              <h1>Initialization Failed</h1>
              <p>${message}</p>
              <pre>${JSON.stringify(error, Object.getOwnPropertyNames(error))}</pre>
          </div>`;
      }
  };

  try {
    await waitForApp();
    console.log('#app found');
    const tabs = new Map<string, any>();
    let activeTabId: string | null = null;
    
    try {
        await setupBridge();
        console.log('Bridge setup complete');
        initApp();
        console.log('App initialized');
        updateStatusBar();
    } catch (e) {
        displayError('Failed to setup Bridge or Initialize App', e);
        return; // Stop here if init fails
    }

    // Listen for show-modal event from StatusBar
    const statusBar = document.getElementById('app-status-bar');
    if (statusBar) {
        statusBar.addEventListener('show-modal', () => {
        const modal = document.createElement('wasm-modal');
        modal.setAttribute('functions', JSON.stringify(getExposedFunctions()));
        document.body.appendChild(modal);
        });
    }

    // ... (existing event listeners) ...

    const tabBar = document.getElementById('main-tab-bar') as any;
    if (tabBar) {
        tabBar.addEventListener('tab-selected', (e: any) => {
        const tabId = e.detail;
        activeTabId = tabId;
        const tab = tabs.get(tabId);
        if (tab) tab.action();
        renderTabBar(tabs, activeTabId);
        });
    }

    (window as any).dispatchMenuAction = (id: string) => {
        const item = MENU_ITEMS.find(i => i.id === id);
        if (item) {
        tabs.set(item.id, { label: item.label, action: item.action });
        activeTabId = item.id;
        item.action();
        renderTabBar(tabs, activeTabId);
        }
    };

    (window as any).triggerBaexAction = async (actionId: string) => {
        await BAEX.callBridge('process_action', actionId);
    };

    (window as any).incrementCounter = () => {
        appState.value.counter++;
    };

  } catch (e) {
    displayError('Failed to find #app container', e);
  }
});
