/**
 * Api methods used in control and layer
 * For advanced usage
 *
 * @module TileManager
 *
 */

import { Bounds, Browser, CRS, Point, Util } from 'leaflet';
import { openDB, deleteDB, IDBPDatabase } from 'idb';
import { FeatureCollection, Polygon } from 'geojson';

export type TileInfo = {
  key: string;
  url: string;
  urlTemplate: string;
  x: number;
  y: number;
  z: number;
  createdAt: number;
};

export type StoredTile = TileInfo & { blob: Blob };

const tileStoreName = 'tileStore';
const urlTemplateIndex = 'urlTemplate';
let dbPromise: Promise<IDBPDatabase> | undefined;

export function openTilesDataBase(): Promise<IDBPDatabase> {
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = openDB('leaflet.offline', 2, {
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
  return dbPromise;
}

/**
 * @example
 * ```js
 * import { getStorageLength } from 'leaflet.offline'
 * getStorageLength().then(i => console.log(i + 'tiles in storage'))
 * ```
 */
export async function getStorageLength(): Promise<number> {
  const db = await openTilesDataBase();
  return db.count(tileStoreName);
}

/**
 * @example
 * ```js
 * import { getStorageInfo } from 'leaflet.offline'
 * getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
 * ```
 */
export async function getStorageInfo(
  urlTemplate: string,
): Promise<StoredTile[]> {
  const range = IDBKeyRange.only(urlTemplate);
  const db = await openTilesDataBase();
  return db.getAllFromIndex(tileStoreName, urlTemplateIndex, range);
}

/**
 * @example
 * ```js
 * import { downloadTile } from 'leaflet.offline'
 * downloadTile(tileInfo.url).then(blob => saveTile(tileInfo, blob))
 * ```
 */
export async function downloadTile(tileUrl: string): Promise<Blob> {
  const response = await fetch(tileUrl);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.statusText}`);
  }
  return response.blob();
}
/**
 * @example
 * ```js
 * saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
 * ```
 */
export async function saveTile(
  tileInfo: TileInfo,
  blob: Blob,
): Promise<IDBValidKey> {
  const db = await openTilesDataBase();
  return db.put(tileStoreName, {
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
  if (!area.min || !area.max) {
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
export function getStoredTilesAsJson(
  tileSize: { x: number; y: number },
  tiles: TileInfo[],
): FeatureCollection<Polygon> {
  const featureCollection: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i = 0; i < tiles.length; i += 1) {
    const topLeftPoint = new Point(
      tiles[i].x * tileSize.x,
      tiles[i].y * tileSize.y,
    );
    const bottomRightPoint = new Point(
      topLeftPoint.x + tileSize.x,
      topLeftPoint.y + tileSize.y,
    );

    const topLeftlatlng = CRS.EPSG3857.pointToLatLng(topLeftPoint, tiles[i].z);
    const botRightlatlng = CRS.EPSG3857.pointToLatLng(
      bottomRightPoint,
      tiles[i].z,
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
  const db = await openTilesDataBase();
  return db.delete(tileStoreName, key);
}

/**
 * Get single tile blob
 */
export async function getBlobByKey(key: string): Promise<Blob> {
  return (await openTilesDataBase())
    .get(tileStoreName, key)
    .then((result) => result && result.blob);
}

export async function hasTile(key: string): Promise<boolean> {
  const db = await openTilesDataBase();
  const result = await db.getKey(tileStoreName, key);
  return result !== undefined;
}

/**
 * Remove everything
 */
export async function truncate(): Promise<void> {
  return (await openTilesDataBase()).clear(tileStoreName);
}

export async function getTileImageSource(key: string, url: string) {
  const shouldUseUrl = !(await hasTile(key));
  if (shouldUseUrl) {
    return url;
  }
  const blob = await getBlobByKey(key);
  return URL.createObjectURL(blob);
}
