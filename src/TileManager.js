import L from 'leaflet';
import tilestorage, { meta as metastorage } from './localforage';

/**
 *
 * @typedef {Object} tileInfo
 * @property {string} tileInfo.key storage key
 * @property {string} tileInfo.url resolved url
 * @property {string} tileInfo.urlTemplate orig url, used to find tiles per layer
 * @property {string} tileInfo.x
 * @property {string} tileInfo.y
 * @property {string} tileInfo.z
 */

/**
 * @return Promise which resolves to int
 */
export function getStorageLength() {
  return tilestorage.length();
}

/**
 * TODO get per layer
 */
export function getStorageInfo() {
  const result = [];
  return metastorage
    .iterate((value) => {
      result.push(value);
    })
    .then(() => result);
}

/**
 *
 * @param {string} tileUrl
 */
export function downloadTile(tileUrl) {
  return fetch(tileUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.statusText}`);
    }
    return response.blob();
  });
}
/**
 * @param {tileInfo}
 * @param {blob} blob
 */
export function saveTile(tileInfo, blob) {
  return tilestorage.removeItem(tileInfo.key).then(() => {
    tilestorage.setItem(tileInfo.key, blob).then(() => {
      const { z, x, y } = tileInfo;
      const record = { ...tileInfo, createdAt: Date.now() };
      return metastorage.setItem(`${z}_${x}_${y}`, record);
    });
  });
}

/**
 * TODO key generation shoud be reusable for layer._getStorageKey
 *
 * @param {object} layer leaflet tilelayer
 * @param {object} bounds, leaflet L.latLngBounds
 * @param {number} zoom zoomlevel 0-19
 *
 * @return {Array.<tileInfo>}
 */
export function getTileUrls(layer, bounds, zoom) {
  const tiles = [];
  const tileBounds = L.bounds(
    bounds.min.divideBy(layer.getTileSize().x).floor(),
    bounds.max.divideBy(layer.getTileSize().x).floor(),
  );
  // let url;
  for (let j = tileBounds.min.y; j <= tileBounds.max.y; j += 1) {
    for (let i = tileBounds.min.x; i <= tileBounds.max.x; i += 1) {
      const tilePoint = new L.Point(i, j);
      // from TileLayer.getTileUrl
      const data = {
        r: L.Browser.retina ? '@2x' : '',
        x: i,
        y: j,
        z: zoom,
      };
      const keyData = { ...data, s: layer.options.subdomains['0'] };
      const urlData = { ...data, s: layer._getSubdomain(tilePoint) };
      tiles.push({
        key: L.Util.template(layer._url, keyData),
        url: L.Util.template(layer._url, urlData),
        z: zoom,
        x: i,
        y: j,
        urlTemplate: layer._url,
      });
    }
  }

  return tiles;
}
/**
 * Get a geojson of tile
 * TODO
 */
function getStoredTileAsJson(tileInfo) {}

/**
 * Remove tile by key
 * @param {} key
 */
function removeTile(key) {}

/**
 * Remove everything
 *
 * @return Promise
 */
export function truncate() {
  return tilestorage.clear().then(() => metastorage.clear());
}
