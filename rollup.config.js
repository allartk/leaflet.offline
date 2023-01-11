import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

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
  plugins: [
    resolve({ extensions }),
    babel({ extensions, babelHelpers: 'bundled' })
  ],
  external: ['leaflet', 'idb'],
};
