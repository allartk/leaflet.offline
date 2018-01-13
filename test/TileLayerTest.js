/* global describe, it, assert L */

import '../src/TileLayerOffline';

describe('TileLayer.Offline', () => {
  it('exists', () => {
    assert.ok(L.tileLayer.offline);
  });
  it('get getTileUrl', () => {
    const layer = L.tileLayer.offline('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png');
    layer._tileZoom = 16;
    assert.instanceOf(layer.setDataUrl({ x: 123456, y: 456789 }), Promise);
  });
  it('createTile', () => {
    const url = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const layer = L.tileLayer.offline(url);
    const tile = layer.createTile({ x: 123456, y: 456789 });
    assert.instanceOf(tile, HTMLElement);
  });
  it('get storagekey openstreetmap', () => {
    const layer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    const key = layer._getStorageKey('http://b.tile.openstreetmap.org/16/123456/456789.png');
    assert.equal(key, 'http://a.tile.openstreetmap.org/16/123456/456789.png');
  });
  it('get storagekey cartodb', () => {
    const layer = L.tileLayer.offline('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png');
    const key = layer._getStorageKey('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/16/123456/456789.png');
    assert.equal(key, 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/16/123456/456789.png');
  });
  it('calculates tiles at level 16', () => {
    const layer = L.tileLayer.offline('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png');
    const bounds = new L.Bounds(
      new L.Point(8621975, 5543267.999999999),
      new L.Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map(t => t.url);
    assert.include(urls, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map(t => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });

  it('calculates tile urls,keys at level 16 with subdomains', () => {
    const layer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    const bounds = new L.Bounds(
      new L.Point(8621975, 5543267.999999999),
      new L.Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    assert.lengthOf(tiles, 16);
    const urls = tiles.map(t => t.url.replace(/[abc]\./, ''));
    assert.include(urls, 'http://tile.openstreetmap.org/16/33677/21651.png');
    const keys = tiles.map(t => t.key);
    assert.include(keys, 'http://a.tile.openstreetmap.org/16/33677/21651.png');
  });

  it('uses subdomains for url and not for key', () => {
    const layer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    const bounds = new L.Bounds(
      new L.Point(8621975, 5543267.999999999),
      new L.Point(8621275, 5542538),
    );
    const tiles = layer.getTileUrls(bounds, 16);
    const subs = tiles.map(t => t.url.match(/([abc])\./)['1']);
    assert.include(subs, 'a');
    assert.include(subs, 'b');
    assert.include(subs, 'c');
    const subskeys = tiles.map(t => t.key.match(/([abc])\./)['1']);
    assert.include(subskeys, 'a');
    assert.notInclude(subskeys, 'b');
    assert.notInclude(subskeys, 'c');
  });
});
