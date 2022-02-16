import './TileLayerOffline';
import './ControlSaveTiles';
import {
  getStorageInfo,
  getStorageLength,  
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
  getStorageLength,
  truncate,
  getStoredTilesAsJson,
  removeTile,
  saveTile,
};
