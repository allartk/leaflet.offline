import './TileLayerOffline';
import './ControlSaveTiles';
import {
  getStorageInfo,
  getStorageLength,
  getTileUrls,
  getStoredTilesAsJson,
  removeTile,
  truncate,
  downloadTile,
  saveTile,
  getTile,
} from './TileManager';

export {
  getTile,
  downloadTile,
  getStorageInfo,
  getTileUrls,
  getStorageLength,
  truncate,
  getStoredTilesAsJson,
  removeTile,
  saveTile,
};
