import {
  Control,
  ControlOptions,
  DomEvent,
  DomUtil,
  LatLngBounds,
  setOptions,
  bounds,
} from 'leaflet';
import { TileLayerOffline } from './TileLayerOffline';
import {
  truncate,
  getStorageLength,
  downloadTile,
  saveTile,
  tileInfo,
} from './TileManager';

interface SaveTileOptions extends ControlOptions {
  saveText: string;
  rmText: string;
  maxZoom: number;
  saveWhatYouSee: boolean;
  bounds?: LatLngBounds | null;
  confirm?: Function | null;
  confirmRemoval?: Function | null;
  parallel: number;
  zoomlevels?: number[] | undefined;
}

interface SaveStatus {
  _tilesforSave: tileInfo[];
  storagesize: number;
  lengthToBeSaved: number;
  lengthSaved: number;
  lengthLoaded: number;
}

export class ControlSaveTiles extends Control {
  _baseLayer!: TileLayerOffline;
  options: SaveTileOptions = {
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
  };
  status: SaveStatus = {
    storagesize: 0,
    lengthToBeSaved: 0,
    lengthSaved: 0,
    lengthLoaded: 0,
    _tilesforSave: [],
  };
  initialize(baseLayer: TileLayerOffline, options: ControlOptions) {
    this._baseLayer = baseLayer;
    this.setStorageSize();
    setOptions(this, options);
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
      this._saveTiles
    );
    this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
    return container;
  }
  _createButton(
    html: string,
    className: string,
    container: HTMLElement,
    fn: DomEvent.EventHandlerFn
  ) {
    const link = DomUtil.create('a', className, container);
    link.innerHTML = html;
    link.href = '#';

    DomEvent.on(link, 'mousedown dblclick', DomEvent.stopPropagation)
      .on(link, 'click', DomEvent.stop)
      .on(link, 'click', fn, this)
      .on(link, 'click', this._refocusOnMap, this);

    return link;
  }
  _saveTiles() {
    let tiles: tileInfo[] = [];
    // minimum zoom to prevent the user from saving the whole world
    const minZoom = 5;
    // current zoom or zoom options
    let zoomlevels = [];

    if (this.options.saveWhatYouSee) {
      const currentZoom = this._map.getZoom();
      if (currentZoom < minZoom) {
        throw new Error("It's not possible to save with zoom below level 5.");
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
        this._map.project(latlngBounds.getSouthEast(), zoomlevels[i])
      );
      tiles = tiles.concat(this._baseLayer.getTileUrls(area, zoomlevels[i]));
    }
    this._resetStatus(tiles);
    const successCallback = async () => {
      this._baseLayer.fire('savestart', this.status);
      const loader = () => {
        if (tiles.length === 0) {
          return Promise.resolve();
        }
        const tile = tiles.shift();
        return this._loadTile(tile).then(loader);
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
  _resetStatus(tiles: tileInfo[]) {
    this.status = {
      lengthLoaded: 0,
      lengthToBeSaved: tiles.length,
      lengthSaved: 0,
      _tilesforSave: tiles,
      storagesize: this.status.storagesize,
    };
  }
  async _loadTile(tile: tileInfo) {
    const self = this;
    await downloadTile(tile.url).then((blob) => {
      self.status.lengthLoaded += 1;
      self._saveTile(tile, blob);
      self._baseLayer.fire('loadtileend', self.status);
      if (self.status.lengthLoaded === self.status.lengthToBeSaved) {
        self._baseLayer.fire('loadend', self.status);
      }
    });
  }
  _saveTile(tileInfo: tileInfo, blob: Blob) {
    // original is synchronous
    const self = this;
    saveTile(tileInfo, blob)
      .then(() => {
        self.status.lengthSaved += 1;
        self._baseLayer.fire('savetileend', self.status);
        if (self.status.lengthSaved === self.status.lengthToBeSaved) {
          self._baseLayer.fire('saveend', self.status);
          self.setStorageSize();
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
  _rmTiles() {
    const successCallback = () => {
      truncate().then(() => {
        this.status.storagesize = 0;
        this._baseLayer.fire('tilesremoved');
        this._baseLayer.fire('storagesize', self.status);
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
  options: ControlOptions
) {
  return new ControlSaveTiles(baseLayer, options);
}
