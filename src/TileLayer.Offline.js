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
