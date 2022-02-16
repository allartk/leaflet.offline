import { Bounds, Coords, DomEvent, DoneCallback, TileLayer, Util } from 'leaflet';
import { getTileUrl, getTile, tileInfo, getTilePoints } from './TileManager';

/**
 * A layer that uses stored tiles when available. Falls back to online.
 *
 * @class TileLayerOffline
 * @hideconstructor
 * @example
 * const tileLayerOffline = L.tileLayer
 * .offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 *   attribution: 'Map data {attribution.OpenStreetMap}',
 *   subdomains: 'abc',
 *   minZoom: 13,
 * })
 * .addTo(map);
 */
export const TileLayerOffline = TileLayer.extend(
  /** @lends  TileLayerOffline */ {
    createTile(coords: Coords, done: DoneCallback): HTMLImageElement {
      let error;
      const tile = TileLayer.prototype.createTile.call(
        this,
        coords,
        () => {}
      );
      const url = tile.src;
      tile.src = '';
      this.setDataUrl(coords)
        .then((dataurl) => {
          tile.src = dataurl;
          done(error, tile);
        })
        .catch(() => {
          tile.src = url;
          DomEvent.on(
            tile,
            'load',
            Util.bind(this._tileOnLoad, this, done, tile)
          );
          DomEvent.on(
            tile,
            'error',
            Util.bind(this._tileOnError, this, done, tile)
          );
        });
      return tile;
    },

    setDataUrl(coords: {x: number, y: number, z: number }): Promise<string> {
      return getTile(this._getStorageKey(coords)).then((data) => {
        if (data && typeof data === 'object') {
          return URL.createObjectURL(data);
        }
        throw new Error('tile not found in storage');
      });
    },
    /**
     * get key to use for storage
     * @private
     * @param  {string} url url used to load tile
     * @return {string} unique identifier.
     */
    _getStorageKey(coords: {x: number, y: number, z: number }) {
      return getTileUrl(this._url, {
        ...coords,
        ...this.options,
        s: this.options.subdomains['0'],
      });
    },

    getTileUrls(bounds: Bounds, zoom: number): tileInfo[] {
      const tiles: tileInfo[] = [];
      const tilePoints = getTilePoints(bounds, this.getTileSize());
      for (let index = 0; index < tilePoints.length; index++) {
        const tilePoint = tilePoints[index];
        const data = {
          ...this.options,
          x: tilePoint.x,
          y: tilePoint.y,
          z: zoom,
        };
        tiles.push({
          key: getTileUrl(this._url, {
            ...data,
            s: this.options.subdomains?.[0],
          }),
          url: getTileUrl(this._url, {
            ...data,
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
    },
  }
);

/**
 * Control finished calculating storage size
 * @event storagesize
 * @memberof TileLayerOffline
 * @type {ControlStatus}
 */

/**
 * Start saving tiles
 * @event savestart
 * @memberof TileLayerOffline
 * @type {object}
 */

/**
 * Tile fetched
 * @event loadtileend
 * @memberof TileLayerOffline
 * @type {object}
 */

/**
 * All tiles fetched
 * @event loadend
 * @memberof TileLayerOffline
 * @type {object}
 */

/**
 * Tile saved
 * @event savetileend
 * @memberof TileLayerOffline
 * @type {object}
 */

/**
 * All tiles saved
 * @event saveend
 * @memberof TileLayerOffline
 * @type {object}
 */

/**
 * Tile removed
 * @event tilesremoved
 * @memberof TileLayerOffline
 * @type {object}
 */

/**
 * Leaflet tilelayer
 * @external "L.tileLayer"
 * @see {@link https://leafletjs.com/reference-1.6.0.html#tilelayer|TileLayer}
 */

/**
 * @function external:"L.tileLayer".offline
 * @param  {string} url     [description]
 * @param  {object} options {@link http://leafletjs.com/reference-1.2.0.html#tilelayer}
 * @return {TileLayerOffline}      an instance of TileLayerOffline
 */
// L.tileLayer.offline = (url, options) => new TileLayerOffline(url, options);
