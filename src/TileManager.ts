/**
 * Api methods used in control and layer
 * For advanced usage
 *
 * @module TileManager
 *
 */

import { Bounds, Browser, CRS, GridLayer, Point, TileLayer, Util } from 'leaflet';
import { openDB, deleteDB } from 'idb';
import { FeatureCollection } from 'geojson';
import { TileLayerOffline } from './TileLayerOffline';

const tileStoreName = 'tileStore';
const urlTemplateIndex = 'urlTemplate';

const dbPromise = openDB('leaflet.offline', 2, {
  upgrade(db, oldVersion) {
    deleteDB('leaflet_offline');
    deleteDB('leaflet_offline_areas');

    if (oldVersion < 1) {
      const tileStore = db.createObjectStore(tileStoreName, {
        keyPath: 'key',
      });
      tileStore.createIndex(urlTemplateIndex, 'urlTemplate');
      tileStore.createIndex('z', 'z');
    }
  },
});

export type tileInfo = {
  key: string,
  url: string,
  urlTemplate: string,
  x: number,
  y: number,
  z: number,
  createdAt: number
}

/**
 * @example
 * ```js
 * import { getStorageLength } from 'leaflet.offline'
 * getStorageLength().then(i => console.log(i + 'tiles in storage'))
 * ``` 
 */
export async function getStorageLength(): Promise<number> {
  return (await dbPromise).count(tileStoreName);
}

/**
 * @example
 * ```js
 * import { getStorageInfo } from 'leaflet.offline'
 * getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
 * ```
 */
export async function getStorageInfo(urlTemplate: string): Promise<tileInfo[]> {
  const range = IDBKeyRange.only(urlTemplate);
  return (await dbPromise).getAllFromIndex(
    tileStoreName,
    urlTemplateIndex,
    range
  );
}

/**
 * @example
 * ```js
 * import { downloadTile } from 'leaflet.offline'
 * downloadTile(tileInfo.url).then(blob => saveTile(tileInfo, blob))
 * ``` 
 */
export async function downloadTile(tileUrl:string): Promise<Blob> {
  return fetch(tileUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.statusText}`);
    }
    return response.blob();
  });
}
/** 
 * @example
 * ```js
 * saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
 * ```
 */
export async function saveTile(tileInfo: tileInfo, blob: Blob): Promise<IDBValidKey> {
  return (await dbPromise).put(tileStoreName, {
    blob,
    ...tileInfo,
  });
}

export function getTileUrl(urlTemplate: string, data: any): string {
  return Util.template(urlTemplate, {
    ...data,
    r: Browser.retina ? '@2x' : '',
  });
}

export function getTilePoints(area: Bounds, tileSize: Point): Point[] {
  const points: Point[] = [];
  if(!area.min || !area.max) {
    return points;
  }
  const topLeftTile = area.min.divideBy(tileSize.x).floor();
  const bottomRightTile = area.max.divideBy(tileSize.x).floor();

  for (let j = topLeftTile.y; j <= bottomRightTile.y; j += 1) {
    for (let i = topLeftTile.x; i <= bottomRightTile.x; i += 1) {
      points.push(new Point(i, j));
    }
  }
  return points;
}
/**
 * Get a geojson of tiles from one resource
 *
 * @example
 * const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
 * const getGeoJsonData = () => LeafletOffline.getStorageInfo(urlTemplate)
 *  .then((data) => LeafletOffline.getStoredTilesAsJson(baseLayer, data));
 *
 * getGeoJsonData().then((geojson) => {
 *   storageLayer = L.geoJSON(geojson).bindPopup(
 *     (clickedLayer) => clickedLayer.feature.properties.key,
 *   );
 * });
 *
 */
export function getStoredTilesAsJson(layer: GridLayer, tiles: tileInfo[]): FeatureCollection {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i = 0; i < tiles.length; i += 1) {
    const topLeftPoint = new Point(
      tiles[i].x * layer.getTileSize().x,
      tiles[i].y * layer.getTileSize().y
    );
    const bottomRightPoint = new Point(
      topLeftPoint.x + layer.getTileSize().x,
      topLeftPoint.y + layer.getTileSize().y
    );

    const topLeftlatlng = CRS.EPSG3857.pointToLatLng(
      topLeftPoint,
      tiles[i].z
    );
    const botRightlatlng = CRS.EPSG3857.pointToLatLng(
      bottomRightPoint,
      tiles[i].z
    );
    featureCollection.features.push({
      type: 'Feature',
      properties: tiles[i],
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
}

/**
 * Remove tile by key
 */
export async function removeTile(key: string): Promise<void> {
  return (await dbPromise).delete(tileStoreName, key);
}

/**
 * Get single tile blob
 */
export async function getTile(key: string): Promise<Blob> {
  return (await dbPromise)
    .get(tileStoreName, key)
    .then((result) => result && result.blob);
}

/**
 * Remove everything
 */
export async function truncate(): Promise<void> {
  return (await dbPromise).clear(tileStoreName);
}
