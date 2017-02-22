/* global describe, it, assert L */

require('../src/Control.SaveTiles.js');

describe('control', function () {
	it('exists', function () {
		assert.ok(L.control.savetiles);
	});
	it('adds button', function () {
		var c = new L.control.savetiles();
		var div = c.onAdd();
		assert.ok(div);
		assert.lengthOf(div.querySelectorAll('a'), 2);
	});

});
