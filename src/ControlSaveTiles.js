import L from 'leaflet';
import {
  truncate, getStorageLength, downloadTile, saveTile,
} from './TileManager';

/**
 * Status of ControlSaveTiles, keeps info about process during downloading
 * ans saving tiles. Used internal and as object for events.
 * @typedef {Object} ControlStatus
 * @property {number} storagesize total number of saved tiles.
 * @property {number} lengthToBeSaved number of tiles that will be saved in db
 * during current process
 * @property {number} lengthSaved number of tiles saved during current process
 * @property {number} lengthLoaded number of tiles loaded during current process
 * @property {array} _tilesforSave tiles waiting for processing
 */

/**
 * Shows control on map to save tiles
 * @class ControlSaveTiles
 *
 *
 * @property {ControlStatus} status
 *
 * @example
 * const controlSaveTiles = L.control.savetiles(baseLayer, {
 * zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
 * confirm(layer, succescallback) {
 *   if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
 *     succescallback();
 *   }
 * },
 * confirmRemoval(layer, successCallback) {
 *   if (window.confirm('Remove all the tiles?')) {
 *     successCallback();
 *   }
 * },
 * saveText: '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
 * rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>',
 * });
 */
const ControlSaveTiles = L.Control.extend(
  /** @lends ControlSaveTiles */ {
    options: {
      position: 'topleft',
      saveText: '+',
      rmText: '-',
      maxZoom: 19,
      saveWhatYouSee: false,
      bounds: null,
      confirm: null,
      confirmRemoval: null,
      parallel: 50,
    },
    status: {
      storagesize: null,
      lengthToBeSaved: null,
      lengthSaved: null,
      lengthLoaded: null,
      _tilesforSave: null,
    },
    /**
     * @private
     * @param  {Object} baseLayer
     * @param  {Object} options
     * @return {void}
     */
    initialize(baseLayer, options) {
      this._baseLayer = baseLayer;
      this.setStorageSize();
      L.setOptions(this, options);
    },
    /**
     * Set storagesize prop on object init
     * @return {Promise<Number>}
     * @private
     */
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
    },
    /**
     * get number of saved files
     * @param  {Function} callback [description]
     * @private
     */
    getStorageSize(callback) {
      this.setStorageSize().then((result) => {
        if (callback) {
          callback(result);
        }
      });
    },
    /**
     * Change baseLayer
     * @param {TileLayerOffline} layer
     */
    setLayer(layer) {
      this._baseLayer = layer;
    },
    /**
     * Update a config option
     * @param {string} name
     * @param {mixed} value
     */
    setOption(name, value) {
      if (this.options[name] === undefined) {
        throw new Error(`Option ${name} doe not exist`);
      }
      this.options[name] = value;
    },
    onAdd() {
      const container = L.DomUtil.create('div', 'savetiles leaflet-bar');
      const { options } = this;
      this._createButton(options.saveText, 'savetiles', container, this._saveTiles);
      this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
      return container;
    },
    _createButton(html, className, container, fn) {
      const link = L.DomUtil.create('a', className, container);
      link.innerHTML = html;
      link.href = '#';

      L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', fn, this)
        .on(link, 'click', this._refocusOnMap, this);

      return link;
    },
    /**
     * starts processing tiles
     * @private
     * @return {void}
     */
    _saveTiles() {
      let bounds;
      let tiles = [];
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
        bounds = L.bounds(
          this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
          this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]),
        );
        tiles = tiles.concat(this._baseLayer.getTileUrls(bounds, zoomlevels[i]));
      }
      this._resetStatus(tiles);
      const succescallback = async () => {
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
        this.options.confirm(this.status, succescallback);
      } else {
        succescallback();
      }
    },
    /**
     * set status prop on save init
     * @param {string[]} tiles [description]
     * @private
     */
    _resetStatus(tiles) {
      this.status = {
        lengthLoaded: 0,
        lengthToBeSaved: tiles.length,
        lengthSaved: 0,
        _tilesforSave: tiles,
      };
    },
    /**
     * Loop over status._tilesforSave prop till all tiles are downloaded
     * Calls _saveTile for each download
     * @private
     * @return {void}
     */
    _loadTile: async function _loadTile(jtile) {
      const self = this;
      const tile = jtile;
      downloadTile(tile.url).then((blob) => {
        self.status.lengthLoaded += 1;
        self._saveTile(tile, blob);
        self._baseLayer.fire('loadtileend', self.status);
        if (self.status.lengthLoaded === self.status.lengthToBeSaved) {
          self._baseLayer.fire('loadend', self.status);
        }
      });
    },

    /**
     * @private
     * @param  {object} tileInfo save key
     * @param {string} tileInfo.key
     * @param {string} tileInfo.url
     * @param {string} tileInfo.x
     * @param {string} tileInfo.y
     * @param {string} tileInfo.z
     * @param  {blob} blob    [description]
     * @return {void}         [description]
     */
    _saveTile(tileInfo, blob) { // original is synchronous
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
    },
    _rmTiles() {
      const self = this;
      const successCallback = () => {
        truncate().then(() => {
          self.status.storagesize = 0;
          self._baseLayer.fire('tilesremoved');
          self._baseLayer.fire('storagesize', self.status);
        });
      };
      if (this.options.confirmRemoval) {
        this.options.confirmRemoval(this.status, successCallback);
      } else {
        successCallback();
      }
    },
  },
);


/**
 * Leaflet control
 * @external "L.control"
 * @see {@link https://leafletjs.com/reference-1.6.0.html#control|Control}
 */


/**
 * @function external:"L.control".savetiles
 * @param  {object} baseLayer     {@link http://leafletjs.com/reference-1.2.0.html#tilelayer}
 * @property {Object} options
 * @property {string} [options.position] default topleft
 * @property {string} [options.saveText] html for save button, default +
 * @property {string} [options.rmText] html for remove button, deflault -
 * @property {number} [options.maxZoom] maximum zoom level that will be reached
 * when saving tiles with saveWhatYouSee. Default 19
 * @property {number} [options.parallel] parralel downloads (default 50)
 * @property {boolean} [options.saveWhatYouSee] save the tiles that you see
 * on screen plus deeper zooms, ignores zoomLevels options. Default false
 * @property {function} [options.confirm] function called before confirm, default null.
 * Args of function are ControlStatus and callback.
 * @property {function} [options.confirmRemoval] function called before confirm, default null
 * @return {ControlSaveTiles}
 */
L.control.savetiles = (baseLayer, options) => new ControlSaveTiles(baseLayer, options);
