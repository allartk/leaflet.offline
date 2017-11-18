export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'LeafletOffline',
  },
  external: [
    'leaflet',
    'localforage',
  ],
  globals: {
    localforage: 'localforage',
    leaflet: 'L',
  },
};
