//storage tables
var lzTiles = new LazyStorage('Leaflet',1,
    {'TileLayer':
        {
            'name': 'TileLayer'
        }
    }
);

/**
 * inspired by control.zoom
 * options are position (string), saveText (string) ,rmText (string), confirm (function)
 */
L.Control.SaveTiles = L.Control.extend({
    //TODO add zoom level to save
    options: {
        position: 'topleft',
        saveText: '',
        rmText: '-',
        //optional function called before saving tiles
        'confirm': null
    },
    initialize: function(baseLayer, options) {
        this._baseLayer = baseLayer;
        L.setOptions(this, options);
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'savetiles leaflet-bar'),
                options = this.options;
        this._createButton(options.saveText, "Save tiles", "savetiles", container, this._saveTiles);
        this._createButton(options.rmText, "Remove tiles", "rmtiles", container, this._rmTiles);
        return container;
    },
    _createButton: function(html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
        //TODO enable disable on layer change map

        return link;
    },
    _saveTiles: function() {
        var zoom;
        //zoom levels we are going to save
        if(!this._zoomsforSave) {
            this._zoomsforSave = [];
            this._tilesforSave = [];
        }
        var tileSize = this._baseLayer._getTileSize();
        if(!this.options.zoomlevels) {
            var bounds = this._map.getPixelBounds(),
                    zoom = this._map.getZoom();
        }
        //todo other zoomlevels
        else {
            zoom = this.options.zoomlevels[this._zoomsforSave.length];
            var latlngBounds = this._map.getBounds();
            var bounds = L.bounds(this._map.project(latlngBounds.getNorthWest(),zoom),this._map.project(latlngBounds.getSouthEast(),zoom));
        }
        var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize).floor(),
            bounds.max.divideBy(tileSize).floor());
        this._zoomsforSave.push(zoom);
        for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                var tilePoint = new L.Point(i, j);
                tilePoint.z = zoom;
                this._tilesforSave.push(L.TileLayer.prototype.getTileUrl.call(this._baseLayer,tilePoint));
            }
        }
        if(this.options.zoomlevels && (this._zoomsforSave.length < this.options.zoomlevels.length)) {
            this._saveTiles();
            return;
        }
        //unset zoomlevels to save
        delete this._zoomsforSave;
        var self = this;
        if(this.options.confirm) {
          var def = $.Deferred();
          this.options.confirm.call(this,def);
          def.done(function() {
            self._baseLayer.fire('savestart',self);
            self._loadTile(self._tilesforSave.shift());
          });
        }
        else {
          self._baseLayer.fire('savestart',self);
          self._loadTile(self._tilesforSave.shift());
        }
    },
    //return blob in callback
    _loadTile: function(tileUrl) {
        var $this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', tileUrl);
        xhr.responseType = 'blob';
        xhr.send();
        var $this = this;
        xhr.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){
                $this._saveTile(tileUrl,this.response);
                if($this._tilesforSave.length > 0) {
                    $this._loadTile($this._tilesforSave.shift());
                    $this._baseLayer.fire('loadtileend');
                }
                //fire some event?
                else {
                    $this._baseLayer.fire('loadtileend');
                    $this._baseLayer.fire('loadend');
                }
            }
        };
    },
    _saveTile: function(tileUrl,blob) {
        var $this = this;
        lzTiles.rm('TileLayer',{'guid':tileUrl},function(data){
            //convert blobs for webdb and old chrome!
            if(lzTiles.type == 'webDB' || (window.navigator.appVersion.indexOf('Chrome') > 0 && parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) < 39)) {
                if(!window.FileReader) {
                    alert('Not supported browser');
                    return;
                }
                var fr = new FileReader();
                fr.onloadend = function () {
                    lzTiles.save('TileLayer',{'guid':tileUrl,'image': fr.result},function(data){ $this._baseLayer.fire('savetileend'); });
                };
                fr.readAsDataURL(blob);
            }
            else {
                lzTiles.save('TileLayer',{'guid':tileUrl,'image': blob},function(data){ $this._baseLayer.fire('savetileend'); });
            }
        });
    },
    onRemove: function() {

    },
    _rmTiles: function() {
        $this = this;
        lzTiles.clear('TileLayer',function() {
            $this._baseLayer.fire('tilesremoved')
        });
    }
});

L.control.savetiles = function(baseLayer, options) {
    return new L.Control.SaveTiles(baseLayer, options);
};

