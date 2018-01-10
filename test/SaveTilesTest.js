/* global describe, it, assert, beforeEach L */
// import sinon from 'sinon';
import '../src/ControlSaveTiles';


// set up a map
let c;
let baseLayer;
beforeEach(() => {
  const map = L.map(document.createElement('div'));
  map.setView({
    lat: 51.985,
    lng: 5,
  }, 16);
  baseLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    subdomains: 'abc', // ignored
  }).addTo(map);
  c = L.control.savetiles(baseLayer);
  c.addTo(map);
  c._rmTiles();
});

describe('control', () => {
  it('exists', () => {
    assert.ok(L.control.savetiles);
  });
  it('adds button', () => {
    const div = c.onAdd();
    assert.ok(div);
    assert.lengthOf(div.querySelectorAll('a'), 2);
  });
  it('calculates storagesize', (done) => {
    c.setStorageSize((n) => {
      assert.equal(n, 0);
      done();
    });
  });
  it('save tiles', (done) => {
    const spy = sinon.spy();
    const stub = sinon.stub(c, '_loadTile').callsFake(spy);
    baseLayer.on('savestart', (status) => {
      assert.lengthOf(status._tilesforSave, 1);
      stub.resetBehavior();
      done();
    });
    c._saveTiles();
  });
});
