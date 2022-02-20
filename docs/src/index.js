/* global L */
import { tileLayerOffline } from  'leaflet.offline';
import debounce  from 'debounce';
import { urlTemplate } from './const';
import storageLayer from './index/storageLayer';

const map = L.map('map');

// offline baselayer, will use offline source if available
const baseLayer = tileLayerOffline(
  urlTemplate, 
  {
    attribution: 'Map data {attribution.OpenStreetMap}',
    subdomains: 'abc',
    minZoom: 13,
  })
  .addTo(map);
  
// add buttons to save tiles in area viewed
const control = L.control.savetiles(baseLayer, {
  zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
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

map.setView(
  {
    lat: 52.090,
    lng: 5.118,
  },
  15,
);
// layer switcher control
const layerswitcher = L.control
  .layers({
    'osm (offline)': baseLayer,
  }, null, { collapsed: false })
  .addTo(map);
// add storage overlay
storageLayer(baseLayer, layerswitcher);

// events while saving a tile layer
let progress, total;
const showProgress = debounce(() => {
  document.getElementById('progressbar').style.width = `${(progress/total) * 100}%`;
  document.getElementById('progressbar').innerHTML = progress;  
  if(progress === total) {
    setTimeout(() => document.getElementById('progress-wrapper').classList.remove('show'), 1000);    
  }
}, 10);

baseLayer.on('savestart', (e) => {
  progress = 0;
  total = e._tilesforSave.length;
  document.getElementById('progress-wrapper').classList.add('show');  
  document.getElementById('progressbar').style.width = '0%';
});
baseLayer.on('savetileend', () => {
  progress += 1;     
  showProgress();
});