// Load data tiles from an AJAX data source
L.TileLayer.Ajax = L.TileLayer.extend({
    _requests: [],
    _addTile: function (tilePoint) {
        var tile = { datum: null, processed: false };
        this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
        this._loadTile(tile, tilePoint);
    },
    // XMLHttpRequest handler; closure over the XHR object, the layer, and the tile
    _xhrHandler: function (req, layer, tile, tilePoint) {
        return function () {
            if (req.readyState !== 4) {
                return;
            }
            var s = req.status;
            if ((s >= 200 && s < 300) || s === 304) {
                tile.datum = JSON.parse(req.responseText);
                layer._tileLoaded(tile, tilePoint);
            } else {
                layer._tileLoaded(tile, tilePoint);
            }
        };
    },
    // Load the requested tile via AJAX
    _loadTile: function (tile, tilePoint) {
        this._adjustTilePoint(tilePoint);
        var layer = this;
        var req = new XMLHttpRequest();
        this._requests.push(req);
        req.onreadystatechange = this._xhrHandler(req, layer, tile, tilePoint);
        req.open('GET', this.getTileUrl(tilePoint), true);
        req.send();
    },
    _reset: function () {
        L.TileLayer.prototype._reset.apply(this, arguments);
        for (var i in this._requests) {
            this._requests[i].abort();
        }
        this._requests = [];
    },
    _update: function () {
        if (this._map._panTransition && this._map._panTransition._inProgress) { return; }
        if (this._tilesToLoad < 0) { this._tilesToLoad = 0; }
        L.TileLayer.prototype._update.apply(this, arguments);
    }
});


