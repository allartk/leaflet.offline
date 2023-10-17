import { Bounds, Coords, DoneCallback, TileLayer, TileLayerOptions } from 'leaflet';
import { TileInfo } from './TileManager';
export declare class TileLayerOffline extends TileLayer {
    _url: string;
    createTile(coords: Coords, done: DoneCallback): HTMLElement;
    setDataUrl(coords: {
        x: number;
        y: number;
        z: number;
    }): Promise<string>;
    /**
     * get key to use for storage
     * @private
     * @param  {string} url url used to load tile
     * @return {string} unique identifier.
     */
    _getStorageKey(coords: {
        x: number;
        y: number;
        z: number;
    }): string;
    getTileUrls(bounds: Bounds, zoom: number): TileInfo[];
}
export declare function tileLayerOffline(url: string, options: TileLayerOptions): TileLayerOffline;
