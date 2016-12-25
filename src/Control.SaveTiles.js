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
	setLayer: function (layer) {
		this._baseLayer = layer;
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
