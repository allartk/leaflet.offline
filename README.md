leaflet.offline
===============

Leaflet offline layer

## Dependencies
* Leafletjs
* Jquery
* [Lazystorage](https://github.com/allartk/snippets/blob/master/js/LazyStorage.js) (included in this repo)
* [Functional tilelayer](https://github.com/ismyrnow/Leaflet.functionaltilelayer)

##Usage
Look in examples folder for details, you have to include both the control and tilelayer javascript file, as well as
the dependencies.  The geojson part is unfinished work.

The tile server needs to have an Access-Control-Allow-Origin header.

The layer:
```javascript
                var baseLayer = L.tileLayer.offline('http://branta.sovon.nl/tiles/tiles.py/mq_proxy/{z}/{x}/{y}.jpg',
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
