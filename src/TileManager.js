import L from 'leaflet';
import tilestorage, { meta as metastorage } from './localforage';

/**
 *
 * @typedef {Object} tileInfo
 * @property {string} tileInfo.key storage key
 * @property {string} tileInfo.url resolved url
 * @property {string} tileInfo.urlTemplate orig url, used to find tiles per layer
 * @property {string} tileInfo.x x coord of tile
 * @property {string} tileInfo.y y coord of tile
 * @property {string} tileInfo.z tile zoomlevel
 */

/**
 * @return Promise which resolves to int
 */
export function getStorageLength() {
  return tilestorage.length();
}

/**
 * Tip: you can filter the result (eg to get tiles from one resource)
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
 * resolves to blob
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
      const record = { ...tileInfo, createdAt: Date.now() };
      return metastorage.setItem(tileInfo.key, record);
    });
  });
}

/**
 *
 * @param {string} urlTemplate
 * @param {object} data  x, y, z, s
 * @param {string} data.s subdomain
 */
export function getTileUrl(urlTemplate, data) {
  return L.Util.template(urlTemplate, { ...data, r: L.Browser.retina ? '@2x' : '' });
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
        key: getTileUrl(layer._url, { ...data, s: layer.options.subdomains['0'] }),
        url: getTileUrl(layer._url, { ...data, s: layer._getSubdomain(tilePoint) }),
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
 * TODO, polygons instead of points, and per per zoomlevel?
 */
export function getStoredTilesAsJson(layer) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  return getStorageInfo().then((results) => {
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

      const topLeftlatlng = L.CRS.EPSG3857.pointToLatLng(topLeftPoint, results[i].z);
      const botRightlatlng = L.CRS.EPSG3857.pointToLatLng(bottomRightPoint, results[i].z);
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
 */
export function removeTile(key) {
  tilestorage.removeItem(key).then(() => metastorage.removeItem(key));
}

/**
 * Remove everything
 *
 * @return Promise
 */
export function truncate() {
  return tilestorage.clear().then(() => metastorage.clear());
}
