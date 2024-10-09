# Leaflet.offline

This website contains some examples to get started.

## Install

```shell
npm install leaflet.offline
```

Add a map container to your html:

```html
<div id="map" style="height: 75vh"></div>
```

Add the library to your javascript (assuming you are using es6), eg:

```js
import { tileLayerOffline, savetiles } from 'leaflet.offline';

const leafletMap = new Map('map');

// offline baselayer, will use offline source if available
const baseLayer = tileLayerOffline(urlTemplate, {
  attribution: 'Map data {attribution.OpenStreetMap}',
  subdomains: 'abc',
  minZoom: 13,
}).addTo(leafletMap);

// add control to manage tiles
const saveControl = savetiles(baseLayer, {
  zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
  alwaysDownload: false,
  confirm(layer, successCallback) {
    if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
      successCallback();
    }
  },
  confirmRemoval(layer, successCallback) {
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
```
