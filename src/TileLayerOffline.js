import L from 'leaflet';
import localforage from './localforage';
import { getTileUrls, getTileUrl } from './TileManager';

/**
 * A layer that uses store tiles when available. Falls back to online.
 * Use this layer directly or extend it
 * @class TileLayerOffline
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
      const tile = L.TileLayer.prototype.createTile.call(this, coords, done);
      const url = tile.src;
      tile.src = '';
      this.setDataUrl(coords)
        .then((dataurl) => {
          tile.src = dataurl;
          done(error, tile);
        })
        .catch(() => {
          tile.src = url;
          done(error, tile);
        });
      return tile;
    },
    /**
     * dataurl from localstorage
     * @param {object} coords x,y,z
     * @return {Promise} resolves to base64 url
     */
    setDataUrl(coords) {
      return new Promise((resolve, reject) => {
        localforage
          .getItem(this._getStorageKey(coords))
          .then((data) => {
            if (data && typeof data === 'object') {
              resolve(URL.createObjectURL(data));
            } else {
              reject();
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * get key to use for storage
     * @private
     * @param  {string} url url used to load tile
     * @return {string} unique identifier.
     */
    _getStorageKey(coords) {
      return getTileUrl(this._url, { ...coords, s: this.options.subdomains['0'] });
    },
    /**
     * @return {number} Number of simultanous downloads from tile server
     */
    getSimultaneous() {
      return this.options.subdomains.length;
    },
    /**
     * getTileUrls for single zoomlevel
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
 * Tiles removed event
 * @event storagesize
 * @memberof TileLayerOffline
 * @type {object}
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
 * @function L.tileLayer.offline
 * @param  {string} url     [description]
 * @param  {object} options {@link http://leafletjs.com/reference-1.2.0.html#tilelayer}
 * @return {TileLayerOffline}      an instance of TileLayerOffline
 */
L.tileLayer.offline = (url, options) => new TileLayerOffline(url, options);
