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
		var bounds;
		var tiles = [];
		// current zoom or zoom options
		var zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
		var latlngBounds = this._map.getBounds();
		for (var i in zoomlevels) {
			bounds = L.bounds(this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
				this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]));
			tiles = tiles.concat(this._baseLayer.getTileUrls(bounds, zoomlevels[i]));
		}
		// usage in confirm function
		this._tilesforSave = tiles;

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
		xhr.open('GET', tileUrl.url);
		xhr.responseType = 'blob';
		xhr.send();
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				$this._saveTile(tileUrl.key, this.response);
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
