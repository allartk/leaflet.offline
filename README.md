leaflet.offline
===============

Leaflet offline layer

## Dependencies
* Leafletjs
* Jquery
* [localforage](https://github.com/localForage/localForage)
* [Functional tilelayer](https://github.com/ismyrnow/Leaflet.functionaltilelayer)

the last two can be downloaded with bower, see usage.


## Usage
Look in examples folder for details, you need to include the files from the dist folder, as well as
the dependencies, which can be downloaded with [npm] (http://npmjs.com):
```
npm install
```
The tile server you use needs to have an Access-Control-Allow-Origin header to allow tiles
to be saved in the browser, you can eg build a proxy. Do not use the tile server from
the example!

The layer:
```javascript
var baseLayer =  L.tileLayer.offline('http://branta.sovon.nl/tiles/tiles.py/mq_proxy/{z}/{x}/{y}.jpg',
      {
          attribution:
                  'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ' +
                  'Map data {attribution.OpenStreetMap}',
          subdomains: '1234',
          minZoom: 13
      }
).addTo(map);
```

The control:
```javascript
L.control.savetiles(baseLayer,{
  'zoomlevels':[13,16] //optional zoomlevels to save tiles for, default current zoomlevel
    }
).addTo(map);
```
The following events are fired on the layer while saving:
* savestart, start downloading tiles
* loadtileend, a tile is downloaded (eg show progress bar)
* savetileend, one tile is saved  (eg show progress bar)
* loadend, all tiles are downloaded
* tilesremoved, all tiles are removed

The following options for the control
* zoomlevels, array of integers, default current zoomlevel
* position position of the control default 'topleft'
* saveText html to show on save button
* rmText html to show on remove button
* confirm, function that returns jquery promise
