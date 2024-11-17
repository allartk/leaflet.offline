import {
  Control,
  ControlOptions,
  DomEvent,
  DomUtil,
  LatLngBounds,
  bounds,
  Map,
} from 'leaflet';
import { TileLayerOffline } from './TileLayerOffline';
import {
  truncate,
  getStorageLength,
  downloadTile,
  saveTile,
  TileInfo,
  hasTile,
} from './TileManager';

export interface SaveTileOptions extends ControlOptions {
  saveText: string;
  rmText: string;
  maxZoom: number;
  saveWhatYouSee: boolean;
  bounds: LatLngBounds | null;
  confirm: ((status: SaveStatus, successCallback: Function) => void) | null;
  confirmRemoval:
    | ((status: SaveStatus, successCallback: Function) => void)
    | null;
  parallel: number;
  zoomlevels?: number[];
  alwaysDownload: boolean;
}

export interface SaveStatus {
  _tilesforSave: TileInfo[];
  storagesize: number;
  lengthToBeSaved: number;
  lengthSaved: number;
  lengthLoaded: number;
}

export class ControlSaveTiles extends Control {
  _map!: Map;

  _refocusOnMap!: DomEvent.EventHandlerFn;

  _baseLayer!: TileLayerOffline;

  options: SaveTileOptions;

  status: SaveStatus = {
    storagesize: 0,
    lengthToBeSaved: 0,
    lengthSaved: 0,
    lengthLoaded: 0,
    _tilesforSave: [],
  };

  constructor(baseLayer: TileLayerOffline, options: Partial<SaveTileOptions>) {
    super(options);
    this._baseLayer = baseLayer;
    this.setStorageSize();
    this.options = {
      ...{
        position: 'topleft',
        saveText: '+',
        rmText: '-',
        maxZoom: 19,
        saveWhatYouSee: false,
        bounds: null,
        confirm: null,
        confirmRemoval: null,
        parallel: 50,
        zoomlevels: undefined,
        alwaysDownload: true,
      },
      ...options,
    };
  }

  setStorageSize() {
    if (this.status.storagesize) {
      return Promise.resolve(this.status.storagesize);
    }
    return getStorageLength()
      .then((numberOfKeys) => {
        this.status.storagesize = numberOfKeys;
        this._baseLayer.fire('storagesize', this.status);
        return numberOfKeys;
      })
      .catch(() => 0);
  }

  getStorageSize(callback: Function) {
    this.setStorageSize().then((result) => {
      if (callback) {
        callback(result);
      }
    });
  }

  setLayer(layer: TileLayerOffline) {
    this._baseLayer = layer;
  }

  onAdd() {
    const container = DomUtil.create('div', 'savetiles leaflet-bar');
    const { options } = this;
    this._createButton(
      options.saveText,
      'savetiles',
      container,
      this._saveTiles,
    );
    this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
    return container;
  }

  _createButton(
    html: string,
    className: string,
    container: HTMLElement,
    fn: DomEvent.EventHandlerFn,
  ) {
    const link = DomUtil.create('a', className, container);
    link.innerHTML = html;
    link.href = '#';
    link.ariaRoleDescription = 'button';

    DomEvent.on(link, 'mousedown dblclick', DomEvent.stopPropagation)
      .on(link, 'click', DomEvent.stop)
      .on(link, 'click', fn, this)
      .on(link, 'click', this._refocusOnMap, this);

    return link;
  }

  _saveTiles() {
    const tiles = this._calculateTiles();
    this._resetStatus(tiles);
    const successCallback = async () => {
      this._baseLayer.fire('savestart', this.status);
      const loader = async (): Promise<void> => {
        const tile = tiles.shift();
        if (tile === undefined) {
          return Promise.resolve();
        }
        const blob = await this._loadTile(tile);
        if (blob) {
          await this._saveTile(tile, blob);
        }
        return loader();
      };
      const parallel = Math.min(tiles.length, this.options.parallel);
      for (let i = 0; i < parallel; i += 1) {
        loader();
      }
    };
    if (this.options.confirm) {
      this.options.confirm(this.status, successCallback);
    } else {
      successCallback();
    }
  }

  _calculateTiles() {
    let tiles: TileInfo[] = [];
    // minimum zoom to prevent the user from saving the whole world
    const minZoom = 5;
    // current zoom or zoom options
    let zoomlevels = [];

    if (this.options.saveWhatYouSee) {
      const currentZoom = this._map.getZoom();
      if (currentZoom < minZoom) {
        throw new Error(
          `It's not possible to save with zoom below level ${minZoom}.`,
        );
      }
      const { maxZoom } = this.options;

      for (let zoom = currentZoom; zoom <= maxZoom; zoom += 1) {
        zoomlevels.push(zoom);
      }
    } else {
      zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
    }

    const latlngBounds = this.options.bounds || this._map.getBounds();

    for (let i = 0; i < zoomlevels.length; i += 1) {
      const area = bounds(
        this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
        this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]),
      );
      tiles = tiles.concat(this._baseLayer.getTileUrls(area, zoomlevels[i]));
    }
    return tiles;
  }

  _resetStatus(tiles: TileInfo[]) {
    this.status = {
      lengthLoaded: 0,
      lengthToBeSaved: tiles.length,
      lengthSaved: 0,
      _tilesforSave: tiles,
      storagesize: this.status.storagesize,
    };
  }

  async _loadTile(tile: TileInfo) {
    let blob;
    if (
      this.options.alwaysDownload === true ||
      (await hasTile(tile.key)) === false
    ) {
      blob = await downloadTile(tile.url);
      this.status.lengthLoaded += 1;
    }
    this.status.lengthLoaded += 1;

    this._baseLayer.fire('loadtileend', this.status);
    if (this.status.lengthLoaded === this.status.lengthToBeSaved) {
      this._baseLayer.fire('loadend', this.status);
    }
    return blob;
  }

  async _saveTile(tile: TileInfo, blob: Blob): Promise<void> {
    await saveTile(tile, blob);
    this.status.lengthSaved += 1;
    this._baseLayer.fire('savetileend', this.status);
    if (this.status.lengthSaved === this.status.lengthToBeSaved) {
      this._baseLayer.fire('saveend', this.status);
      this.setStorageSize();
    }
  }

  _rmTiles() {
    const successCallback = () => {
      truncate().then(() => {
        this.status.storagesize = 0;
        this._baseLayer.fire('tilesremoved');
        this._baseLayer.fire('storagesize', this.status);
      });
    };
    if (this.options.confirmRemoval) {
      this.options.confirmRemoval(this.status, successCallback);
    } else {
      successCallback();
    }
  }
}

export function savetiles(
  baseLayer: TileLayerOffline,
  options: Partial<SaveTileOptions>,
) {
  return new ControlSaveTiles(baseLayer, options);
}

/**  @ts-ignore */
if (window.L) {
  /**  @ts-ignore */
  window.L.control.savetiles = savetiles;
}
