/**
 * Api methods used in control and layer
 * For advanced usage
 *
 * @module TileManager
 *
 */
import { Bounds, GridLayer, Point } from 'leaflet';
import { IDBPDatabase } from 'idb';
import { FeatureCollection } from 'geojson';
export type TileInfo = {
    key: string;
    url: string;
    urlTemplate: string;
    x: number;
    y: number;
    z: number;
    createdAt: number;
};
export declare function openTilesDataBase(): Promise<IDBPDatabase>;
/**
 * @example
 * ```js
 * import { getStorageLength } from 'leaflet.offline'
 * getStorageLength().then(i => console.log(i + 'tiles in storage'))
 * ```
 */
export declare function getStorageLength(): Promise<number>;
/**
 * @example
 * ```js
 * import { getStorageInfo } from 'leaflet.offline'
 * getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
 * ```
 */
export declare function getStorageInfo(urlTemplate: string): Promise<TileInfo[]>;
/**
 * @example
 * ```js
 * import { downloadTile } from 'leaflet.offline'
 * downloadTile(tileInfo.url).then(blob => saveTile(tileInfo, blob))
 * ```
 */
export declare function downloadTile(tileUrl: string): Promise<Blob>;
/**
 * @example
 * ```js
 * saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
 * ```
 */
export declare function saveTile(tileInfo: TileInfo, blob: Blob): Promise<IDBValidKey>;
export declare function getTileUrl(urlTemplate: string, data: any): string;
export declare function getTilePoints(area: Bounds, tileSize: Point): Point[];
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
export declare function getStoredTilesAsJson(layer: GridLayer, tiles: TileInfo[]): FeatureCollection;
/**
 * Remove tile by key
 */
export declare function removeTile(key: string): Promise<void>;
/**
 * Get single tile blob
 */
export declare function getBlobByKey(key: string): Promise<Blob>;
export declare function hasTile(key: string): Promise<boolean>;
/**
 * Remove everything
 */
export declare function truncate(): Promise<void>;
