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
		saveText: '',
		rmText: '-',
        // optional function called before saving tiles
		'confirm': null
	},
	initialize: function (baseLayer, options) {
		this._baseLayer = baseLayer;
		L.setOptions(this, options);
	},
	onAdd: function (map) {
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
		var zoom;
        // zoom levels we are going to save
		if (!this._zoomsforSave) {
			this._zoomsforSave = [];
			this._tilesforSave = [];
		}
		var tileSize = this._baseLayer._getTileSize();
		if (!this.options.zoomlevels) {
			var bounds = this._map.getPixelBounds(),
			zoom = this._map.getZoom();
		}
        // todo other zoomlevels
		else {
			zoom = this.options.zoomlevels[this._zoomsforSave.length];
			var latlngBounds = this._map.getBounds();
			var bounds = L.bounds(this._map.project(latlngBounds.getNorthWest(), zoom), this._map.project(latlngBounds.getSouthEast(), zoom));
		}
		var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize).floor(),
            bounds.max.divideBy(tileSize).floor());
		this._zoomsforSave.push(zoom);
		for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
			for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
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
		if (this.options.confirm) {
			var def = $.Deferred();
			this.options.confirm.call(this, def);
			def.done(function () {
				self._baseLayer.fire('savestart', self);
				self._loadTile(self._tilesforSave.shift());
			});
		} else {
			self._baseLayer.fire('savestart', self);
			self._loadTile(self._tilesforSave.shift());
		}
	},
    // return blob in callback
	_loadTile: function (tileUrl) {
		var $this = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', tileUrl);
		xhr.responseType = 'blob';
		xhr.send();
		var $this = this;
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				$this._saveTile(tileUrl, this.response);
				if ($this._tilesforSave.length > 0) {
					$this._loadTile($this._tilesforSave.shift());
					$this._baseLayer.fire('loadtileend');
				}
                // fire some event?
				else {
					$this._baseLayer.fire('loadtileend');
					$this._baseLayer.fire('loadend');
				}
			}
		};
	},
	_saveTile: function (tileUrl, blob) {
		var $this = this;
		localforage.removeItem(tileUrl).then(function () {
			localforage.setItem(tileUrl, blob).then(function () {
				console.log(1);
			}).catch(function (err) {
				console.error(err);
			});
		}).catch(function (err) {
			console.error(err);
		});
	},
	onRemove: function () {

	},
	_rmTiles: function () {
		$this = this;
		localforage.clear().then(function () {
			$this._baseLayer.fire('tilesremoved');
		});
	}
});

L.control.savetiles = function (baseLayer, options) {
	return new L.Control.SaveTiles(baseLayer, options);
};

},{"./localforage":4}],2:[function(require,module,exports){
/* global L $ */
var localforage = require('./localforage');
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
L.TileLayer.Offline = L.TileLayer.Functional.extend({
	initialize: function (url, options) {
		var tileFunction = function (url, view) {
			var deferred = $.Deferred();
			var ObjectUrl = url
                    .replace('{z}', view.zoom)
                    .replace('{y}', view.tile.row)
                    .replace('{x}', view.tile.column)
                    .replace('{s}', view.subdomain);
			localforage.getItem(ObjectUrl).then(function (data) {
				if (data && typeof data === 'object') {
					ObjectUrl = URL.createObjectURL(data);
				}
				deferred.resolve(ObjectUrl);
			});
			return deferred.promise();
		};
		this._tileFunction = tileFunction;
		L.TileLayer.prototype.initialize.call(this, url, options);
	},
	getTileUrl: function (tilePoint) {
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
