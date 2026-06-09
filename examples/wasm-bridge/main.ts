// examples/wasm-bridge/main.ts
import { EXBA } from '../../src/framework/core/exba';

const btn = document.getElementById('call-btn');
const result = document.getElementById('result');

btn?.addEventListener('click', async () => {
  try {
    const res = await BAEX.callBridge<string>('greet', 'ExampleUser');
    if (result) result.innerText = res;
  } catch (e) {
    console.error(e);
  }
});
