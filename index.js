/* global L,LeafletOffline, $  */
const isTMS = document.getElementById('map').classList.contains('tms');
const urlTemplate = isTMS
  ? 'https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs@EPSG:28992@png8/{z}/{x}/{y}.png'
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

function showTileList() {
  LeafletOffline.getStorageInfo(urlTemplate).then((r) => {
    const list = document.getElementById('tileinforows');
    list.innerHTML = '';
    for (let i = 0; i < r.length; i += 1) {
      const createdAt = new Date(r[i].createdAt);
      list.insertAdjacentHTML(
        'beforeend',
        `<tr><td>${i}</td><td>${r[i].url}</td><td>${
        r[i].key
        }</td><td>${createdAt.toDateString()}</td></tr>`,
      );
    }
  });
}

$('#storageModal').on('show.bs.modal', () => {
  showTileList();
});


// RD Dutch projection
let projection = L.CRS.EPSG3857;
if (isTMS) {
  projection = new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs',
    {
      resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210],
      bounds: L.bounds([-285401.92, 22598.08], [595401.9199999999, 903401.9199999999]),
      origin: [-285401.92, 22598.08],
    });
}

const map = L.map('map', {
  crs: projection,
});
let baseLayer;

// offline baselayer, will use offline source if available
if (map.getContainer().classList.contains('tms')) {
  map.setView([52.07, 4.306], 8);
  baseLayer = L.tileLayer.offline(urlTemplate, {
    minZoom: 0,
    maxZoom: 13,
    tms: true,
    attribution: 'Map data: <a href="http://www.kadaster.nl">Kadaster</a>',
  }).addTo(map);
} else {
  map.setView([51.985, 5], 16);
  baseLayer = L.tileLayer
    .offline(urlTemplate, {
      attribution: 'Map data {attribution.OpenStreetMap}',
      subdomains: 'abc',
      minZoom: 13,
    })
    .addTo(map);
}
// add buttons to save tiles in area viewed
const control = L.control.savetiles(baseLayer, {
  zoomlevels: !isTMS ? [13, 16] : [12, 13], // optional zoomlevels to save, default current zoomlevel
  confirm(layer, successCallback) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
      successCallback();
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
  rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>',
});
control.addTo(map);


// layer switcher control
const layerswitcher = L.control
  .layers({
    'osm (offline)': baseLayer,
  }, null, { collapsed: false })
  .addTo(map);

let storageLayer;

const getGeoJsonData = () => LeafletOffline.getStorageInfo(urlTemplate)
  .then((data) => LeafletOffline.getStoredTilesAsJson(baseLayer, data, map.options.crs));

const addStorageLayer = () => {
  getGeoJsonData().then((geojson) => {
    storageLayer = L.geoJSON(geojson).bindPopup(
      (clickedLayer) => clickedLayer.feature.properties.key,
    );
    layerswitcher.addOverlay(storageLayer, 'stored tiles');
  });
};

addStorageLayer();

document.getElementById('remove_tiles').addEventListener('click', () => {
  control._rmTiles();
});
baseLayer.on('storagesize', (e) => {
  document.getElementById('storage').innerHTML = e.storagesize;
  if (storageLayer) {
    storageLayer.clearLayers();
    getGeoJsonData().then((data) => {
      storageLayer.addData(data);
    });
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
