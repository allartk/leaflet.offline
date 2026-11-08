import { Map } from 'leaflet';
import { assert } from 'chai';
import { ControlSaveTiles, savetiles } from '../src/ControlSaveTiles';
import { TileLayerOffline } from '../src/TileLayerOffline';
import * as sinon from 'sinon';
import fetchMock from 'fetch-mock';
import { hasTile, saveTile } from '../src/TileManager';

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

describe('saving tiles with failures', () => {
  let leafletMap: Map;
  let baseLayer: TileLayerOffline;
  let saveControl: ControlSaveTiles;
  const saveended = () =>
    new Promise<void>((resolve) => {
      baseLayer.once('saveend', () => resolve());
    });
  beforeEach(() => {
    fetchMock.mockGlobal();
    leafletMap = new Map(document.createElement('div'));
    leafletMap.setView({ lat: 51.985, lng: 5 }, 16);
    baseLayer = new TileLayerOffline(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { subdomains: 'abc' },
    ).addTo(leafletMap);
    // 4 tiles: zoomlevels 16 to 19
    saveControl = savetiles(baseLayer, {
      saveWhatYouSee: true,
      parallel: 1,
    });
    saveControl.addTo(leafletMap);
    saveControl._rmTiles();
  });
  afterEach(() => {
    fetchMock.removeRoutes();
    fetchMock.unmockGlobal();
  });

  it('continues with the remaining tiles after a failed download', async () => {
    let requests = 0;
    fetchMock.route('begin:http://', () => {
      requests += 1;
      return requests === 1 ? 504 : new Blob();
    });
    const ended = saveended();
    saveControl._saveTiles();
    await ended;
    assert.equal(requests, 4);
    assert.equal(saveControl.status.lengthSaved, 3);
  });
  it('fires saveend with lengthFailed after a partial failure', async () => {
    fetchMock.route('begin:http://', 504);
    const ended = saveended();
    saveControl._saveTiles();
    await ended;
    const { status } = saveControl;
    assert.equal(status.lengthToBeSaved, 4);
    assert.equal(status.lengthSaved, 0);
    assert.equal(status.lengthFailed, 4);
  });
  it('fires saveend when some tiles are already stored', async () => {
    saveControl.options.alwaysDownload = false;
    const [stored] = saveControl._calculateTiles();
    await saveTile(stored, new Blob());
    assert.isTrue(await hasTile(stored.key));
    fetchMock.route('begin:http://', new Blob());
    const ended = saveended();
    saveControl._saveTiles();
    await ended;
    const { status } = saveControl;
    assert.equal(status.lengthSkipped, 1);
    assert.equal(status.lengthSaved, 3);
    assert.equal(status.lengthFailed, 0);
  });
  it('fires saveend once and has no unhandled rejection', async () => {
    const rejections: PromiseRejectionEvent[] = [];
    // only the failed downloads, not unrelated rejections from the map's tiles
    const onRejection = (e: PromiseRejectionEvent) => {
      if (/Request failed/.test(String(e.reason))) {
        rejections.push(e);
      }
    };
    window.addEventListener('unhandledrejection', onRejection);
    fetchMock.route('begin:http://', 504);
    const saveendSpy = sinon.spy();
    baseLayer.on('saveend', saveendSpy);
    const ended = saveended();
    saveControl._saveTiles();
    await ended;
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    window.removeEventListener('unhandledrejection', onRejection);
    assert.lengthOf(rejections, 0);
    assert.isTrue(saveendSpy.calledOnce);
  });
});
