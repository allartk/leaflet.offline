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
	it('calculates tiles at level 16', function () {
		var layer = L.tileLayer.offline('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png');
		var bounds = new L.Bounds(
			new L.Point(8621975, 5543267.999999999),
			new L.Point(8621275, 5542538)
		);
		var tiles = layer.getTileUrls(bounds, 16);
		assert.lengthOf(tiles, 16);
		var urls = tiles.map(function (t) { return t.url; });
		assert.include(urls, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
		var keys = tiles.map(function (t) { return t.key; });
		assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');

	});

	it('calculates tile urls,keys at level 16 with subdomains', function () {
		var layer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		var bounds = new L.Bounds(
			new L.Point(8621975, 5543267.999999999),
			new L.Point(8621275, 5542538)
		);
		var tiles = layer.getTileUrls(bounds, 16);
		assert.lengthOf(tiles, 16);
		var urls = tiles.map(function (t) { return t.url.replace(/[abc]\./, ''); });
		assert.include(urls, 'http://tile.openstreetmap.org/16/33677/21651.png');
		var keys = tiles.map(function (t) { return t.key; });
		assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
	});

	it('uses subdomains for url and not for key', function () {
		var layer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		var bounds = new L.Bounds(
			new L.Point(8621975, 5543267.999999999),
			new L.Point(8621275, 5542538)
		);
		var tiles = layer.getTileUrls(bounds, 16);
		var subs = tiles.map(function (t) { return t.url.match(/([abc])\./)['1']; });
		assert.include(subs, 'a');
		assert.include(subs, 'b');
		assert.include(subs, 'c');
		var subskeys = tiles.map(function (t) { return t.key.match(/([abc])\./)['1']; });
		assert.include(subskeys, 'a');
		assert.notInclude(subskeys, 'b');
		assert.notInclude(subskeys, 'c');
	});
});
