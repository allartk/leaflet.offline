import { Map } from 'leaflet';
import { assert } from 'chai';
import { ControlSaveTiles, savetiles } from '../src/ControlSaveTiles';
import { TileLayerOffline } from '../src/TileLayerOffline';
import * as sinon from 'sinon';

describe('control with defaults', () => {
  let saveControl: ControlSaveTiles;
  let baseLayer: TileLayerOffline;
  beforeEach(() => {
    const leafletMap = new Map(document.createElement('div'));
    leafletMap.setView(
      {
        lat: 51.985,
        lng: 5,
      },
      16,
    );
    baseLayer = new TileLayerOffline(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        subdomains: 'abc',
      },
    ).addTo(leafletMap);
    saveControl = savetiles(baseLayer, {});
    saveControl.addTo(leafletMap);
    saveControl._rmTiles();
  });
  it('exists', () => {
    assert.ok(savetiles);
  });
  it('adds button', () => {
    const div = saveControl.onAdd();
    assert.ok(div);
    assert.lengthOf(div.querySelectorAll('a'), 2);
  });
  it('calculates storagesize', () =>
    saveControl.setStorageSize().then((n) => {
      assert.equal(n, 0);
    }));
  it('_saveTiles sets status', () => {
    const stub = sinon
      .stub(saveControl, '_loadTile')
      .returns(Promise.resolve(new Blob()));
    const resetstub = sinon.stub(saveControl, '_resetStatus');
    saveControl._saveTiles();
    assert.isObject(saveControl.status);
    assert.isTrue(resetstub.calledOnce);
    stub.resetBehavior();
    resetstub.resetBehavior();
  });
  it('_saveTiles fires savestart with _tilesforSave prop', (done) => {
    const stub = sinon
      .stub(saveControl, '_loadTile')
      .returns(Promise.resolve(new Blob()));
    baseLayer.on('savestart', (status) => {
      // TODO
      // @ts-ignore
      assert.lengthOf(status._tilesforSave, 1);
      stub.resetBehavior();
      done();
    });
    saveControl._saveTiles();
  });

  it('_saveTiles calls loadTile for each tile', () => {
    const stub = sinon
      .stub(saveControl, '_loadTile')
      .returns(Promise.resolve(new Blob()));
    saveControl._saveTiles();
    assert.equal(
      stub.callCount,
      1,
      `_loadTile has been called ${stub.callCount} times`,
    );
    stub.resetBehavior();
  });
});

describe('control with different options', () => {
  let leafletMap: Map;
  let baseLayer: TileLayerOffline;
  beforeEach(() => {
    leafletMap = new Map(document.createElement('div'));
    leafletMap.setView(
      {
        lat: 51.985,
        lng: 5,
      },
      16,
    );
    baseLayer = new TileLayerOffline(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        subdomains: 'abc',
      },
    ).addTo(leafletMap);
  });
  it('_saveTiles calculates tiles for 2 zoomlevels', () => {
    const c = savetiles(baseLayer, {
      zoomlevels: [16, 17],
    });
    c.addTo(leafletMap);
    c._rmTiles();
    const stub = sinon
      .stub(c, '_loadTile')
      .returns(Promise.resolve(new Blob()));
    c._saveTiles();
    assert.isObject(c.status);
    assert.isArray(c.status._tilesforSave);
    assert.isAbove(stub.callCount, 1);
    stub.resetBehavior();
  });
  it('_saveTiles calcs tiles for saveWhatYouSee', () => {
    const c = savetiles(baseLayer, {
      saveWhatYouSee: true,
    });
    c.addTo(leafletMap);
    c._rmTiles();
    const stub = sinon
      .stub(c, '_loadTile')
      .returns(Promise.resolve(new Blob()));
    c._saveTiles();
    assert.isObject(c.status);
    assert.isArray(c.status._tilesforSave);
    assert.equal(
      stub.callCount,
      4,
      `_loadTile has been called ${stub.callCount} times`,
    );
    stub.resetBehavior();
  });
  it('calls confirm', () => {
    const callback = sinon.spy();
    const c = savetiles(baseLayer, {
      confirm: callback,
    });
    c.addTo(leafletMap);
    c._rmTiles();
    c._saveTiles();
    assert(callback.calledOnce);
  });
});
