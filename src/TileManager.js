import L from 'leaflet';
import { openDB } from 'idb';

const tileStoreName = 'tileStore';
const urlTemplateIndex = 'urlTemplate';

const dbPromise = openDB('leaflet.offline', 1, {
  upgrade(db) {
    const tileStore = db.createObjectStore(tileStoreName, {
      keyPath: 'key',
    });
    tileStore.createIndex(urlTemplateIndex, 'urlTemplate');
    tileStore.createIndex('z', 'z');
  },
});

/**
 *
 * @typedef {Object} tileInfo
 * @property {string} key storage key
 * @property {string} url resolved url
 * @property {string} urlTemplate orig url, used to find tiles per layer
 * @property {string} x left point of tile
 * @property {string} y top point coord of tile
 * @property {string} z tile zoomlevel
 */

/**
 * @return {Promise<Number>} which resolves to int
 */
export async function getStorageLength() {
  return (await dbPromise).count(tileStoreName);
}

/**
 * @param {string} urlTemplate
 *
 * @return {Promise<tileInfo[]>}
 */
export async function getStorageInfo(urlTemplate) {
  const range = IDBKeyRange.only(urlTemplate);
  return (await dbPromise).getAllFromIndex(
    tileStoreName,
    urlTemplateIndex,
    range,
  );
}

/**
 * @param {string} tileUrl
 * @return {Promise<blob>}
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
 *
 * @return {Promise}
 */
export async function saveTile(tileInfo, blob) {
  return (await dbPromise).put(tileStoreName, {
    blob,
    ...tileInfo,
  });
}

/**
 *
 * @param {string} urlTemplate
 * @param {object} data  x, y, z, s
 * @param {string} data.s subdomain
 *
 * @returns {string}
 */
export function getTileUrl(urlTemplate, data) {
  return L.Util.template(urlTemplate, {
    ...data,
    r: L.Browser.retina ? '@2x' : '',
  });
}
/**
 * @param {object} layer leaflet tilelayer
 * @param {object} bounds
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
  for (let j = tileBounds.min.y; j <= tileBounds.max.y; j += 1) {
    for (let i = tileBounds.min.x; i <= tileBounds.max.x; i += 1) {
      const tilePoint = new L.Point(i, j);
      const data = { x: i, y: j, z: zoom };
      tiles.push({
        key: getTileUrl(layer._url, {
          ...data,
          s: layer.options.subdomains['0'],
        }),
        url: getTileUrl(layer._url, {
          ...data,
          s: layer._getSubdomain(tilePoint),
        }),
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
 * Get a geojson of tiles from one resource
 * TODO, per zoomlevel?
 *
 * @param {object} layer
 *
 * @return {object} geojson
 */
export function getStoredTilesAsJson(layer) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  return getStorageInfo(layer._url).then((results) => {
    for (let i = 0; i < results.length; i += 1) {
      if (results[i].urlTemplate !== layer._url) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const topLeftPoint = new L.Point(
        results[i].x * layer.getTileSize().x,
        results[i].y * layer.getTileSize().y,
      );
      const bottomRightPoint = new L.Point(
        topLeftPoint.x + layer.getTileSize().x,
        topLeftPoint.y + layer.getTileSize().y,
      );

      const topLeftlatlng = L.CRS.EPSG3857.pointToLatLng(
        topLeftPoint,
        results[i].z,
      );
      const botRightlatlng = L.CRS.EPSG3857.pointToLatLng(
        bottomRightPoint,
        results[i].z,
      );
      featureCollection.features.push({
        type: 'Feature',
        properties: results[i],
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [topLeftlatlng.lng, topLeftlatlng.lat],
              [botRightlatlng.lng, topLeftlatlng.lat],
              [botRightlatlng.lng, botRightlatlng.lat],
              [topLeftlatlng.lng, botRightlatlng.lat],
              [topLeftlatlng.lng, topLeftlatlng.lat],
            ],
          ],
        },
      });
    }

    return featureCollection;
  });
}

/**
 * Remove tile by key
 * @param {string} key
 *
 * @returns {Promise}
 */
export async function removeTile(key) {
  return (await dbPromise).delete(tileStoreName, key);
}

/**
 * @param {string} key
 *
 * @returns {Promise<blob>}
 */
export async function getTile(key) {
  return (await dbPromise).get(tileStoreName, key).then((result) => result.blob);
}

/**
 * Remove everything
 *
 * @return {Promise}
 */
export async function truncate() {
  return (await dbPromise).clear(tileStoreName);
}
