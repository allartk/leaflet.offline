leaflet.offline
===============

Leaflet offline layer

## Dependencies

* [Leafletjs](http://leafletjs.com/)
* Jquery
* [localforage](https://github.com/localForage/localForage)
* [Functional tilelayer](https://github.com/ismyrnow/Leaflet.functionaltilelayer)

The last two will be installed if you use `npm install`.


## Install

### Manual

Just use one of github's download methods. Make sure you include
all the dependencies in your page too.

### With npm

The package and it's dependencies can be downloaded with [npm](http://npmjs.com):

```
npm install git@github.com:allartk/leaflet.offline.git
```

### Run example

For running the example, you'll need [gulp](http://www.gulpjs.com).
From the project root run and visit http://localhost:8080/:

```
gulp example
```

## Usage

Look in examples folder. You need to include the files from the dist folder, as well as the dependencies. I encourage you to use [browserify](http://browserify.org/).

The tile server you use needs to have an Access-Control-Allow-Origin header to allow tiles to be saved in the browser. To accomplish you could build a proxy.


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

See gulp task. Also make sure you use eslint in your editor.
