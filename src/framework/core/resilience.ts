import { EXBA } from './exba';

export type EngineTier = 'wasm' | 'ts';
export type EngineStatus = 'healthy' | 'degraded' | 'recovering' | 'failed';

export class ResilienceManager {
  private static status: EngineStatus = 'healthy';
  private static failureCount = 0;
  private static MAX_FAILURES = 3;
  private static recoveryTimer: any = null;

  /**
   * Manual override to force the framework into TS fallback mode.
   * Useful for debugging UI and state logic without WASM interference.
   */
  public static DEBUG_FORCE_FALLBACK = false;

  static getStatus(): EngineStatus {
    return ResilienceManager.status;
  }

  static getActiveTier(): EngineTier {
    if (ResilienceManager.DEBUG_FORCE_FALLBACK) return 'ts';
    return ResilienceManager.status === 'healthy' ||
      ResilienceManager.status === 'recovering'
      ? 'wasm'
      : 'ts';
  }

  static reportSuccess() {
    ResilienceManager.failureCount = 0;
    if (ResilienceManager.status === 'recovering') {
      ResilienceManager.status = 'healthy';
      EXBA.log('RESILIENCE', 'WASM Engine fully recovered');
    }
  }

  static reportFailure(reason?: any) {
    ResilienceManager.failureCount++;
    EXBA.log(
      'RESILIENCE',
      `WASM Call failed (${ResilienceManager.failureCount}/${ResilienceManager.MAX_FAILURES}): ${reason}`,
    );

    if (
      ResilienceManager.failureCount >= ResilienceManager.MAX_FAILURES &&
      ResilienceManager.status !== 'failed'
    ) {
      ResilienceManager.status = 'failed';
      EXBA.log(
        'RESILIENCE_ALERT',
        'CRITICAL: WASM engine failed. Switching to TS fallback tier.',
      );
      ResilienceManager.attemptRecovery();
    }
  }

  private static attemptRecovery() {
    if (ResilienceManager.recoveryTimer) return;

    ResilienceManager.recoveryTimer = setTimeout(async () => {
      ResilienceManager.status = 'recovering';
      EXBA.log('RESILIENCE', 'Attempting WASM engine re-initialization...');

      try {
        // Here we would trigger re-init logic
        ResilienceManager.recoveryTimer = null;
      } catch (e) {
        ResilienceManager.status = 'failed';
        ResilienceManager.recoveryTimer = null;
        ResilienceManager.attemptRecovery(); // Backoff
      }
    }, 5000); // 5s backoff
  }

  static isWasmHealthy(): boolean {
    if (ResilienceManager.DEBUG_FORCE_FALLBACK) return false;
    return EXBA.wasmModule !== null && ResilienceManager.status !== 'failed';
  }
}
