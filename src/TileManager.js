import localforage from './localforage';
/**
 * @return Promise which resolves to int
 */
export function getStorageLength() {
  return localforage.length();
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
  return localforage.clear();
}
