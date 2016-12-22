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
		coords = $this._findTile(coords);
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
	},
	_findTile: function (coords) {
		// TODO
		 if (this.options.zoomlevels) {
			for (var i in this.options.zoomlevels) {
				if (this.options.zoomlevels[i] >= coords.z) {
					var zoom = this.options.zoomlevels[i];
				}
			}
			var pixelcoords = new L.Point(coords.x, coords.y).multiplyBy(this.getTileSize().x);
			var latlng = this._map.unproject(pixelcoords, coords.z);
			// console.log(coords);
			coords = this._map.project(latlng, zoom).divideBy(this.getTileSize().x).round();
			coords.z = this._tileZoom = zoom;
			console.log(coords);

		}
		return coords;
	}

});

L.tileLayer.offline = function (url, options) {
	return new L.TileLayer.Offline(url, options);
};
