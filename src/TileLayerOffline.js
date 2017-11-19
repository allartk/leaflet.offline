import L from 'leaflet';
import localforage from './localforage';

/**
 * A layer that uses store tiles when available. Falls back to online.
 * @class
 */
const TileLayerOffline = L.TileLayer.extend(
  /** @lends  TileLayerOffline */ {
    diffZoom: 1,
    /**
     * Create tile HTMLElement
     * @param  {array}   coords [description]
     * @param  {Function} done   [description]
     * @return {HTMLElement}          [description]
     */
    createTile(coords, done) {
      const tile = document.createElement('img');

      L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile));
      L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile));

      if (this.options.crossOrigin) {
        tile.crossOrigin = '';
      }
      tile.alt = '';

      tile.setAttribute('role', 'presentation');
      this.getTileUrl(coords).then((url) => {
        tile.src = url;
      }).catch((e) => {
        throw new Error(e);
      });

      return tile;
    },
    /**
     * [description]
     * @param  {array} coords [description]
     * @return {string} url
     */
    getTileUrl(coords) {
      const $this = this;
      const p = new Promise(((resolve, reject) => {
        const url = L.TileLayer.prototype.getTileUrl.call($this, coords);
        localforage.getItem($this._getStorageKey(url)).then((data) => {
          if (data && typeof data === 'object') {
            resolve(URL.createObjectURL(data));
          }
          resolve(url);
        }).catch((e) => {
          reject(e);
        });
      }));
      return p;
    },
    /**
     * @private
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    _getStorageKey(url) {
      let key;
      const subdomainpos = this._url.indexOf('{s}');
      if (subdomainpos > 0) {
        key = url.substring(0, subdomainpos) +
        this.options.subdomains['0'] +
        url.substring(subdomainpos + 1, url.length);
      }
      return key || url;
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
   * @return {object[]} the tile urls, key, url
   */
    getTileUrls(bounds, zoom) {
      const tiles = [];
      const origurl = this._url;
      // getTileUrl uses current zoomlevel, we want to overwrite it
      this.setUrl(this._url.replace('{z}', zoom), true);
      const tileBounds = L.bounds(
        bounds.min.divideBy(this.getTileSize().x).floor(),
        bounds.max.divideBy(this.getTileSize().x).floor(),
      );
      let url;
      for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
        for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
          const tilePoint = new L.Point(i, j);
          url = L.TileLayer.prototype.getTileUrl.call(this, tilePoint);
          tiles.push({
            key: this._getStorageKey(url),
            url,
          });
        }
      }
      // restore url
      this.setUrl(origurl, true);
      return tiles;
    },
  });

/**
 *
 * @param  {string} url     [description]
 * @param  {object} options {@link http://leafletjs.com/reference-1.2.0.html#tilelayer}
 * @return {TileLayerOffline}      an instance of TileLayerOffline
 */
L.tileLayer.offline = function (url, options) {
  return new TileLayerOffline(url, options);
};
