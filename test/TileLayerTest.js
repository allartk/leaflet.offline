/* global describe, it, L */
var assert = require('assert');

require('../src/TileLayer.Offline.js');

describe('tilelayer', function () {
	it('exists', function () {
		assert.ok(L.tileLayer.offline);
	});
});
