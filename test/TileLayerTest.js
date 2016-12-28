/* global describe, it, assert L */

require('../src/TileLayer.Offline.js');

describe('tilelayer', function () {
	it('exists', function () {
		assert.ok(L.tileLayer.offline);
	});
	it('creates', function () {
		var layer = L.tileLayer.offline('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png');
		assert.instanceOf(layer.getTileUrl({'z': 16, 'x': 123456, y: 123456}), Promise);
		layer.getTileUrl({'z': 16, 'x': 123456, y: 123456}).then(function (url) {
			assert.isString(url);
		});
	});
});
