import L from 'leaflet';
import {
  getTileUrls, getTileUrl, getTile, downloadTile, saveTile,
} from './TileManager';

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
 *   saveOnLoad: true,
 *   downsample: true
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
      // console.log('offline createTile');
      // console.log(tile);
      const url = tile.src;
      this.setDataUrl(coords, false)
        .then((res) => {
        // console.log(`loaded specific tile {res.dataUrl}`);
          tile.src = res.dataUrl;
          done(error, tile);
        })
        .catch(() => {
        // console.log("failed to load specific tile from offline");
          tile.src = url;
          // L.DomEvent.on(tile,'error', async (e) => {
          L.DomEvent.on(tile, 'error', async () => {
          // console.log("failed to load specific tile from online")
            this.setDataUrl(coords, true)
              .then((res) => {
                // code borrows from Leaflet.TileLayer.FallBack plugin
                const { scale } = res.coords;
                const currentCoords = res.coords;
                const { originalCoords } = res.coords;
                // console.log(`Set src to ${res.dataUrl} scale ${scale} origx${originalCoords.x}`);
                tile.src = res.dataUrl;
                const tileSize = this.getTileSize();
                const { style } = tile;
                style.width = `${tileSize.x * scale}px`;
                style.height = `${tileSize.y * scale}px`;
                // Compute margins to adjust position.
                const top = (originalCoords.y - currentCoords.y * scale) * tileSize.y;
                style.marginTop = `${-top}px`;
                const left = (originalCoords.x - currentCoords.x * scale) * tileSize.x;
                style.marginLeft = `${-left}px`;

                done(error, tile);
              })
              .catch(() => {
                // console.log(`Caught setdataurl error on url ${url} `);
                // console.log(err);
                // tile.src = url;

                // L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
                L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
              });
          });

          L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
          //   L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
        });
      return tile;
    },
    /**
     * dataurl from localstorage
     * @private
     * @param {object} coords x,y,z
     * @return {Promise<string>} objecturl
     */
    setDataUrl(coords, trydownSample) {
      const key = this._getStorageKey(coords);
      if (key === undefined) {
        throw new Error('_getStorageKey returned undefined');
      }
      // eslint-disable-next-line no-console
      // else { console.log(`_getStorageKey returned ${key}`); }
      return getTile(key)
        .then((data) => {
          if (data && typeof data === 'object') {
            return { dataUrl: URL.createObjectURL(data), coords };
          }
          const newz = coords.z - 1;
          if (newz <= 1
              || newz < this.options.minZoom
              || trydownSample === false) {
            throw new Error(`tile not found in storage: ${key}`);
          } else {
            // eslint-disable-next-line no-console
            // console.log(`no offline tile at ${key}. trying coords`);
            const newcoords = {
              ...coords,
              z: newz,
              x: Math.floor(coords.x / 2),
              y: Math.floor(coords.y / 2),
              originalCoords: coords.originalCoords !== undefined ? coords.originalCoords : coords,
              scale: (coords.scale || 1) * 2,
            };
            // console.log(newcoords); // eslint-disable-line no-console
            return this.setDataUrl(newcoords);
          }
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
L.tileLayer.offline = (url, options) => new TileLayerOffline(url, options)
  .on('tileload', async (e) => {
  // console.log(e);
    if (options.saveOnLoad !== undefined && options.saveOnLoad === true) {
      const tileurl = e.tile.src;
      // console.log(tileurl); // eslint-disable-line no-console
      if (tileurl.startsWith('blob:')) {
        // console.log(`Already loaded ${tileurl}`); // eslint-disable-line no-console
        // console.log(e); // eslint-disable-line no-console
      } else {
      // debugger;
      // key for blob is url with first subdomain
        const newkey = tileurl.replace(/^https:\/\/.?/i, `https://${options.subdomains['0']}`);
        const tile = {
          key: newkey,
          url: tileurl,
          z: e.coords.z,
          x: e.coords.x,
          y: e.coords.y,
          urlTemplate: url,
        };

        // console.log(`downloading tile ${tileurl}`);
        await downloadTile(tileurl).then((blob) => {
          saveTile(tile, blob);
          // console.log('saved tile'); // eslint-disable-line no-console
        });
      }
    }
  });
