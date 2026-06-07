type Listener<T> = (value: T) => void;

export class Signal<T> {
  private _value: T;
  private listeners = new Set<Listener<T>>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    listener(this._value);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this._value));
  }
}

export function createSignal<T>(initialValue: T) {
  return new Signal(initialValue);
}
