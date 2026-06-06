import { z } from 'zod';
import { process_action } from '../../public/wasm/wasm_logic.js';
import { IRCommand, IRResult, BridgeInterface } from './types';

const IRResultSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("Number"), payload: z.number() }),
    z.object({ type: z.literal("Void"), payload: z.null().optional() }),
    z.object({ type: z.literal("Error"), payload: z.object({ message: z.string() }) }),
    z.object({ type: z.literal("Rules"), payload: z.object({ schema: z.string() }) }),
]);

async function bridgeRaw(type: string, payload: any): Promise<any> {
    const command: IRCommand = { type, payload };
    const commandJson = JSON.stringify(command);

    console.debug(`[BAEX Bridge] Sending: ${commandJson}`);

    const rawResult: unknown = await process_action(commandJson);

    // Validate the result from WASM
    const validationResult = IRResultSchema.safeParse(rawResult);
    if (!validationResult.success) {
        console.error(`[BAEX Bridge] Schema Validation Error:`, validationResult.error);
        throw new Error(`Invalid IRResult from Rust: ${validationResult.error.message}`);
    }

    const result = validationResult.data;
    console.debug(`[BAEX Bridge] Received:`, result);

    if (result.type === 'Error') {
        console.error(`[BAEX Bridge] Anomaly: ${result.payload.message}`);
        throw new Error(result.payload.message);
    }

    return result.payload;
}
export const WasmBridge: BridgeInterface = {
    compute: {
        add: async (a, b) => await bridgeRaw('Add', { a, b }),
        fibonacci: async (n) => await bridgeRaw('Fibonacci', { n }),
        factorial: async (n) => await bridgeRaw('Factorial', { n }),
    },
    text: {
        reverse: async (text) => await bridgeRaw('ReverseString', { text }),
        isPalindrome: async (text) => await bridgeRaw('PalindromeCheck', { text }),
    },
    system: {
        greet: async (name) => await bridgeRaw('Greet', { name }),
        reportAnomaly: async (message) => await bridgeRaw('ReportAnomaly', { message }),
        getRules: async () => await bridgeRaw('RulesQuery', {}),
    }
};
