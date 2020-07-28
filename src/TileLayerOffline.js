import L from 'leaflet';
import { getTileUrls, getTileUrl, getTile } from './TileManager';

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
const TileLayerOffline = L.TileLayer.extend(
  /** @lends  TileLayerOffline */ {
    /**
     * Create tile HTMLElement
     * @private
     * @param  {object}   coords x,y,z
     * @param  {Function} done
     * @return {HTMLElement}  img
     */
    createTile(coords, done) {
      let error;
      const tile = L.TileLayer.prototype.createTile.call(this, coords, () => {});
      const url = tile.src;
      tile.src = '';
      this.setDataUrl(coords)
        .then((dataurl) => {
          tile.src = dataurl;
          done(error, tile);
        })
        .catch(() => {
          tile.src = url;
          L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
          L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
        });
      return tile;
    },
    /**
     * dataurl from localstorage
     * @private
     * @param {object} coords x,y,z
     * @return {Promise<string>} objecturl
     */
    setDataUrl(coords) {
      return getTile(this._getStorageKey(coords))
        .then((data) => {
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
    _getStorageKey(coords) {
      return getTileUrl(this._url, {
        ...coords,
        ...this.options,
        s: this.options.subdomains['0'],
      });
    },
    /**
     * getTileUrls for single zoomlevel
     * @private
     * @param  {object} L.latLngBounds
     * @param  {number} zoom
     * @return {object[]} the tile urls, key, url, x, y, z
     */
    getTileUrls(bounds, zoom) {
      return getTileUrls(this, bounds, zoom);
    },
  },
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
L.tileLayer.offline = (url, options) => new TileLayerOffline(url, options);
