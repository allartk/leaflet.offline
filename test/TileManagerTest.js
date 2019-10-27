/* global describe, it, assert L */

import { getTileUrls } from '../src/TileManager';

describe('TileManager', () => {
  it('calculates tiles at level 16', () => {
    const layer = L.tileLayer.offline('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png');
    const bounds = new L.Bounds(
      new L.Point(8621975, 5543267.999999999),
      new L.Point(8621275, 5542538),
    );
    const tiles = getTileUrls(layer, bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map(t => t.url);
    assert.include(urls, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map(t => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });
});
