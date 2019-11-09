/* global L,LeafletOffline, $  */
function showTileList() {
  LeafletOffline.getStorageInfo().then((r) => {
    const list = document.getElementById('tileinforows');
    list.innerHTML = '';
    for (let i = 0; i < r.length; i += 1) {
      const createdAt = new Date(r[i].createdAt);
      list.insertAdjacentHTML(
        'beforeend',
        `<tr><td>${i}</td><td>${r[i].url}</td><td>${r[i].key}</td><td>${createdAt.toDateString()}</td></tr>`,
      );
    }
  });
}

$('#storageModal').on('show.bs.modal', () => {
  showTileList();
});


const map = L.map('map');
// offline baselayer, will use offline source if available
const baseLayer = L.tileLayer
  .offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data {attribution.OpenStreetMap}',
    subdomains: 'abc',
    minZoom: 13,
  })
  .addTo(map);
  // add buttons to save tiles in area viewed
const control = L.control.savetiles(baseLayer, {
  zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
  confirm(layer, succescallback) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
      succescallback();
    }
  },
  confirmRemoval(layer, successCallback) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Remove all the tiles?')) {
      successCallback();
    }
  },
  saveText:
      '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
  rmText:
      '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>',
});
control.addTo(map);

map.setView(
  {
    lat: 51.985,
    lng: 5,
  },
  16,
);
// layer switcher control
const layerswitcher = L.control
  .layers({
    'osm (offline)': baseLayer,
  })
  .addTo(map);

let storageLayer;
const addStorageLayer = () => {
  LeafletOffline.getStoredTilesAsJson(baseLayer).then((data) => {
    storageLayer = L.geoJSON(data).bindPopup((clickedLayer) => clickedLayer.feature.properties.key);
    layerswitcher.addOverlay(storageLayer, 'stored tiles');
  });
};

addStorageLayer();

document
  .getElementById('remove_tiles')
  .addEventListener('click', () => {
    control._rmTiles();
  });
baseLayer.on('storagesize', (e) => {
  document.getElementById('storage').innerHTML = e.storagesize;
  if (storageLayer) {
    storageLayer.clearLayers();
    LeafletOffline.getStoredTilesAsJson(baseLayer).then((data) => { storageLayer.addData(data); });
  }
});

// events while saving a tile layer
let progress;
baseLayer.on('savestart', (e) => {
  progress = 0;
  document.getElementById('total').innerHTML = e._tilesforSave.length;
});
baseLayer.on('savetileend', () => {
  progress += 1;
  document.getElementById('progress').innerHTML = progress;
});
