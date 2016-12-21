/* global L */
var localforage = require('./localforage');
/*
* TODO add bool option to enable online fallback (default true)
* If false reuse tiles lower/higher zoomlevels.
 */
L.TileLayer.Offline = L.TileLayer.extend({
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
	}

});

L.tileLayer.offline = function (url, options) {
	return new L.TileLayer.Offline(url, options);
};
