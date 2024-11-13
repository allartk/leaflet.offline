import {
  Bounds,
  Coords,
  DomEvent,
  DoneCallback,
  TileLayer,
  TileLayerOptions,
  Util,
} from 'leaflet';
import {
  getTileUrl,
  TileInfo,
  getTilePoints,
  getTileImageSource,
} from './TileManager';

export class TileLayerOffline extends TileLayer {
  _url!: string;

  createTile(coords: Coords, done: DoneCallback): HTMLElement {
    const tile = document.createElement('img');

    DomEvent.on(tile, 'load', Util.bind(this._tileOnLoad, this, done, tile));
    DomEvent.on(tile, 'error', Util.bind(this._tileOnError, this, done, tile));

    if (this.options.crossOrigin || this.options.crossOrigin === '') {
      tile.crossOrigin =
        this.options.crossOrigin === true ? '' : this.options.crossOrigin;
    }

    tile.alt = '';

    tile.setAttribute('role', 'presentation');

    getTileImageSource(
      this._getStorageKey(coords),
      this.getTileUrl(coords),
    ).then((src) => (tile.src = src));

    return tile;
  }

  /**
   * get key to use for storage
   * @private
   * @param  {string} url url used to load tile
   * @return {string} unique identifier.
   */
  _getStorageKey(coords: { x: number; y: number; z: number }) {
    return getTileUrl(this._url, {
      ...coords,
      ...this.options,
      // @ts-ignore: Possibly undefined
      s: this.options.subdomains['0'],
    });
  }

  /**
   * Get tileinfo for zoomlevel & bounds
   */
  getTileUrls(bounds: Bounds, zoom: number): TileInfo[] {
    const tiles: TileInfo[] = [];
    const tilePoints = getTilePoints(bounds, this.getTileSize());
    for (let index = 0; index < tilePoints.length; index += 1) {
      const tilePoint = tilePoints[index];
      const data = {
        ...this.options,
        x: tilePoint.x,
        y: tilePoint.y,
        z: zoom + (this.options.zoomOffset || 0),
      };
      tiles.push({
        key: getTileUrl(this._url, {
          ...data,
          s: this.options.subdomains?.[0],
        }),
        url: getTileUrl(this._url, {
          ...data,
          // @ts-ignore: Undefined
          s: this._getSubdomain(tilePoint),
        }),
        z: zoom,
        x: tilePoint.x,
        y: tilePoint.y,
        urlTemplate: this._url,
        createdAt: Date.now(),
      });
    }
    return tiles;
  }
}

export function tileLayerOffline(url: string, options: TileLayerOptions) {
  return new TileLayerOffline(url, options);
}

/**  @ts-ignore */
if (window.L) {
  /**  @ts-ignore */
  window.L.tileLayer.offline = tileLayerOffline;
}
