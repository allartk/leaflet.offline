/* global describe, it, assert, beforeEach */
import { point, bounds } from 'leaflet';
import {
  getStorageLength,
  getTilePoints,
  saveTile,
  truncate,
} from '../src/TileManager';

describe('manage tile storage', () => {
  beforeEach(() => truncate());

  it('saves a tile', () =>
    saveTile(
      {
        url: 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
        key: 'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
        x: 33677,
        y: 21651,
        z: 16,
        urlTemplate:
          'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        createdAt: Date.now(),
      },
      new Blob(),
    ).then((r) => {
      assert.equal(
        r,
        'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
      );
    }));

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
});
