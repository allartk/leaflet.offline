import { Control, ControlOptions, DomEvent, LatLngBounds, Map } from 'leaflet';
import { TileLayerOffline } from './TileLayerOffline';
import { TileInfo } from './TileManager';
export interface SaveTileOptions extends ControlOptions {
    saveText: string;
    rmText: string;
    maxZoom: number;
    saveWhatYouSee: boolean;
    bounds: LatLngBounds | null;
    confirm: Function | null;
    confirmRemoval: Function | null;
    parallel: number;
    zoomlevels: number[] | undefined;
    alwaysDownload: boolean;
}
export interface SaveStatus {
    _tilesforSave: TileInfo[];
    storagesize: number;
    lengthToBeSaved: number;
    lengthSaved: number;
    lengthLoaded: number;
}
export declare class ControlSaveTiles extends Control {
    _map: Map;
    _refocusOnMap: DomEvent.EventHandlerFn;
    _baseLayer: TileLayerOffline;
    options: SaveTileOptions;
    status: SaveStatus;
    constructor(baseLayer: TileLayerOffline, options: Partial<SaveTileOptions>);
    setStorageSize(): Promise<number>;
    getStorageSize(callback: Function): void;
    setLayer(layer: TileLayerOffline): void;
    onAdd(): HTMLDivElement;
    _createButton(html: string, className: string, container: HTMLElement, fn: DomEvent.EventHandlerFn): HTMLAnchorElement;
    _saveTiles(): void;
    _calculateTiles(): TileInfo[];
    _resetStatus(tiles: TileInfo[]): void;
    _loadTile(tile: TileInfo): Promise<Blob | undefined>;
    _saveTile(tile: TileInfo, blob: Blob): Promise<void>;
    _rmTiles(): void;
}
export declare function savetiles(baseLayer: TileLayerOffline, options: Partial<SaveTileOptions>): ControlSaveTiles;
