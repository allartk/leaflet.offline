import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'LeafletOffline',
    globals: {
      leaflet: 'L',
      idb: 'idb',
    },
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
  external: ['leaflet', 'idb'],
};
