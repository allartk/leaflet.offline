import L from 'leaflet';
import localforage from './localforage';

/**
 * Shows control on map to save tiles
 * @class
 */
const ControlSaveTiles = L.Control.extend(
  /** @lends  ControlSaveTiles */ {
    /**
     *  @property {Object} options
     *  @property {string} options.position
     *  @property {string} options.saveText
     *  @property {string} options.rmText
     *  @property {number} options.maxZoom maximum zoom level that will be reached when saving tiles with saveWhatYouSee
     *  @property {boolean} options.saveWhatYouSee save the tiles that you see on screen plus deeper zooms, ignores zoomLevels
     *  @property {function} options.confirm function called before confirm, default null
     *  @property {function} options.confirmRemoval function called before confirm, default null
    */
    options: {
      position: 'topleft',
      saveText: '+',
      rmText: '-',
      maxZoom: 19,
      saveWhatYouSee: false,
      bounds: null,
      confirm: null,
      confirmRemoval: null,
    },
    /**
     *  @property {Object} status
     *  @property {number} status.storagesize
     *  @property {number} status.lengthToBeSaved
     *  @property {number} status.lengthSaved
     *  @property {number} status.lengthLoaded
     *  @property {array} status._tilesforSave
    */
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
   * @param {Function} callback with arg number of saved files
   * @private
   */
    setStorageSize(callback) {
      const self = this;
      if (this.status.storagesize) {
        callback(this.status.storagesize);
        return;
      }
      localforage.length().then((numberOfKeys) => {
        self.status.storagesize = numberOfKeys;
        self._baseLayer.fire('storagesize', self.status);
        if (callback) {
          callback(numberOfKeys);
        }
      }).catch((err) => {
        callback(0);
        throw err;
      });
    },
    /**
   * get number of saved files
   * @param  {Function} callback [description]
   * @private
   */
    getStorageSize(callback) {
      this.setStorageSize(callback);
    },
    /**
   * [setLayer description]
   * @param {Object} layer [description]
   * @private
   */
    setLayer(layer) {
      this._baseLayer = layer;
    },
    /**
   * set the bounds of the area to save
   * @param {L.latLngBounds} bounds
   * @private
   */
    setBounds(bounds) {
      this.options.bounds = bounds;
    },
    onAdd() {
      let container = L.DomUtil.create('div', 'savetiles leaflet-bar'),
        options = this.options;
      this._createButton(options.saveText, 'savetiles', container, this._saveTiles);
      this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
      return container;
    },
    _createButton(html, className, container, fn) {
      const link = L.DomUtil.create('a', className, container);
      link.innerHTML = html;
      link.href = '#';

      L.DomEvent
        .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', fn, this)
        .on(link, 'click', this._refocusOnMap, this);
      // TODO enable disable on layer change map

      return link;
    },
    _saveTiles() {
      let bounds;
      const self = this;
      let tiles = [];
      // minimum zoom to prevent the user from saving the whole world
      const minZoom = 5;
      // current zoom or zoom options
      let zoomlevels = [];

      if (this.options.saveWhatYouSee) {
        const currentZoom = this._map.getZoom();
        if (currentZoom < minZoom) {
          throw new Error('It\'s not possible to save with zoom below level 5.');
        }
        const maxZoom = this.options.maxZoom;

        for (let zoom = currentZoom; zoom <= maxZoom; zoom++) {
          zoomlevels.push(zoom);
        }
      } else {
        zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
      }

      if (this.options.bounds) {
        var latlngBounds = this.options.bounds;
      } else {
        var latlngBounds = this._map.getBounds();
      }
      for (const i in zoomlevels) {
        bounds = L.bounds(
          this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
          this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]),
        );
        tiles = tiles.concat(this._baseLayer.getTileUrls(bounds, zoomlevels[i]));
      }
      this._resetStatus(tiles);
      const succescallback = function () {
        self._baseLayer.fire('savestart', self.status);
        const subdlength = self._baseLayer.getSimultaneous();
        for (let i = 0; i < subdlength; i++) {
          self._loadTile();
        }
      };
      if (this.options.confirm) {
        this.options.confirm(this.status, succescallback);
      } else {
        succescallback();
      }
    },
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
   * @param  {string} tileUrl
   * @return {void}
   */
    _loadTile() {
      const self = this;
      const tileUrl = self.status._tilesforSave.shift();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', tileUrl.url);
      xhr.responseType = 'blob';
      xhr.send();
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          self.status.lengthLoaded++;
          self._saveTile(tileUrl.key, this.response);
          if (self.status._tilesforSave.length > 0) {
            self._loadTile();
            self._baseLayer.fire('loadtileend', self.status);
          } else {
            self._baseLayer.fire('loadtileend', self.status);
            if (self.status.lengthLoaded === self.status.lengthToBeSaved) {
              self._baseLayer.fire('loadend', self.status);
            }
          }
        }
      };
    },
    /**
   * [_saveTile description]
   * @private
   * @param  {string} tileUrl save key
   * @param  {blob} blob    [description]
   * @return {void}         [description]
   */
    _saveTile(tileUrl, blob) {
      const self = this;
      localforage.removeItem(tileUrl).then(() => {
        localforage.setItem(tileUrl, blob).then(() => {
          self.status.lengthSaved++;
          self._baseLayer.fire('savetileend', self.status);
          if (self.status.lengthSaved === self.status.lengthToBeSaved) {
            self._baseLayer.fire('saveend', self.status);
            self.setStorageSize();
          }
        }).catch((err) => {
          throw new Error(err);
        });
      }).catch((err) => {
        throw new Error(err);
      });
    },
    _rmTiles() {
      const self = this;
      const successCallback = function () {
        localforage.clear().then(() => {
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
  });
/**
 * @function L.control.savetiles
 * @param  {object} baseLayer     {@link http://leafletjs.com/reference-1.2.0.html#tilelayer}
 * @param  {object} options
 * @return {ControlSaveTiles}
 */
L.control.savetiles = function (baseLayer, options) {
  return new ControlSaveTiles(baseLayer, options);
};
