/* global L,LeafletOffline  */
function showTileList() {
  LeafletOffline.getStorageInfo().then((r) => {
    const list = document.getElementById('tileinforows');
    for (i = 0; i < r.length; i++) {
      const createdAt = new Date(r[i].createdAt);
      list.insertAdjacentHTML(
        'beforeend',
        `<tr><td>${r[i].url}</td><td>${r[i].key}</td><td>${createdAt.toDateString()}</td></tr>`,
      );
    }
  });
}
showTileList();


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
    if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
      succescallback();
    }
  },
  confirmRemoval(layer, successCallback) {
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
document
  .getElementById('remove_tiles')
  .addEventListener('click', (e) => {
    control._rmTiles();
  });
baseLayer.on('storagesize', (e) => {
  document.getElementById('storage').innerHTML = e.storagesize;
  showTileList();
});

// events while saving a tile layer
let progress;
baseLayer.on('savestart', (e) => {
  progress = 0;
  document.getElementById('total').innerHTML = e._tilesforSave.length;
});
baseLayer.on('savetileend', () => {
  progress++;
  document.getElementById('progress').innerHTML = progress;
});
baseLayer.on('loadend', () => {
  showTileList();
});

map.setView(
  {
    lat: 51.985,
    lng: 5,
  },
  16,
);
// layer switcher control
L.control
  .layers({
    'osm (offline)': baseLayer,
  })
  .addTo(map);
