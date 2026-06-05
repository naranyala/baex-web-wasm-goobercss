import { hostApi } from './HostAPI';

export interface WasmModuleExports {
  [key: string]: any;
}

export class WasmLoader {
  static async load(path: string, customImports: any = {}): Promise<WasmModuleExports> {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to fetch WASM: ${response.statusText}`);
      
      // Merge Host API imports with any custom imports provided
      const imports = {
        ...hostApi.getImports(),
        ...customImports,
      };
      
      const { instance } = await WebAssembly.instantiateStreaming(response, imports);
      return instance.exports as WasmModuleExports;
    } catch (error) {
      console.error(`WasmLoader error loading ${path}:`, error);
      throw error;
    }
  }
}
