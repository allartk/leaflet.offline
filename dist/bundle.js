(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('leaflet'), require('localforage')) :
	typeof define === 'function' && define.amd ? define(['leaflet', 'localforage'], factory) :
	(factory(global.L,global.localforage));
}(this, (function (L,localforage) { 'use strict';

L = L && L.hasOwnProperty('default') ? L['default'] : L;
localforage = localforage && localforage.hasOwnProperty('default') ? localforage['default'] : localforage;

localforage.config({
  name: 'leaflet_offline',
  version: 1.0,
  size: 4980736,
  storeName: 'tiles',
  description: 'the tiles',
});

/**
 * A layer that uses store tiles when available. Falls back to online.
 * @class TileLayerOffline
 */
var TileLayerOffline = L.TileLayer.extend(/** @lends  TileLayerOffline */ {
  /**
  * Create tile HTMLElement
  * @private
  * @param  {array}   coords [description]
  * @param  {Function} done   [description]
  * @return {HTMLElement}          [description]
  */
  createTile: function createTile(coords, done) {
    var tile = L.TileLayer.prototype.createTile.call(this, coords, done);
    var url = tile.src;
    tile.src = undefined;
    this.setDataUrl(tile, url).then(function (dataurl) {
      tile.src = dataurl;
    }).catch(function () {
      tile.src = url;
    });
    return tile;
  },
  /**
   * dataurl from locatostorage
   * @param {DomElement} tile [description]
   * @param {string} url  [description]
   * @return {Promise} resolves to base64 url
   */
  setDataUrl: function setDataUrl(tile, url) {
    var this$1 = this;

    return new Promise(function (resolve, reject) {
      localforage.getItem(this$1._getStorageKey(url)).then(function (data) {
        if (data && typeof data === 'object') {
          resolve(URL.createObjectURL(data));
        } else {
          reject();
        }
      }).catch(function (e) { reject(e); });
    });
  },
  /**
   * get key to use for storage
   * @private
   * @param  {string} url url used to load tile
   * @return {string} unique identifier.
   */
  _getStorageKey: function _getStorageKey(url) {
    var key;
    var subdomainpos = this._url.indexOf('{s}');
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
  getSimultaneous: function getSimultaneous() {
    return this.options.subdomains.length;
  },
  /**
   * getTileUrls for single zoomlevel
   * @param  {object} L.latLngBounds
   * @param  {number} zoom
   * @return {object[]} the tile urls, key, url
   */
  getTileUrls: function getTileUrls(bounds, zoom) {
    var this$1 = this;

    var tiles = [];
    var origurl = this._url;
    // getTileUrl uses current zoomlevel, we want to overwrite it
    this.setUrl(this._url.replace('{z}', zoom), true);
    var tileBounds = L.bounds(
      bounds.min.divideBy(this.getTileSize().x).floor(),
      bounds.max.divideBy(this.getTileSize().x).floor()
    );
    var url;
    for (var j = tileBounds.min.y; j <= tileBounds.max.y; j += 1) {
      for (var i = tileBounds.min.x; i <= tileBounds.max.x; i += 1) {
        var tilePoint = new L.Point(i, j);
        url = L.TileLayer.prototype.getTileUrl.call(this$1, tilePoint);
        tiles.push({
          key: this$1._getStorageKey(url),
          url: url,
        });
      }
    }
    // restore url
    this.setUrl(origurl, true);
    return tiles;
  },
});

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
L.tileLayer.offline = function (url, options) { return new TileLayerOffline(url, options); };

/**
 * Status of ControlSaveTiles, used internal and as object for events.
 * @typedef {Object} ControlStatus
 * @property {number} storagesize
 * @property {number} lengthToBeSaved
 * @property {number} lengthSaved
 * @property {number} lengthLoaded
 * @property {array} _tilesforSave
 */


/**
* Shows control on map to save tiles
* @class ControlSaveTiles
*
* @property {ControlStatus} status
*/
var ControlSaveTiles = L.Control.extend(/** @lends ControlSaveTiles */ {
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
  initialize: function initialize(baseLayer, options) {
    this._baseLayer = baseLayer;
    this.setStorageSize();
    L.setOptions(this, options);
  },
  /**
   * Set storagesize prop on object init
   * @param {Function} callback with arg number of saved files
   * @private
   */
  setStorageSize: function setStorageSize(callback) {
    var self = this;
    if (this.status.storagesize) {
      callback(this.status.storagesize);
      return;
    }
    localforage.length().then(function (numberOfKeys) {
      self.status.storagesize = numberOfKeys;
      self._baseLayer.fire('storagesize', self.status);
      if (callback) {
        callback(numberOfKeys);
      }
    }).catch(function (err) {
      callback(0);
      throw err;
    });
  },
  /**
   * get number of saved files
   * @param  {Function} callback [description]
   * @private
   */
  getStorageSize: function getStorageSize(callback) {
    this.setStorageSize(callback);
  },
  /**
   * [setLayer description]
   * @param {Object} layer [description]
   */
  setLayer: function setLayer(layer) {
    this._baseLayer = layer;
  },
  /**
   * set the bounds of the area to save
   * @param {L.latLngBounds} bounds
   */
  setBounds: function setBounds(bounds) {
    this.options.bounds = bounds;
  },
  /**
   * set saveWhatYouSee
   * @param {boolean}
   */
  setSaveWhatYouSee: function setSaveWhatYouSee(saveWhatYouSee) {
    this.options.saveWhatYouSee = saveWhatYouSee;
  },
  /**
   * set the maxZoom
   * @param {number} zoom
   */
  setMaxZoom: function setMaxZoom(zoom) {
    this.options.maxZoom = zoom;
  },
  /**
   * set the zoomLevels
   * @param {array} [min,max]
   */
  setZoomlevels: function setZoomlevels(zoomlevels) {
    this.options.zoomlevels = zoomlevels;
  },
  onAdd: function onAdd() {
    var container = L.DomUtil.create('div', 'savetiles leaflet-bar');
    var ref = this;
    var options = ref.options;
    this._createButton(options.saveText, 'savetiles', container, this._saveTiles);
    this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
    return container;
  },
  _createButton: function _createButton(html, className, container, fn) {
    var link = L.DomUtil.create('a', className, container);
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
  _saveTiles: function _saveTiles() {
    var this$1 = this;

    var bounds;
    var self = this;
    var tiles = [];
    // minimum zoom to prevent the user from saving the whole world
    var minZoom = 5;
    // current zoom or zoom options
    var zoomlevels = [];

    if (this.options.saveWhatYouSee) {
      var currentZoom = this._map.getZoom();
      if (currentZoom < minZoom) {
        throw new Error('It\'s not possible to save with zoom below level 5.');
      }
      var ref = this.options;
      var maxZoom = ref.maxZoom;

      for (var zoom = currentZoom; zoom <= maxZoom; zoom += 1) {
        zoomlevels.push(zoom);
      }
    } else {
      zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
    }

    var latlngBounds = this.options.bounds || this._map.getBounds();

    for (var i in zoomlevels) {
      bounds = L.bounds(
        this$1._map.project(latlngBounds.getNorthWest(), zoomlevels[i]),
        this$1._map.project(latlngBounds.getSouthEast(), zoomlevels[i])
      );
      tiles = tiles.concat(this$1._baseLayer.getTileUrls(bounds, zoomlevels[i]));
    }
    this._resetStatus(tiles);
    var succescallback = function () {
      self._baseLayer.fire('savestart', self.status);
      var subdlength = self._baseLayer.getSimultaneous();
      for (var i = 0; i < subdlength; i += 1) {
        self._loadTile();
      }
    };
    if (this.options.confirm) {
      this.options.confirm(this.status, succescallback);
    } else {
      succescallback();
    }
  },
  _resetStatus: function _resetStatus(tiles) {
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
  _loadTile: function _loadTile() {
    var this$1 = this;

    var self = this;
    var tileUrl = self.status._tilesforSave.shift();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', tileUrl.url);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        self.status.lengthLoaded += 1;
        self._saveTile(tileUrl.key, this$1.response);
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
  _saveTile: function _saveTile(tileUrl, blob) {
    var self = this;
    localforage.removeItem(tileUrl).then(function () {
      localforage.setItem(tileUrl, blob).then(function () {
        self.status.lengthSaved += 1;
        self._baseLayer.fire('savetileend', self.status);
        if (self.status.lengthSaved === self.status.lengthToBeSaved) {
          self._baseLayer.fire('saveend', self.status);
          self.setStorageSize();
        }
      }).catch(function (err) {
        throw new Error(err);
      });
    }).catch(function (err) {
      throw new Error(err);
    });
  },
  _rmTiles: function _rmTiles() {
    var self = this;
    var successCallback = function () {
      localforage.clear().then(function () {
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
* @property {string} options.position
* @property {string} options.saveText
* @property {string} options.rmText
* @property {number} options.maxZoom maximum zoom level that will be reached
* when saving tiles with saveWhatYouSee
* @property {boolean} options.saveWhatYouSee save the tiles that you see
* on screen plus deeper zooms, ignores zoomLevels
* @property {function} options.confirm function called before confirm, default null
* @property {function} options.confirmRemoval function called before confirm, default null
* @return {ControlSaveTiles}
*/
L.control.savetiles = function (baseLayer, options) { return new ControlSaveTiles(baseLayer, options); };

})));
