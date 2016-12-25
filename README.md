leaflet.offline
===============

Just a modern and slim library to store image and vector tiles offline.
Easy to use in your existing projects. Take a look in the example folder and see how it works, or head
to **http://allartk.github.io/leaflet.offline/**!


## Dependencies

* [Leafletjs](http://leafletjs.com/) (version 1.0, look in releases if you use an older leaflet version)
* [localforage](https://github.com/localForage/localForage) To store the tiles
* Optional [Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid)

Leaflet should be a global var L. Localforage will be installed if you use `npm install`.

## Install

### Manual or Clone

Just use one of github's download methods and add dist/leaflet.offline.min.js in a script tag to your page (after leaflet and localforage)

### With npm

The package and it's dependencies can also be downloaded into
your existing project with [npm](http://npmjs.com):

```
npm install git+https://git@github.com:allartk/leaflet.offline.git
```

I encourage you to use [browserify](http://browserify.org/)
to bundle all files into one.


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

#### L.control.savetiles Events

The following events are fired by the control while saving tiles:

* savestart, start downloading tiles
* loadtileend, a tile is downloaded (eg show progress bar)
* savetileend, one tile is saved  (eg show progress bar)
* loadend, all tiles are downloaded
* tilesremoved, all tiles are removed

#### L.control.savetiles options

First arg of constructor is layer object to save, second is object of all optional options:

* zoomlevels: array of integers, default current zoomlevel
* position: position of the control default 'topleft'
* saveText: html to show on save button
* rmText: html to show on remove button
* confirm: a function with args layer and a callback function that should be called when user confirms download

#### L.control.savetiles methods

* setlayer: change the layer to save tiles from

#### L.tileLayer.offline

Extends and has the same options as [L.TileLayer](http://leafletjs.com/reference-1.0.0.html#tilelayer).
It uses offline tiles when available and falls back to online if not. Tile url should be identitical (including subdomain)
as stored. The tileserver should server the tiles with a Access-Control-Allow-Origin header.

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

## Develop

Use gulp tasks. Also make sure you use eslint in your editor.
