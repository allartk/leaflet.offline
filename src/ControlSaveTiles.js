import L from 'leaflet';
import localforage from './localforage';

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
* @property {ControlStatus} status
*/
const ControlSaveTiles = L.Control.extend(/** @lends ControlSaveTiles */ {
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
   * @param {Function} [callback] receives arg number of saved files
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
   * Change baseLayer
   * @param {TileLayerOffline} layer
   */
  setLayer(layer) {
    this._baseLayer = layer;
  },
  /**
   * set the bounds of the area to save
   * @param {L.latLngBounds} bounds
   */
  setBounds(bounds) {
    this.options.bounds = bounds;
  },
  /**
   * set saveWhatYouSee
   * @param {boolean} saveWhatYouSee
   */
  setSaveWhatYouSee(saveWhatYouSee) {
    this.options.saveWhatYouSee = saveWhatYouSee;
  },
  /**
   * set the maxZoom
   * @param {number} zoom
   */
  setMaxZoom(zoom) {
    this.options.maxZoom = zoom;
  },
  /**
   * set the zoomLevels
   * @param {array} zoomlevels min,max
   */
  setZoomlevels(zoomlevels) {
    this.options.zoomlevels = zoomlevels;
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

    L.DomEvent
      .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
      .on(link, 'click', L.DomEvent.stop)
      .on(link, 'click', fn, this)
      .on(link, 'click', this._refocusOnMap, this);
    // TODO enable disable on layer change map

    return link;
  },
  /**
   * starts processing tiles
   * @private
   * @return {void}
   */
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
      const { maxZoom } = this.options;

      for (let zoom = currentZoom; zoom <= maxZoom; zoom += 1) {
        zoomlevels.push(zoom);
      }
    } else {
      zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
    }

    const latlngBounds = this.options.bounds || this._map.getBounds();

    for (const i in zoomlevels) {
      bounds = L.bounds(
        this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
        this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]),
      );
      tiles = tiles.concat(this._baseLayer.getTileUrls(bounds, zoomlevels[i]));
    }
    this._resetStatus(tiles);
    const succescallback = () => {
      self._baseLayer.fire('savestart', self.status);
      const subdlength = self._baseLayer.getSimultaneous();
      for (let i = 0; i < subdlength; i += 1) {
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
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        self.status.lengthLoaded += 1;
        self._saveTile(tileUrl.key, xhr.response);
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
        self.status.lengthSaved += 1;
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
    const successCallback = () => {
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
* @property {Object} options
* @property {string} [options.position] default topleft
* @property {string} [options.saveText] html for save button, default +
* @property {string} [options.rmText] html for remove button, deflault -
* @property {number} [options.maxZoom] maximum zoom level that will be reached
* when saving tiles with saveWhatYouSee. Default 19
* @property {boolean} [options.saveWhatYouSee] save the tiles that you see
* on screen plus deeper zooms, ignores zoomLevels options. Default false
* @property {function} [options.confirm] function called before confirm, default null.
* Args of function are ControlStatus and callback.
* @property {function} [options.confirmRemoval] function called before confirm, default null
* @return {ControlSaveTiles}
*/
L.control.savetiles = (baseLayer, options) => new ControlSaveTiles(baseLayer, options);
