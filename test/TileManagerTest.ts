/* global describe, it, assert, beforeEach */
import { saveTile, truncate } from '../src/TileManager';

describe('save tiles', () => {
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
      new Blob()
    ).then((r) => {
      assert.equal(
        r,
        'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz'
      );
    }));
});
