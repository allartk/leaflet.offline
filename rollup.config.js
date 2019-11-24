import buble from '@rollup/plugin-buble';

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
  plugins: [
    buble({
      objectAssign: true,
      transforms: {
        asyncAwait: false,
      },
    }),
  ],
  external: ['leaflet', 'idb'],
};
