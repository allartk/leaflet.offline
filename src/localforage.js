import lf from 'localforage';

lf.config({
  name: 'leaflet_offline',
  version: 1.0,
  size: 4980736,
  storeName: 'tiles',
  description: 'the tiles',
});

export default lf;
