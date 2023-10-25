/* global describe, it, assert, beforeEach */
import { point, bounds, GridLayer, gridLayer } from 'leaflet';
import {
  getStorageInfo,
  getStorageLength,
  getStoredTilesAsJson,
  getTilePoints,
  hasTile,
  removeTile,
  saveTile,
  truncate,
} from '../src/TileManager';

const testTileInfo = {
  url: 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
  key: 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
  x: 33677,
  y: 21651,
  z: 16,
  urlTemplate:
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  createdAt: Date.now(),
};

describe('manage tile storage', () => {
  beforeEach(() => truncate());

  it('saves a tile', () =>
    saveTile(testTileInfo, new Blob()).then((r) => {
      assert.equal(
        r,
        'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
      );
    }));

  it('will return empty storageinfo when no tiles are stored', async () => {
    const info = await getStorageInfo(testTileInfo.urlTemplate);
    assert.lengthOf(info, 0);
  });

  it('will return storageinfo with single saved tile', async () => {
    await saveTile(testTileInfo, new Blob());
    const info = await getStorageInfo(testTileInfo.urlTemplate);
    assert.lengthOf(info, 1);
    const { blob, ...expectedInfo } = info[0];
    assert.deepEqual(expectedInfo, testTileInfo);
  });

  it('will return empty storageinfo for other url template', async () => {
    await saveTile(testTileInfo, new Blob());
    const info = await getStorageInfo(
      'http://someotherexample/{z}/{x}/{y}.png',
    );
    assert.lengthOf(info, 0);
  });

  it('will return length 0 on an empty db', async () => {
    const length = await getStorageLength();
    assert.equal(length, 0);
  });

  it('will calc tile points', () => {
    const minBound = point(0, 0);
    const maxBound = point(200, 200);
    const tilebounds = bounds(minBound, maxBound);
    const tilePoints = getTilePoints(tilebounds, point(256, 256));
    assert.lengthOf(tilePoints, 1);
  });

  it('has tile finds tile by key', async () => {
    await saveTile(testTileInfo, new Blob());
    const result = await hasTile(testTileInfo.key);
    assert.isTrue(result);
  });

  it('deletes tile finds tile by key', async () => {
    await saveTile(testTileInfo, new Blob());
    await removeTile(testTileInfo.key);
    const result = await hasTile(testTileInfo.key);
    assert.isFalse(result);
  });

  it('Creates geojson with tiles', () => {
    const layer = gridLayer();
    const json = getStoredTilesAsJson(layer, [testTileInfo]);
    assert.lengthOf(json.features, 1);
    const feature = json.features[0];
    assert.equal(feature.type, 'Feature');
    assert.equal(feature.geometry.type, 'Polygon');
    assert.lengthOf(feature.geometry.coordinates, 1);
    assert.lengthOf(feature.geometry.coordinates[0], 5);
  });
});
