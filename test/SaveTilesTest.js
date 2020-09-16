/* global describe, it, assert, beforeEach L sinon */
import '../src/ControlSaveTiles';


describe('control with defaults', () => {
  let c;
  let baseLayer;
  beforeEach(() => {
    const map = L.map(document.createElement('div'));
    map.setView({
      lat: 51.985,
      lng: 5,
    }, 16);
    baseLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: 'abc',
    }).addTo(map);
    c = L.control.savetiles(baseLayer);
    c.addTo(map);
    c._rmTiles();
  });
  it('exists', () => {
    assert.ok(L.control.savetiles);
  });
  it('adds button', () => {
    const div = c.onAdd();
    assert.ok(div);
    assert.lengthOf(div.querySelectorAll('a'), 2);
  });
  it('calculates storagesize', () => c.setStorageSize().then((n) => {
    assert.equal(n, 0);
  }));
  it('_saveTiles sets status', () => {
    const stub = sinon.stub(c, '_loadTile').returns(Promise.resolve());
    const resetstub = sinon.stub(c, '_resetStatus');
    c._saveTiles();
    assert.isObject(c.status);
    assert.isTrue(resetstub.calledOnce);
    stub.resetBehavior();
    resetstub.resetBehavior();
  });
  it('_saveTiles fires savestart with _tilesforSave prop', (done) => {
    const stub = sinon.stub(c, '_loadTile').returns(Promise.resolve());
    baseLayer.on('savestart', (status) => {
      assert.lengthOf(status._tilesforSave, 1);
      stub.resetBehavior();
      done();
    });
    c._saveTiles();
  });

  it('_saveTiles calls loadTile for each tile', () => {
    const stub = sinon.stub(c, '_loadTile').returns(Promise.resolve());
    c._saveTiles();
    assert.equal(stub.callCount, 1, `_loadTile has been called ${stub.callCount} times`);
    stub.resetBehavior();
  });
});


describe('control with different options', () => {
  let map;
  let baseLayer;
  beforeEach(() => {
    map = L.map(document.createElement('div'));
    map.setView({
      lat: 51.985,
      lng: 5,
    }, 16);
    baseLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: 'abc',
    }).addTo(map);
  });
  it('_saveTiles calculates tiles for 2 zoomlevels', () => {
    const c = L.control.savetiles(baseLayer, {
      zoomlevels: [16, 17],
    });
    c.addTo(map);
    c._rmTiles();
    const stub = sinon.stub(c, '_loadTile').returns(Promise.resolve());
    c._saveTiles();
    assert.isObject(c.status);
    assert.isArray(c.status._tilesforSave);
    assert.isAbove(stub.callCount, 1);
    stub.resetBehavior();
  });
  it('_saveTiles calcs tiles for saveWhatYouSee', () => {
    const c = L.control.savetiles(baseLayer, {
      saveWhatYouSee: true,
    });
    c.addTo(map);
    c._rmTiles();
    const stub = sinon.stub(c, '_loadTile').returns(Promise.resolve());
    c._saveTiles();
    assert.isObject(c.status);
    assert.isArray(c.status._tilesforSave);
    assert.equal(stub.callCount, 4, `_loadTile has been called ${stub.callCount} times`);
    stub.resetBehavior();
  });
  it('calls confirm', () => {
    const callback = sinon.spy();
    const c = L.control.savetiles(baseLayer, {
      confirm: callback,
    });
    c.addTo(map);
    c._rmTiles();
    c._saveTiles();
    assert(callback.calledOnce);
  });
  it('does not set unkown option', () => {
    const c = L.control.savetiles(baseLayer);
    assert.throws(() => c.setOption('aslkdjnvssdfkjn', 'lkjnsdfkvljsnsdfv'));
  });
  it('does set  option', () => {
    const c = L.control.savetiles(baseLayer);
    assert.doesNotThrow(() => c.setOption('saveWhatYouSee', true));
  });
});
