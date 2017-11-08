(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global L */
var localforage = require('./localforage');

L.Control.SaveTiles = L.Control.extend({
	options: {
		position: 'topleft',
		saveText: '+',
		rmText: '-',
		// maximum zoom level that will be reached when saving tiles with saveWhatYouSee
		maxZoom: 19,
		// saves the tiles that you see on screen plus deeper zooms (ignores zoomLevels array if true)
		saveWhatYouSee: false,
		bounds: null,
        // optional function called before saving tiles
		'confirm': null,
		// optional function called before removing tiles
		'confirmRemoval': null
	},
	// save dl and save status
	status: {
		'storagesize': null,
		'lengthToBeSaved': null,
		'lengthSaved': null,
		'lengthLoaded': null,
		'_tilesforSave': null
	},
	initialize: function (baseLayer, options) {
		this._baseLayer = baseLayer;
		this.setStorageSize();
		L.setOptions(this, options);
	},
	/**
	 * Set storagesize prop on object init
	 * @param {Function} callback with arg number of saved files
	 */
	setStorageSize: function (callback) {
		var self = this;
		if (this.status.storagesize) {
			callback(this.status.storagesize);
			return;
		}
		localforage.length().then(function (numberOfKeys) {
			self.status.storagesize = numberOfKeys;
			self._baseLayer.fire('storagesize', self.status);
			if (callback) {
				callback(numberOfKeys);
			}
		}).catch(function (err) {
			callback(0);
			throw err;
		});
	},
	/**
	 * get number of saved files
	 * @param  {Function} callback [description]
	 */
	getStorageSize: function (callback) {
		this.setStorageSize(callback);
	},
	/**
	 * [setLayer description]
	 * @param {Object} layer [description]
	 */
	setLayer: function (layer) {
		this._baseLayer = layer;
	},
	/**
	 * set the bounds of the area to save
	 * @param {L.latLngBounds} bounds
	 */
	setBounds: function (bounds) {
		this.options.bounds = bounds;
	},
	onAdd: function () {
		var container = L.DomUtil.create('div', 'savetiles leaflet-bar'),
		options = this.options;
		this._createButton(options.saveText, 'savetiles', container, this._saveTiles);
		this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
		return container;
	},
	_createButton: function (html, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';

		L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
        // TODO enable disable on layer change map

		return link;
	},
	_saveTiles: function () {
		var bounds;
		var self = this;
		var tiles = [];
		// minimum zoom to prevent the user from saving the whole world
		var minZoom = 5;
		// current zoom or zoom options
		var zoomlevels = [];

		if (this.options.saveWhatYouSee) {
			var currentZoom = this._map.getZoom();
			if (currentZoom < minZoom) {
				throw new Error('It\'s not possible to save with zoom below level 5.');
			}
			var maxZoom = this.options.maxZoom;

			for (var zoom = currentZoom; zoom <= maxZoom; zoom++) {
				zoomlevels.push(zoom);
			}
		} else {
			zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
		}

		if(this.options.bounds){
			var latlngBounds = this.options.bounds;
		}else{
			var latlngBounds = this._map.getBounds();
		}
		for (var i in zoomlevels) {
			bounds = L.bounds(this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
				this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]));
			tiles = tiles.concat(this._baseLayer.getTileUrls(bounds, zoomlevels[i]));
		}
		this._resetStatus(tiles);
		var succescallback = function () {
			self._baseLayer.fire('savestart', self.status);
			var subdlength = self._baseLayer.getSimultaneous();
			for (var i = 0; i < subdlength; i++) {
				self._loadTile();
			}
		};
		if (this.options.confirm) {
			this.options.confirm(this.status, succescallback);
		} else {
			succescallback();
		}
	},
	_resetStatus: function (tiles) {
		this.status = {
			lengthLoaded: 0,
			lengthToBeSaved: tiles.length,
			lengthSaved: 0,
			_tilesforSave: tiles
		};
	},
    /**
     * Loop over status._tilesforSave prop till all tiles are downloaded
     * Calls _saveTile for each download
     * @param  {string} tileUrl
     * @return {void}
     */
	_loadTile: function () {
		var self = this;
		var tileUrl = self.status._tilesforSave.shift();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', tileUrl.url);
		xhr.responseType = 'blob';
		xhr.send();
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				self.status.lengthLoaded++;
				self._saveTile(tileUrl.key, this.response);
				if (self.status._tilesforSave.length > 0) {
					self._loadTile();
					self._baseLayer.fire('loadtileend', self.status);
				} else {
					self._baseLayer.fire('loadtileend', self.status);
					if (self.status.lengthLoaded === self.status.lengthToBeSaved) {
						self._baseLayer.fire('loadend', self.status);
					}
				}
			}
		};
	},
	/**
	 * [_saveTile description]
	 * @param  {string} tileUrl save key
	 * @param  {blob} blob    [description]
	 * @return {void}         [description]
	 */
	_saveTile: function (tileUrl, blob) {
		var self = this;
		localforage.removeItem(tileUrl).then(function () {
			localforage.setItem(tileUrl, blob).then(function () {
				self.status.lengthSaved++;
				self._baseLayer.fire('savetileend', self.status);
				if (self.status.lengthSaved === self.status.lengthToBeSaved) {
					self._baseLayer.fire('saveend', self.status);
					self.setStorageSize();
				}
			}).catch(function (err) {
				throw new Error(err);
			});
		}).catch(function (err) {
			throw new Error(err);
		});
	},
	_rmTiles: function () {
		var self = this;
		var successCallback = function () {
			localforage.clear().then(function () {
				self.status.storagesize = 0;
				self._baseLayer.fire('tilesremoved');
				self._baseLayer.fire('storagesize', self.status);
			});
		};
		if (this.options.confirmRemoval) {
			this.options.confirmRemoval(this.status, successCallback);
		} else {
			successCallback();
		}
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
		var p = new Promise(function (resolve, reject) {
			var url = L.TileLayer.prototype.getTileUrl.call($this, coords);
			localforage.getItem($this._getStorageKey(url)).then(function (data) {
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
	_getStorageKey: function (url) {
		var key;
		var subdomainpos = this._url.indexOf('{s}');
		if (subdomainpos > 0) {
			key = url.substring(0, subdomainpos) +
				this.options.subdomains['0'] +
				url.substring(subdomainpos + 1, url.length);
		}
		return key || url;
	},
	getSimultaneous: function () {
		return this.options.subdomains.length;
	},
	/**
	 * getTileUrls for single zoomlevel
	 * @param  {object} L.latLngBounds
	 * @param  {number} zoom
	 * @return {object[]} the tile urls, key, url
	 */
	getTileUrls: function (bounds, zoom) {
		var tiles = [];
		var origurl = this._url;
		// getTileUrl uses current zoomlevel, we want to overwrite it
		this.setUrl(this._url.replace('{z}', zoom), true);
		var tileBounds = L.bounds(
			bounds.min.divideBy(this.getTileSize().x).floor(),
			bounds.max.divideBy(this.getTileSize().x).floor());
		var url;
		for (var j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
			for (var i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
				var tilePoint = new L.Point(i, j);
				url = L.TileLayer.prototype.getTileUrl.call(this, tilePoint);
				tiles.push({
					'key': this._getStorageKey(url),
					'url': url,
				});
			}
		}
		// restore url
		this.setUrl(origurl, true);
		return tiles;

	}
});

L.tileLayer.offline = function (url, options) {
	return new L.TileLayer.Offline(url, options);
};

},{"./localforage":4}],3:[function(require,module,exports){
require('./Control.SaveTiles');
require('./TileLayer.Offline');
// require('./VectorGrid.Protobuf.Offline');

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
