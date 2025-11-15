import { tileLayerOffline, savetiles, SaveStatus } from 'leaflet.offline';
import { Control, Map } from 'leaflet';
import debounce from 'debounce';
import storageLayer from './storageLayer';
import './style.css';

const urlTemplate = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const leafletMap = new Map('map');

// offline baselayer, will use offline source if available
const baseLayer = tileLayerOffline(urlTemplate, {
  attribution: 'Map data {attribution.OpenStreetMap}',
  subdomains: 'abc',
  minZoom: 13,
}).addTo(leafletMap);

// add buttons to save tiles in area viewed
const saveControl = savetiles(baseLayer, {
  zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
  alwaysDownload: false,
  confirm(status: SaveStatus, successCallback: Function) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Save ${status._tilesforSave.length}`)) {
      successCallback();
    }
  },
  confirmRemoval(status: SaveStatus, successCallback: Function) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Remove all the tiles?')) {
      successCallback();
    }
  },
  saveText: '<i class="fa fa-download" title="Save tiles"></i>',
  rmText: '<i class="fa fa-trash" title="Remove tiles"></i>',
});
saveControl.addTo(leafletMap);

leafletMap.setView(
  {
    lat: 52.09,
    lng: 5.118,
  },
  16,
);
// layer switcher control
const layerswitcher = new Control.Layers(
  {
    'osm (offline)': baseLayer,
  },
  undefined,
  { collapsed: false },
).addTo(leafletMap);
// add storage overlay
storageLayer(baseLayer, layerswitcher);

// events while saving a tile layer
let progress: number;
let total: number;
const showProgress = debounce(() => {
  document.getElementById('progressbar')!.style.width = `${
    (progress / total) * 100
  }%`;
  document.getElementById('progressbar')!.innerHTML = progress.toString();
  if (progress === total) {
    setTimeout(
      () =>
        document.getElementById('progress-wrapper')!.classList.remove('show'),
      1000,
    );
  }
}, 10);

baseLayer.on('savestart', (e) => {
  progress = 0;
  // @ts-ignore
  total = e._tilesforSave.length;
  document.getElementById('progress-wrapper')!.classList.add('show');
  document.getElementById('progressbar')!.style.width = '0%';
});
baseLayer.on('loadtileend', () => {
  progress += 1;
  showProgress();
});
