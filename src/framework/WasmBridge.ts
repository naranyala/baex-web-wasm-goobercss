import { process_ir, process_action } from '../../public/wasm/wasm_logic.js';
import { IRCommand, IRResult } from './generated/IRCommand';
import { IRBundle } from './generated/IRBundle';
import { pipe } from './Functional';
import { BAEXError, BAEXErrorCode, mapIRError } from './errors';

export type BridgeCall = <T extends IRCommand['type'], P = any>(type: T, payload: P) => Promise<any>;

/**
 * A functional wrapper for the WASM bridge.
 * Instead of a singleton, we provide a creator that allows for 
 * different bridge configurations (e.g. for testing).
 */
export const createBridge = () => {
  const call: BridgeCall = async (type, payload) => {
    try {
      const command: IRCommand = { type, payload } as any;
      const commandJson = JSON.stringify(command);
      
      const rawResult: IRResult = await process_ir(commandJson);
      
      if (rawResult.type === 'Error') {
        throw mapIRError(rawResult.payload);
      }
      
      return rawResult.payload;
    } catch (e) {
      if (e instanceof BAEXError) throw e;
      
      throw new BAEXError(
        BAEXErrorCode.INTERNAL_ERROR,
        e instanceof Error ? e.message : 'Unknown error during WASM bridge call',
        e
      );
    }
  };

  const action = async (actionId: string): Promise<IRBundle> => {
    try {
      return (await process_action(actionId)) as IRBundle;
    } catch (e) {
      throw new BAEXError(
        BAEXErrorCode.WASM_BRIDGE_ERROR,
        `Failed to process action ${actionId}: ${e instanceof Error ? e.message : 'Unknown error'}`,
        e
      );
    }
  };

  return { call, action };
};

export const WasmBridge = createBridge();
