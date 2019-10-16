import tilestorage, { meta as metastorage } from './localforage';
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
 * TODO!
 * @param {object} tileInfo
 * @param {string} tileInfo.key
 * @param {string} tileInfo.url
 * @param {string} tileInfo.x
 * @param {string} tileInfo.y
 * @param {string} tileInfo.z
 * @param {blob} blob
 */
export function saveTile(tileInfo, blob) {
  return tilestorage.removeItem(tileInfo.key).then(() => {
    tilestorage.setItem(tileInfo.key, blob).then(() => {
      const { z, x, y } = tileInfo;
      return metastorage.setItem(`${z}_${x}_${y}`, tileInfo);
    });
  });
}
/**
 * TODO replace logic in _saveTiles
 * @param {Object[]} tiles
 * @param {string} tiles[].url url of tile
 * @param {string} tiles[].key unique identifier of tile
 *
 */
export function storeTiles(tiles, parallel = 2) {
  console.log(tiles);
}

/**
 * Get a geojson with stored tiles
 */
function getStoredTilesAsJson() {}

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
