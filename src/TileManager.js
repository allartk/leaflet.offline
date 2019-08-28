import L from 'leaflet';
import localforage from './localforage';
/**
 * @return Promise
 */
function countStoredTiles() {
  return localforage.length();
}

function storeArea(bounds) {}
/**
 * @param {L.Layer} map leafletmap
 */
function TileManager(layer) {
  return {
    countStoredTiles,
  };
}

export default TileManager;
