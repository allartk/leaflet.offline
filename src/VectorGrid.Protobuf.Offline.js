/* global L */
// var localforage = require('./localforage');
// TODO localforage loading
if (L.VectorGrid) {
	L.VectorGrid.Protobuf.Offline = L.VectorGrid.Protobuf.extend({
		options: {
			'zoomlevels': null
		},
		_getVectorTilePromise: function (coords) {
			coords = this._getCoords(coords);
			L.VectorGrid.Protobuf.prototype._getVectorTilePromise.call(this, coords);
		},
		_getCoords: function (coords) {
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
// offset = coords.subtract(coords.floor());
				coords.z = this._tileZoom = zoom;
			}
			return coords;
		}

	});

	L.vectorGrid.protobuf.offline = function (url, options) {
		return new L.VectorGrid.Protobuf.Offline(url, options);
	};
}
