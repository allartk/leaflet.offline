import { Bounds, Point } from 'leaflet';
import { assert } from 'chai';
import { TileLayerOffline } from '../src/TileLayerOffline';

describe('TileLayer.Offline', () => {
  it('createTile', () => {
    const url = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const layer = new TileLayerOffline(url);
    // @ts-ignore
    const tile = layer.createTile({ x: 123456, y: 456789, z: 16 }, () => {});
    assert.instanceOf(tile, HTMLElement);
  });
  it('get storagekey openstreetmap', () => {
    const layer = new TileLayerOffline(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    const key = layer._getStorageKey({ z: 16, x: 123456, y: 456789 });
    assert.equal(key, 'http://a.tile.openstreetmap.org/16/123456/456789.png');
  });
  it('get storagekey cartodb', () => {
    const layer = new TileLayerOffline(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    );
    const key = layer._getStorageKey({ z: 16, x: 123456, y: 456789 });
    assert.equal(
      key,
      'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/16/123456/456789.png',
    );
  });
  it('get storagekey mapbox with accessToken', () => {
    const layer = new TileLayerOffline(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        id: 'mapbox.streets',
        accessToken: 'xyz',
      },
    );
    const key = layer._getStorageKey({ z: 16, x: 123456, y: 456789 });
    assert.equal(
      key,
      'https://api.tiles.mapbox.com/v4/mapbox.streets/16/123456/456789.png?access_token=xyz',
    );
  });
  it('calculates tiles at level 16', () => {
    const layer = new TileLayerOffline(
      'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    const bounds = new Bounds(
      new Point(8621975, 5543267.999999999),
      new Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map((t) => t.url);
    assert.include(urls, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map((t) => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });

  it('calculates tile urls,keys at level 16 with subdomains', () => {
    const layer = new TileLayerOffline(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    const bounds = new Bounds(
      new Point(8621975, 5543267.999999999),
      new Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map((t) => t.url.replace(/[abc]\./, ''));
    assert.include(urls, 'http://tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map((t) => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });

  it('uses subdomains for url and not for key', () => {
    const layer = new TileLayerOffline(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    const bounds = new Bounds(
      new Point(8621975, 5543267.999999999),
      new Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    const subs = tiles.map((t) => t.url.match(/([abc])\./)?.[1]);
    assert.include(subs, 'a');
    assert.include(subs, 'b');
    assert.include(subs, 'c');
    const subskeys = tiles.map((t) => t.key.match(/([abc])\./)?.[1]);
    assert.include(subskeys, 'a');
    assert.notInclude(subskeys, 'b');
    assert.notInclude(subskeys, 'c');
  });

  it('calculates openstreetmap tiles at level 16', () => {
    const layer = new TileLayerOffline(
      'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    const bounds = new Bounds(
      new Point(8621975, 5543267.999999999),
      new Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map((t) => t.url);
    assert.include(urls, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map((t) => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });

  it('calculates mobox tiles at level 16', () => {
    const layer = new TileLayerOffline(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        id: 'mapbox.streets',
        accessToken: 'xyz',
      },
    );
    const bounds = new Bounds(
      new Point(8621975, 5543267.999999999),
      new Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map((t) => t.url);
    assert.include(
      urls,
      'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
    );
    const keys = tiles.map((t) => t.key);
    assert.include(
      keys,
      'https://api.tiles.mapbox.com/v4/mapbox.streets/16/33677/21651.png?access_token=xyz',
    );
  });
});
