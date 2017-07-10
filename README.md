leaflet.offline
===============

Just a modern and slim library to store image and vector tiles offline.
Easy to use in your existing projects. Take a look in the example folder and see how it works, or head
to **http://allartk.github.io/leaflet.offline/**!


## Dependencies

* [Leafletjs](http://leafletjs.com/) (version 1.0, look in releases if you use an older leaflet version)
* [localforage](https://github.com/localForage/localForage) To store the tiles
* ~~In progress: optional [Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid)~~


## Install

### Manual or Clone

Just use one of github's download methods (look under the releasestab ) and add dist/leaflet.offline.min.js in a script tag
to your page (after leaflet and localforage)

### With npm

The package and it's dependencies can also be downloaded into
your existing project with [npm](http://npmjs.com):

```
npm install leaflet.offline
```

I encourage you to a bundler like [browserify](http://browserify.org/)
to bundle all files (localforage, this script and any other you use) into one.
Require the offline script like this:

```
require('leaflet.offline');
```

Leaflet is expected to be global var L

### Run example

For running the example, you'll need to clone the project and have [gulp](http://www.gulpjs.com) globally installed.
Then, from the project root run and visit http://localhost:8080/:

```
npm install
gulp example
```

## Api

### L.control.savetiles

Show control buttons to saves tiles.



#### L.control.savetiles options

First arg of constructor is layer object to save, second is object of all optional options:

* zoomlevels: array of integers, default current zoomlevel
* position: position of the control default 'topleft'
* saveText: html to show on save button
* rmText: html to show on remove button
* maxZoom: maximum zoom level that will be reached when saving tiles with saveWhatYouSee. Default value: 19 (ignored if saveWhatYouSee is false)
* saveWhatYouSee: saves the tiles that you see on screen plus deeper zoom levels (ignores zoomLevels array if true). This feature won't work when trying to save with zoom below level 5
* confirm: a function with args layer and a callback function that should be called when user confirms download
* confirmRemoval: a function with args layer and a callback function that should be called when user confirms removal of tiles

#### L.control.savetiles methods

* setlayer: change the layer to save tiles from

### L.tileLayer.offline

Extends and has the same options as [L.TileLayer](http://leafletjs.com/reference-1.0.0.html#tilelayer).
It uses offline tiles when available and falls back to online if not. If configured to use subdomains, the key used to
store has the first defined subdomain.
The tileserver should server the tiles with a Access-Control-Allow-Origin header.

#### L.control.savetiles Events

The following events are fired by the control on the layer while saving tiles:

* savestart, start downloading tiles
* loadtileend, a tile is downloaded (eg show progress bar)
* savetileend, one tile is saved  (eg show progress bar)
* loadend, all tiles are downloaded
* tilesremoved, all tiles are removed
* saveend
* storagesize files saved in total for all layers

Each event object has the following properties:
* storagesize int
* lengthToBeSaved int
* lengthSaved int
* lengthLoaded int
* \_tilesforSave array of objects

#### L.VectorGrid.Protobuf.Offline

Work in progress

## Update from older release

Release 0.1 will use Leaflet 1.0.x, the argument for the confirm option changed in this release.

Release pre 0.1 use leaflet 0.7 (and other extra dependencies, see readme)

### Example

The layer:

```javascript
var baseLayer =  L.tileLayer.offline('http://tiles.example.nl/tiles/tiles.py/mq_proxy/{z}/{x}/{y}.jpg',
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


## Develop

Use gulp tasks. Also make sure you use eslint in your editor.
