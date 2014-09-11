leaflet.offline
===============

Leaflet offline layer

## Dependencies
* Leafletjs
* Jquery
* [Lazystorage](https://github.com/allartk/snippets/blob/master/js/LazyStorage.js)
* [Functional tilelayer](https://github.com/ismyrnow/Leaflet.functionaltilelayer)

##Usage
Look in examples folder. The tile server needs to have an Access-Control-Allow-Origin header.

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
