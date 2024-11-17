import { Map, tileLayer } from 'leaflet';
import { getBlobByKey, downloadTile, saveTile } from 'leaflet.offline';

import './style.css'

export const wmtsUrlTemplate =
  'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=EPSG:3857&layer=standaard&tilematrix={z}&tilerow={y}&tilecol={x}&format=image%2Fpng';

const leafletMap = new Map('map');

const brtLayer = tileLayer(wmtsUrlTemplate);

brtLayer.addTo(leafletMap);

brtLayer.on('tileloadstart', (event) => {
  const { tile } = event;
  const url = tile.src;
  // reset tile.src, to not start download yet
  tile.src = '';
  getBlobByKey(url).then((blob) => {
    if (blob) {
      tile.src = URL.createObjectURL(blob);
      console.debug(`Loaded ${url} from idb`);
      return;
    }
    tile.src = url;
    // create helper function for it?
    const { x, y, z } = event.coords;
    const { _url: urlTemplate } = event.target;
    const tileInfo = {
      key: url,
      url,
      x,
      y,
      z,
      urlTemplate,
      createdAt: Date.now(),
    };
    downloadTile(url)
      .then((dl) => saveTile(tileInfo, dl))
      .then(() => console.debug(`Saved ${url} in idb`));
  });
});

leafletMap.setView(
  {
    lat: 52.09,
    lng: 5.118,
  },
  16
);