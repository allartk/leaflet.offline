(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global L */
var localforage = require('./localforage');
/**
 * inspired by control.zoom
 * options are position (string), saveText (string) ,rmText (string), confirm (function)
 */

L.Control.SaveTiles = L.Control.extend({
    // TODO add zoom level to save
	options: {
		position: 'topleft',
		saveText: '+',
		rmText: '-',
        // optional function called before saving tiles
		'confirm': null
	},
	initialize: function (baseLayer, options) {
		this._baseLayer = baseLayer;
		L.setOptions(this, options);
	},
	onAdd: function () {
		var container = L.DomUtil.create('div', 'savetiles leaflet-bar'),
		options = this.options;
		this._createButton(options.saveText, 'Save tiles', 'savetiles', container, this._saveTiles);
		this._createButton(options.rmText, 'Remove tiles', 'rmtiles', container, this._rmTiles);
		return container;
	},
	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
        // TODO enable disable on layer change map

		return link;
	},
	_saveTiles: function () {
        // zoom levels we are going to save
		if (!this._zoomsforSave) {
			this._zoomsforSave = [];
			this._tilesforSave = [];
		}
		var tileSize = this._baseLayer.getTileSize().x;
		var bounds, zoom;
		// current zoom or zoom options
		if (!this.options.zoomlevels) {
			bounds = this._map.getPixelBounds();
			zoom = this._map.getZoom();
		} else {
			zoom = this.options.zoomlevels[this._zoomsforSave.length];
			var latlngBounds = this._map.getBounds();
			bounds = L.bounds(this._map.project(latlngBounds.getNorthWest(), zoom), this._map.project(latlngBounds.getSouthEast(), zoom));
		}
		var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize).floor(),
            bounds.max.divideBy(tileSize).floor());

		this._zoomsforSave.push(zoom);
		for (var j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
			for (var i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
				var tilePoint = new L.Point(i, j);
				tilePoint.z = zoom;
				this._tilesforSave.push(L.TileLayer.prototype.getTileUrl.call(this._baseLayer, tilePoint));
			}
		}
		if (this.options.zoomlevels && (this._zoomsforSave.length < this.options.zoomlevels.length)) {
			this._saveTiles();
			return;
		}
        // unset zoomlevels to save
		delete this._zoomsforSave;
		var self = this;
		var succescallback = function () {
			self._baseLayer.fire('savestart', self);
			self._loadTile(self._tilesforSave.shift());
		};
		if (this.options.confirm) {
			this.options.confirm(this, succescallback);
		} else {
			succescallback();
		}
	},
    /**
     * Download tile blob and save function after download
     * TODO, call with array of urls and download them all at once using fetch
     * @param  {string} tileUrl
     * @return {void}
     */
	_loadTile: function (tileUrl) {
		var $this = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', tileUrl);
		xhr.responseType = 'blob';
		xhr.send();
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				$this._saveTile(tileUrl, this.response);
				if ($this._tilesforSave.length > 0) {
					$this._loadTile($this._tilesforSave.shift());
					$this._baseLayer.fire('loadtileend');
				} else {
					$this._baseLayer.fire('loadtileend');
					$this._baseLayer.fire('loadend');
				}
			}
		};
	},
	_saveTile: function (tileUrl, blob) {
		var self = this;
		localforage.removeItem(tileUrl).then(function () {
			localforage.setItem(tileUrl, blob).then(function () {
				self._baseLayer.fire('savetileend', self);
			}).catch(function (err) {
				throw new Error(err);
			});
		}).catch(function (err) {
			throw new Error(err);
		});
	},
	onRemove: function () {

	},
	_rmTiles: function () {
		var $this = this;
		localforage.clear().then(function () {
			$this._baseLayer.fire('tilesremoved');
		});
	}
});

L.control.savetiles = function (baseLayer, options) {
	return new L.Control.SaveTiles(baseLayer, options);
};

},{"./localforage":4}],2:[function(require,module,exports){
/* global L */
var localforage = require('./localforage');
/*
* TODO Feature add array option limit tileloading to certain zoomlevels
* If false reuse tiles lower/higher zoomlevels.
 */
L.TileLayer.Offline = L.TileLayer.extend({
	options: {
		'zoomlevels': null
	},
	diffZoom: 1,
	createTile: function (coords, done) {
		var tile = document.createElement('img');

		L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile));
		L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile));

		if (this.options.crossOrigin) {
			tile.crossOrigin = '';
		}
		tile.alt = '';

		tile.setAttribute('role', 'presentation');
		this.getTileUrl(coords).then(function (url) {
			tile.src = url;
		}).catch(function (e) {
			throw new Error(e);
		});

		return tile;
	},
	getTileUrl: function (coords) {
		var $this = this;
		var {coords, offset} = $this._findTile(coords);
		var p = new Promise(function (resolve, reject) {
			if (offset.x !== 0 || offset.y !== 0) {
				reject("tiles should only load for offset 0")
			}
			var url = L.TileLayer.prototype.getTileUrl.call($this, coords);
			localforage.getItem(url).then(function (data) {
				if (data && typeof data === 'object') {
					resolve(URL.createObjectURL(data));
				}
				resolve(url);
			}).catch(function (e) {
				reject(e);
			});
		});
		return p;
	},
	_findTile: function (coords) {
		var offset = new L.Point(0, 0);
		 if (this.options.zoomlevels) {
			for (var i in this.options.zoomlevels) {
				if (this.options.zoomlevels[i] <= coords.z) {
					var zoom = this.options.zoomlevels[i];
				}
			}
			if (!zoom) {
				return coords;
			}
			var diffZoom = this.diffZoom = (coords.z - zoom) + 1;
			coords = coords.divideBy(diffZoom);
			offset = coords.subtract(coords.floor());
			coords.z = this._tileZoom = zoom;
		}

		return {
			'coords': coords,
			'offset': offset
		};
	}

});

L.tileLayer.offline = function (url, options) {
	return new L.TileLayer.Offline(url, options);
};

},{"./localforage":4}],3:[function(require,module,exports){
require('./Control.SaveTiles');
require('./TileLayer.Offline');

},{"./Control.SaveTiles":1,"./TileLayer.Offline":2}],4:[function(require,module,exports){
(function (global){
var lf = (typeof window !== "undefined" ? window['localforage'] : typeof global !== "undefined" ? global['localforage'] : null);

lf.config({
	name: 'leaflet_offline',
	version: 1.0,
	size: 4980736,
	storeName: 'tiles',
	description: 'the tiles'
});

module.exports = lf;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3]);
