/* global describe, it, assert, beforeEach L */

require('../src/Control.SaveTiles.js');
var sinon = require('sinon');

// set up a map
var c, baseLayer;
beforeEach(function () {
	var map = L.map(document.createElement('div'));
	map.setView({
		lat: 51.985,
		lng: 5
	}, 16);
	baseLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		subdomains: 'abc', // ignored
	}).addTo(map);
	c = new L.control.savetiles(baseLayer);
	c.addTo(map);
	c._rmTiles();
});

describe('control', function () {
	it('exists', function () {
		assert.ok(L.control.savetiles);
	});
	it('adds button', function () {
		var div = c.onAdd();
		assert.ok(div);
		assert.lengthOf(div.querySelectorAll('a'), 2);
	});
	it('calculates storagesize', function (done) {
		c.setStorageSize(function (n) {
			assert.equal(n, 0);
			done();
		});
	});
	it('save tiles', function (done) {
		var spy = sinon.spy();
		var stub = sinon.stub(c, '_loadTile').callsFake(spy);
		baseLayer.on('savestart', function (status) {
			assert.lengthOf(status._tilesforSave, 1);
			stub.resetBehavior();
			done();

		});
		c._saveTiles();

	});

});
