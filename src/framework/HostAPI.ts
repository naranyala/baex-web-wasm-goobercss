export interface HostExtension {
  name: string;
  description: string;
}

export class HostAPI {
  private memory: WebAssembly.Memory;
  private extensions: HostExtension[] = [
    { name: 'browser_log', description: 'Logs a string to the developer console' },
    { name: 'browser_alert', description: 'Triggers a native browser alert dialog' },
    { name: 'browser_set_title', description: 'Changes the document title' },
  ];

  constructor(initialPages = 1) {
    this.memory = new WebAssembly.Memory({ initial: initialPages });
  }

  getExtensions() {
    return this.extensions;
  }

  getMemory() {
    return this.memory;
  }

  readString(ptr: number, len: number): string {
    const view = new Uint8Array(this.memory.buffer, ptr, len);
    return new TextDecoder().decode(view);
  }

  getImports() {
    return {
      env: {
        memory: this.memory,
        browser_log: (ptr: number, len: number) => {
          console.log(`[Zig Log]: ${this.readString(ptr, len)}`);
        },
        browser_alert: (ptr: number, len: number) => {
          alert(this.readString(ptr, len));
        },
        browser_set_title: (ptr: number, len: number) => {
          document.title = this.readString(ptr, len);
        },
      },
    };
  }
}

export const hostApi = new HostAPI();

