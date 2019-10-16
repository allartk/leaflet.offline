import localforage from 'localforage';

const lf = localforage.createInstance({
  name: 'leaflet_offline',
  version: 1.0,
  size: 4980736,
  storeName: 'tiles',
  description: 'the tile blobs, keyed by url',
});

export const meta = localforage.createInstance({
  name: 'leaflet_offline_areas',
  version: 1.0,
  size: 4980736,
  storeName: 'area',
  description: 'tile key values as object  ({ key: value, z: z, x: x, y: y}) keyed by {z}_{x}_{y}',
});

export default lf;
