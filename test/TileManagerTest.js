/* global describe, it, assert L, beforeEach */
import { getTileUrls, saveTile, truncate } from '../src/TileManager';

describe('TileManager', () => {
  it('calculates openstreetmap tiles at level 16', () => {
    const layer = L.tileLayer.offline('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png');
    const bounds = new L.Bounds(
      new L.Point(8621975, 5543267.999999999),
      new L.Point(8621275, 5542538),
    );
    const tiles = getTileUrls(layer, bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map((t) => t.url);
    assert.include(urls, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map((t) => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });
  it('calculates mobox tiles at level 16', () => {
    const layer = L.tileLayer.offline('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        id: 'mapbox.streets',
        accessToken: 'xyz',
      });
    const bounds = new L.Bounds(
      new L.Point(8621975, 5543267.999999999),
      new L.Point(8621275, 5542538),
    );
    const tiles = getTileUrls(layer, bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map((t) => t.url);
    assert.include(urls, 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz');
    const keys = tiles.map((t) => t.key);
    assert.include(keys, 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz');
  });
});

describe('save tiles', () => {
  beforeEach(() => truncate());

  it('throws an Error for missing props', () => saveTile({}).catch((e) => {
    assert.equal(e.message, 'Missing urlTemplate prop');
  }));

  it('saves a tile', () => saveTile({
    url: 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
    key: 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
    x: 33677,
    y: 21651,
    z: 16,
    urlTemplate: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    createdAt: Date.now(),
  }).then((r) => {
    assert.equal(r, 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz');
  }));
});
