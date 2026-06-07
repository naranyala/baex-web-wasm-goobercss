export enum BAEXErrorCode {
  WASM_BRIDGE_ERROR = 'WASM_BRIDGE_ERROR',
  SERIALIZATION_ERROR = 'SERIALIZATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPONENT_ERROR = 'COMPONENT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class BAEXError extends Error {
  constructor(
    public code: BAEXErrorCode,
    public message: string,
    public originalError?: any,
    public context?: Record<string, any>
  ) {
    super(`[${code}] ${message}`);
    this.name = 'BAEXError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      context: this.context,
    };
  }
}

/**
 * Maps Rust IR errors to BAEX Errors
 */
export function mapIRError(payload: { message: string; code?: string }): BAEXError {
  const code = payload.code as BAEXErrorCode || BAEXErrorCode.WASM_BRIDGE_ERROR;
  return new BAEXError(code, payload.message);
}
