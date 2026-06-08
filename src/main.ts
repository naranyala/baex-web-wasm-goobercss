import './style.css';
import { setup } from 'goober';
import { startApp, fuzzySearch } from './app.js';
import init from '../public/wasm/wasm_logic.js';

setup(null);

if (process.env.NODE_ENV !== 'test') {
  startApp();
}

export { startApp, fuzzySearch };
