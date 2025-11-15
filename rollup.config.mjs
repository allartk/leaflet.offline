import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json' with { type: 'json' };
import typescript from '@rollup/plugin-typescript';

const extensions = ['.ts'];

export default {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'LeafletOffline',
    globals: {
      leaflet: 'L',
      idb: 'idb',
    },
  },
  plugins: [resolve({ extensions }), typescript()],
  external: ['leaflet', 'idb'],
};
