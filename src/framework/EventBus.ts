type Listener<T = any> = (data: T) => void;
type Unsubscribe = () => void;

export class EventBus {
  private listeners = new Map<string, Set<Listener>>();
  private onceListeners = new Map<string, Set<Listener>>();

  on<T>(event: string, listener: Listener<T>): Unsubscribe {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.listeners.get(event)?.delete(listener);
  }

  once<T>(event: string, listener: Listener<T>): Unsubscribe {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(listener);
    return () => this.onceListeners.get(event)?.delete(listener);
  }

  emit<T>(event: string, data: T): void {
    this.listeners.get(event)?.forEach(fn => fn(data));
    this.onceListeners.get(event)?.forEach(fn => fn(data));
    this.onceListeners.delete(event);
  }

  off(event: string): void {
    this.listeners.delete(event);
    this.onceListeners.delete(event);
  }

  clear(): void {
    this.listeners.clear();
    this.onceListeners.clear();
  }

  listenerCount(event: string): number {
    return (this.listeners.get(event)?.size ?? 0) + (this.onceListeners.get(event)?.size ?? 0);
  }
}

export const globalBus = new EventBus();
