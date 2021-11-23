import { getTile, downloadTile, saveTile } from 'leaflet.offline';

/* global L */
const map = L.map('map');

const wmtsUrlTemplate = 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=EPSG:3857&layer={layer}&tilematrix={z}&tilerow={y}&tilecol={x}&format=image%2Fpng';

const brtLayer = L.tileLayer(wmtsUrlTemplate, {
  layer: 'standaard',
  format: 'image/png',
  transparent: true,
});


brtLayer.addTo(map);

brtLayer.on('tileloadstart', (event) => {
  const { tile } = event;
  const url = tile.src;
  // reset tile.src, to not start download yet
  tile.src = '';
  getTile(url)
    .then((blob) => {
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


map.setView(
  {
    lat: 52.090,
    lng: 5.118,
  },
  16,
);
