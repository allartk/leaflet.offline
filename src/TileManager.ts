/**
 * Api methods used in control and layer
 * For advanced usage
 *
 * @module TileManager
 *
 */

import { bounds, Bounds, Browser, GridLayer, Point, TileLayer, Util } from 'leaflet';
import { openDB, deleteDB } from 'idb';

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

type tileInfo = {
  key: string,
  url: string,
  urlTemplate: string,
  x: Number,
  y: Number,
  z: Number,
  createdAt: Number
}

/**
 * @example
 * ```js
 * import { getStorageLength } from 'leaflet.offline'
 * getStorageLength().then(i => console.log(i + 'tiles in storage'))
 * ``` 
 */
export async function getStorageLength(): Promise<Number> {
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

export function getTileUrl(urlTemplate: string, data: {x: string, y: string, z: Number, s: string }): string {
  return Util.template(urlTemplate, {
    ...data,
    r: Browser.retina ? '@2x' : '',
  });
}
/**
 * @example
 * const p1 = L.point(10, 10)
 * const p2 = L.point(40, 60)
 * getTileUrls(layer, L.bounds(p1,p2), 12)
 * 
 */
export function getTileUrls(layer: TileLayer, area: Bounds, zoom: Number): tileInfo[] {
  const tiles: tileInfo[] = [];
  if(!area.min || !area.max) {
    return tiles;
  }
  const tileBounds = bounds(
    area.min.divideBy(layer.getTileSize().x).floor(),
    area.max.divideBy(layer.getTileSize().x).floor()
  );
  for (let j = tileBounds.min?.y; j <= tileBounds.max.y; j += 1) {
    for (let i = tileBounds.min?.x; i <= tileBounds.max.x; i += 1) {
      const tilePoint = new Point(i, j);
      const data = {
        ...layer.options,
        x: i,
        y: j,
        z: zoom,
      };
      tiles.push({
        key: getTileUrl(layer._url, {
          ...data,
          s: layer.options.subdomains[0],
        }),
        url: getTileUrl(layer._url, {
          ...data,
          s: layer._getSubdomain(tilePoint),
        }),
        z: zoom,
        x: i,
        y: j,
        urlTemplate: layer._url,
        createdAt: Date.now(),
      });
    }
  }

  return tiles;
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
export function getStoredTilesAsJson(layer: GridLayer, tiles: tileInfo[]): object {
  const featureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i = 0; i < tiles.length; i += 1) {
    const topLeftPoint = new L.Point(
      tiles[i].x * layer.getTileSize().x,
      tiles[i].y * layer.getTileSize().y
    );
    const bottomRightPoint = new L.Point(
      topLeftPoint.x + layer.getTileSize().x,
      topLeftPoint.y + layer.getTileSize().y
    );

    const topLeftlatlng = L.CRS.EPSG3857.pointToLatLng(
      topLeftPoint,
      tiles[i].z
    );
    const botRightlatlng = L.CRS.EPSG3857.pointToLatLng(
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
