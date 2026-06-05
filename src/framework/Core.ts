import { WasmLoader, type WasmModuleExports } from './WasmLoader';

export class WasmFramework {
  private modules: Map<string, WasmModuleExports> = new Map();

  async registerModule(name: string, path: string, imports?: any) {
    const exports = await WasmLoader.load(path, imports);
    this.modules.set(name, exports);
    console.log(`Module [${name}] registered from ${path}`);
  }

  getModuleNames(): string[] {
    return Array.from(this.modules.keys());
  }

  getModule(name: string): WasmModuleExports {
    const module = this.modules.get(name);
    if (!module)
      throw new Error(
        `Module [${name}] not found. Make sure it is registered.`,
      );
    return module;
  }

  call(moduleName: string, funcName: string, ...args: any[]): any {
    const module = this.getModule(moduleName);
    const func = module[funcName];
    if (typeof func !== 'function') {
      throw new Error(
        `Function [${funcName}] not found in module [${moduleName}]`,
      );
    }
    return func(...args);
  }

  globalize(moduleName: string) {
    const module = this.getModule(moduleName);
    Object.entries(module).forEach(([name, value]) => {
      if (typeof value === 'function') {
        (window as any)[name] = value;
      }
    });
    console.log(`Module [${moduleName}] exports globalized to window.`);
  }
}

export const framework = new WasmFramework();

