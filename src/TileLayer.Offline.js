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
				reject('tiles should only load for offset 0');
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
