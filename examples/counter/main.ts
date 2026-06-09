// examples/counter/main.ts
import { EXBA } from '../../src/framework/core/exba';
import { ReactiveStateProxy } from '../../src/framework/state/proxy';

const state = new ReactiveStateProxy(
  { count: 0 },
  {
    onPropertyUpdate: (prop, value) => {
      const display = document.getElementById('counter-display');
      if (display) display.innerText = `Count: ${value}`;
    },
  },
);

const btn = document.getElementById('inc-btn');
btn?.addEventListener('click', () => {
  state.value.count++;
});
