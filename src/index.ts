export { tileLayerOffline } from  './TileLayerOffline';
import './ControlSaveTiles';
import {
  getStorageInfo,
  getStorageLength,  
  getStoredTilesAsJson,
  removeTile,
  truncate,
  downloadTile,
  saveTile,
  getBlobByKey,
} from './TileManager';

export {
  getBlobByKey,
  downloadTile,
  getStorageInfo,  
  getStorageLength,
  truncate,
  getStoredTilesAsJson,
  removeTile,
  saveTile,
};