L.TileLayer.GeoJSON = L.TileLayer.Ajax.extend({
    // Store each GeometryCollection's layer by key, if options.unique function is present
    _keyLayers: {},

    // Used to calculate svg path string for clip path elements
    _clipPathRectangles: {},

    initialize: function (url, options, geojsonOptions) {
        L.TileLayer.Ajax.prototype.initialize.call(this, url, options);
        this.geojsonLayer = new L.GeoJSON(null, geojsonOptions);
    },
    onAdd: function (map) {
        this._map = map;
        L.TileLayer.Ajax.prototype.onAdd.call(this, map);
        map.addLayer(this.geojsonLayer);
    },
    onRemove: function (map) {
        map.removeLayer(this.geojsonLayer);
        L.TileLayer.Ajax.prototype.onRemove.call(this, map);
    },
    _reset: function () {
        this.geojsonLayer.clearLayers();
        this._keyLayers = {};
        this._removeOldClipPaths();
        L.TileLayer.Ajax.prototype._reset.apply(this, arguments);
    },

    // Remove clip path elements from other earlier zoom levels
    _removeOldClipPaths: function  () {
        for (var clipPathId in this._clipPathRectangles) {
            var clipPathZXY = clipPathId.split('_').slice(1);
            var zoom = parseInt(clipPathZXY[0], 10);
            if (zoom !== this._map.getZoom()) {
                var rectangle = this._clipPathRectangles[clipPathId];
                this._map.removeLayer(rectangle);
                var clipPath = document.getElementById(clipPathId);
                if (clipPath !== null) {
                    clipPath.parentNode.removeChild(clipPath);
                }
                delete this._clipPathRectangles[clipPathId];
            }
        }
    },

    // Recurse LayerGroups and call func() on L.Path layer instances
    _recurseLayerUntilPath: function (func, layer) {
        if (layer instanceof L.Path) {
            func(layer);
        }
        else if (layer instanceof L.LayerGroup) {
            // Recurse each child layer
            layer.getLayers().forEach(this._recurseLayerUntilPath.bind(this, func), this);
        }
    },

    _clipLayerToTileBoundary: function (layer, tilePoint) {
        // Only perform SVG clipping if the browser is using SVG
        if (!L.Path.SVG) { return; }

        var svg = this._map._pathRoot;

        // create the defs container if it doesn't exist
        var defs = null;
        if (svg.getElementsByTagName('defs').length === 0) {
            defs = document.createElementNS(L.Path.SVG_NS, 'defs');
            svg.insertBefore(defs, svg.firstChild);
        }
        else {
            defs = svg.getElementsByTagName('defs')[0];
        }

        // Create the clipPath for the tile if it doesn't exist
        var clipPathId = 'tileClipPath_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y;
        var clipPath = document.getElementById(clipPathId);
        if (clipPath === null) {
            clipPath = document.createElementNS(L.Path.SVG_NS, 'clipPath');
            clipPath.id = clipPathId;

            // Create a hidden L.Rectangle to represent the tile's area
            var tileSize = this.options.tileSize,
            nwPoint = tilePoint.multiplyBy(tileSize),
            sePoint = nwPoint.add([tileSize, tileSize]),
            nw = this._map.unproject(nwPoint),
            se = this._map.unproject(sePoint);
            this._clipPathRectangles[clipPathId] = new L.Rectangle(new L.LatLngBounds([nw, se]), {
                opacity: 0,
                fillOpacity: 0,
                clickable: false,
                noClip: true
            });
            this._map.addLayer(this._clipPathRectangles[clipPathId]);

            // Add a clip path element to the SVG defs element
            // With a path element that has the hidden rectangle's SVG path string  
            var path = document.createElementNS(L.Path.SVG_NS, 'path');
            var pathString = this._clipPathRectangles[clipPathId].getPathString();
            path.setAttribute('d', pathString);
            clipPath.appendChild(path);
            defs.appendChild(clipPath);
        }

        // Add the clip-path attribute to reference the id of the tile clipPath
        this._recurseLayerUntilPath(function (pathLayer) {
            pathLayer._container.setAttribute('clip-path', 'url(#' + clipPathId + ')');
        }, layer);
    },

    // Add a geojson object from a tile to the GeoJSON layer
    // * If the options.unique function is specified, merge geometries into GeometryCollections
    // grouped by the key returned by options.unique(feature) for each GeoJSON feature
    // * If options.clipTiles is set, and the browser is using SVG, perform SVG clipping on each
    // tile's GeometryCollection 
    addTileData: function (geojson, tilePoint) {
        var features = L.Util.isArray(geojson) ? geojson : geojson.features,
            i, len, feature;

        if (features) {
            for (i = 0, len = features.length; i < len; i++) {
                // Only add this if geometry or geometries are set and not null
                feature = features[i];
                if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
                    this.addTileData(features[i], tilePoint);
                }
            }
            return this;
        }

        var options = this.geojsonLayer.options;

        if (options.filter && !options.filter(geojson)) { return; }

        var parentLayer = this.geojsonLayer;
        var incomingLayer = null;
        if (this.options.unique && typeof(this.options.unique) === 'function') {
            var key = this.options.unique(geojson);

            // When creating the layer for a unique key,
            // Force the geojson to be a geometry collection
            if (!(key in this._keyLayers && geojson.geometry.type !== 'GeometryCollection')) {
                geojson.geometry = {
                    type: 'GeometryCollection',
                    geometries: [geojson.geometry]
                };
            }

            // Transform the geojson into a new Layer
            try {
                incomingLayer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng);
            }
            // Ignore GeoJSON objects that could not be parsed
            catch (e) {
                return this;
            }

            incomingLayer.feature = L.GeoJSON.asFeature(geojson);
            // Add the incoming Layer to existing key's GeometryCollection
            if (key in this._keyLayers) {
                parentLayer = this._keyLayers[key];
                parentLayer.feature.geometry.geometries.push(geojson.geometry);
            }
            // Convert the incoming GeoJSON feature into a new GeometryCollection layer
            else {
                this._keyLayers[key] = incomingLayer;
            }
        }
        // Add the incoming geojson feature to the L.GeoJSON Layer
        else {
            // Transform the geojson into a new layer
            try {
                incomingLayer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng);
            }
            // Ignore GeoJSON objects that could not be parsed
            catch (e) {
                return this;
            }
            incomingLayer.feature = L.GeoJSON.asFeature(geojson);
        }
        incomingLayer.defaultOptions = incomingLayer.options;

        this.geojsonLayer.resetStyle(incomingLayer);

        if (options.onEachFeature) {
            options.onEachFeature(geojson, incomingLayer);
        }
        parentLayer.addLayer(incomingLayer);

        // If options.clipTiles is set and the browser is using SVG
        // then clip the layer using SVG clipping
        if (this.options.clipTiles) {
            this._clipLayerToTileBoundary(incomingLayer, tilePoint);
        }
        return this;
    },

    _tileLoaded: function (tile, tilePoint) {
        L.TileLayer.Ajax.prototype._tileLoaded.apply(this, arguments);
        if (tile.datum === null) { return null; }
        this.addTileData(tile.datum, tilePoint);
    }
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
L.TileLayer.Offline = L.TileLayer.Functional.extend({
    initialize: function(url, options) {
        var tileFunction = function(url, view) {
            var deferred = $.Deferred();
            var ObjectUrl = url
                    .replace('{z}', view.zoom)
                    .replace('{y}', view.tile.row)
                    .replace('{x}', view.tile.column)
                    .replace('{s}', view.subdomain);
            lzTiles.get(ObjectUrl, 'TileLayer', function(data) {                
                if (data && typeof data.image === "object") {                        
                    ObjectUrl = URL.createObjectURL(data.image);                    
                }
                else if(data && typeof data.image === "string") {
                    ObjectUrl = data.image;
                }
                deferred.resolve(ObjectUrl);
            });
            return deferred.promise();
        }
        this._tileFunction = tileFunction;
        L.TileLayer.prototype.initialize.call(this, url, options);
    },
    getTileUrl: function(tilePoint) {
        var map = this._map,
                crs = map.options.crs,
                tileSize = this.options.tileSize,
                zoom = tilePoint.z,
                nwPoint = tilePoint.multiplyBy(tileSize),
                sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
                nw = crs.project(map.unproject(nwPoint, zoom)),
                se = crs.project(map.unproject(sePoint, zoom)),
                bbox = [nw.x, se.y, se.x, nw.y].join(',');

        // Setup object to send to tile function.
        var view = {
            bbox: bbox,
            width: tileSize,
            height: tileSize,
            zoom: zoom,
            tile: {
                row: this.options.tms ? this._tileNumBounds.max.y - tilePoint.y : tilePoint.y,
                column: tilePoint.x
            },
            subdomain: this._getSubdomain(tilePoint)
        };

        return this._tileFunction(this._url, view);
    }

});

L.tileLayer.offline = function(url, options) {
    return new L.TileLayer.Offline(url, options);
};

