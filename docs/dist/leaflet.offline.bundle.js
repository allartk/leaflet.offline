(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet'), require('idb')) :
    typeof define === 'function' && define.amd ? define(['exports', 'leaflet', 'idb'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LeafletOffline = {}, global.L, global.idb));
})(this, (function (exports, leaflet, idb) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * Api methods used in control and layer
     * For advanced usage
     *
     * @module TileManager
     *
     */
    const tileStoreName = 'tileStore';
    const urlTemplateIndex = 'urlTemplate';
    let dbPromise;
    function openTilesDataBase() {
        if (dbPromise) {
            return dbPromise;
        }
        dbPromise = idb.openDB('leaflet.offline', 2, {
            upgrade(db, oldVersion) {
                idb.deleteDB('leaflet_offline');
                idb.deleteDB('leaflet_offline_areas');
                if (oldVersion < 1) {
                    const tileStore = db.createObjectStore(tileStoreName, {
                        keyPath: 'key',
                    });
                    tileStore.createIndex(urlTemplateIndex, 'urlTemplate');
                    tileStore.createIndex('z', 'z');
                }
            },
        });
        return dbPromise;
    }
    /**
     * @example
     * ```js
     * import { getStorageLength } from 'leaflet.offline'
     * getStorageLength().then(i => console.log(i + 'tiles in storage'))
     * ```
     */
    function getStorageLength() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield openTilesDataBase();
            return db.count(tileStoreName);
        });
    }
    /**
     * @example
     * ```js
     * import { getStorageInfo } from 'leaflet.offline'
     * getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
     * ```
     */
    function getStorageInfo(urlTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const range = IDBKeyRange.only(urlTemplate);
            const db = yield openTilesDataBase();
            return db.getAllFromIndex(tileStoreName, urlTemplateIndex, range);
        });
    }
    /**
     * @example
     * ```js
     * import { downloadTile } from 'leaflet.offline'
     * downloadTile(tileInfo.url).then(blob => saveTile(tileInfo, blob))
     * ```
     */
    function downloadTile(tileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(tileUrl);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.statusText}`);
            }
            return response.blob();
        });
    }
    /**
     * @example
     * ```js
     * saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
     * ```
     */
    function saveTile(tileInfo, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield openTilesDataBase();
            return db.put(tileStoreName, Object.assign({ blob }, tileInfo));
        });
    }
    function getTileUrl(urlTemplate, data) {
        return leaflet.Util.template(urlTemplate, Object.assign(Object.assign({}, data), { r: leaflet.Browser.retina ? '@2x' : '' }));
    }
    function getTilePoints(area, tileSize) {
        const points = [];
        if (!area.min || !area.max) {
            return points;
        }
        const topLeftTile = area.min.divideBy(tileSize.x).floor();
        const bottomRightTile = area.max.divideBy(tileSize.x).floor();
        for (let j = topLeftTile.y; j <= bottomRightTile.y; j += 1) {
            for (let i = topLeftTile.x; i <= bottomRightTile.x; i += 1) {
                points.push(new leaflet.Point(i, j));
            }
        }
        return points;
    }
    /**
     * Get a geojson of tiles from one resource
     *
     * @example
     * const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
     * const getGeoJsonData = () => LeafletOffline.getStorageInfo(urlTemplate)
     *  .then((data) => LeafletOffline.getStoredTilesAsJson(baseLayer, data));
     *
     * getGeoJsonData().then((geojson) => {
     *   storageLayer = L.geoJSON(geojson).bindPopup(
     *     (clickedLayer) => clickedLayer.feature.properties.key,
     *   );
     * });
     *
     */
    function getStoredTilesAsJson(tileSize, tiles) {
        const featureCollection = {
            type: 'FeatureCollection',
            features: [],
        };
        for (let i = 0; i < tiles.length; i += 1) {
            const topLeftPoint = new leaflet.Point(tiles[i].x * tileSize.x, tiles[i].y * tileSize.y);
            const bottomRightPoint = new leaflet.Point(topLeftPoint.x + tileSize.x, topLeftPoint.y + tileSize.y);
            const topLeftlatlng = leaflet.CRS.EPSG3857.pointToLatLng(topLeftPoint, tiles[i].z);
            const botRightlatlng = leaflet.CRS.EPSG3857.pointToLatLng(bottomRightPoint, tiles[i].z);
            featureCollection.features.push({
                type: 'Feature',
                properties: tiles[i],
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [topLeftlatlng.lng, topLeftlatlng.lat],
                            [botRightlatlng.lng, topLeftlatlng.lat],
                            [botRightlatlng.lng, botRightlatlng.lat],
                            [topLeftlatlng.lng, botRightlatlng.lat],
                            [topLeftlatlng.lng, topLeftlatlng.lat],
                        ],
                    ],
                },
            });
        }
        return featureCollection;
    }
    /**
     * Remove tile by key
     */
    function removeTile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield openTilesDataBase();
            return db.delete(tileStoreName, key);
        });
    }
    /**
     * Get single tile blob
     */
    function getBlobByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield openTilesDataBase())
                .get(tileStoreName, key)
                .then((result) => result && result.blob);
        });
    }
    function hasTile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield openTilesDataBase();
            const result = yield db.getKey(tileStoreName, key);
            return result !== undefined;
        });
    }
    /**
     * Remove everything
     */
    function truncate() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield openTilesDataBase()).clear(tileStoreName);
        });
    }
    function getTileImageSource(key, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const shouldUseUrl = !(yield hasTile(key));
            if (shouldUseUrl) {
                return url;
            }
            const blob = yield getBlobByKey(key);
            return URL.createObjectURL(blob);
        });
    }

    class TileLayerOffline extends leaflet.TileLayer {
        createTile(coords, done) {
            const tile = document.createElement('img');
            leaflet.DomEvent.on(tile, 'load', leaflet.Util.bind(this._tileOnLoad, this, done, tile));
            leaflet.DomEvent.on(tile, 'error', leaflet.Util.bind(this._tileOnError, this, done, tile));
            if (this.options.crossOrigin || this.options.crossOrigin === '') {
                tile.crossOrigin =
                    this.options.crossOrigin === true ? '' : this.options.crossOrigin;
            }
            tile.alt = '';
            tile.setAttribute('role', 'presentation');
            getTileImageSource(this._getStorageKey(coords), this.getTileUrl(coords)).then((src) => (tile.src = src));
            return tile;
        }
        /**
         * get key to use for storage
         * @private
         * @param  {string} url url used to load tile
         * @return {string} unique identifier.
         */
        _getStorageKey(coords) {
            return getTileUrl(this._url, Object.assign(Object.assign(Object.assign({}, coords), this.options), { 
                // @ts-ignore: Possibly undefined
                s: this.options.subdomains['0'] }));
        }
        /**
         * Get tileinfo for zoomlevel & bounds
         */
        getTileUrls(bounds, zoom) {
            var _a;
            const tiles = [];
            const tilePoints = getTilePoints(bounds, this.getTileSize());
            for (let index = 0; index < tilePoints.length; index += 1) {
                const tilePoint = tilePoints[index];
                const data = Object.assign(Object.assign({}, this.options), { x: tilePoint.x, y: tilePoint.y, z: zoom + (this.options.zoomOffset || 0) });
                tiles.push({
                    key: getTileUrl(this._url, Object.assign(Object.assign({}, data), { s: (_a = this.options.subdomains) === null || _a === void 0 ? void 0 : _a[0] })),
                    url: getTileUrl(this._url, Object.assign(Object.assign({}, data), { 
                        // @ts-ignore: Undefined
                        s: this._getSubdomain(tilePoint) })),
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
    function tileLayerOffline(url, options) {
        return new TileLayerOffline(url, options);
    }
    /**  @ts-ignore */
    if (window.L) {
        /**  @ts-ignore */
        window.L.tileLayer.offline = tileLayerOffline;
    }

    class ControlSaveTiles extends leaflet.Control {
        constructor(baseLayer, options) {
            super(options);
            this.status = {
                storagesize: 0,
                lengthToBeSaved: 0,
                lengthSaved: 0,
                lengthLoaded: 0,
                _tilesforSave: [],
            };
            this._baseLayer = baseLayer;
            this.setStorageSize();
            this.options = Object.assign({
                position: 'topleft',
                saveText: '+',
                rmText: '-',
                maxZoom: 19,
                saveWhatYouSee: false,
                bounds: null,
                confirm: null,
                confirmRemoval: null,
                parallel: 50,
                zoomlevels: undefined,
                alwaysDownload: true,
            }, options);
        }
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
        }
        getStorageSize(callback) {
            this.setStorageSize().then((result) => {
                if (callback) {
                    callback(result);
                }
            });
        }
        setLayer(layer) {
            this._baseLayer = layer;
        }
        onAdd() {
            const container = leaflet.DomUtil.create('div', 'savetiles leaflet-bar');
            const { options } = this;
            this._createButton(options.saveText, 'savetiles', container, this._saveTiles);
            this._createButton(options.rmText, 'rmtiles', container, this._rmTiles);
            return container;
        }
        _createButton(html, className, container, fn) {
            const link = leaflet.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.ariaRoleDescription = 'button';
            leaflet.DomEvent.on(link, 'mousedown dblclick', leaflet.DomEvent.stopPropagation)
                .on(link, 'click', leaflet.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
            return link;
        }
        _saveTiles() {
            const tiles = this._calculateTiles();
            this._resetStatus(tiles);
            const successCallback = () => __awaiter(this, void 0, void 0, function* () {
                this._baseLayer.fire('savestart', this.status);
                const loader = () => __awaiter(this, void 0, void 0, function* () {
                    const tile = tiles.shift();
                    if (tile === undefined) {
                        return Promise.resolve();
                    }
                    const blob = yield this._loadTile(tile);
                    if (blob) {
                        yield this._saveTile(tile, blob);
                    }
                    return loader();
                });
                const parallel = Math.min(tiles.length, this.options.parallel);
                for (let i = 0; i < parallel; i += 1) {
                    loader();
                }
            });
            if (this.options.confirm) {
                this.options.confirm(this.status, successCallback);
            }
            else {
                successCallback();
            }
        }
        _calculateTiles() {
            let tiles = [];
            // minimum zoom to prevent the user from saving the whole world
            const minZoom = 5;
            // current zoom or zoom options
            let zoomlevels = [];
            if (this.options.saveWhatYouSee) {
                const currentZoom = this._map.getZoom();
                if (currentZoom < minZoom) {
                    throw new Error(`It's not possible to save with zoom below level ${minZoom}.`);
                }
                const { maxZoom } = this.options;
                for (let zoom = currentZoom; zoom <= maxZoom; zoom += 1) {
                    zoomlevels.push(zoom);
                }
            }
            else {
                zoomlevels = this.options.zoomlevels || [this._map.getZoom()];
            }
            const latlngBounds = this.options.bounds || this._map.getBounds();
            for (let i = 0; i < zoomlevels.length; i += 1) {
                const area = leaflet.bounds(this._map.project(latlngBounds.getNorthWest(), zoomlevels[i]), this._map.project(latlngBounds.getSouthEast(), zoomlevels[i]));
                tiles = tiles.concat(this._baseLayer.getTileUrls(area, zoomlevels[i]));
            }
            return tiles;
        }
        _resetStatus(tiles) {
            this.status = {
                lengthLoaded: 0,
                lengthToBeSaved: tiles.length,
                lengthSaved: 0,
                _tilesforSave: tiles,
                storagesize: this.status.storagesize,
            };
        }
        _loadTile(tile) {
            return __awaiter(this, void 0, void 0, function* () {
                let blob;
                if (this.options.alwaysDownload === true ||
                    (yield hasTile(tile.key)) === false) {
                    blob = yield downloadTile(tile.url);
                    this.status.lengthLoaded += 1;
                }
                this.status.lengthLoaded += 1;
                this._baseLayer.fire('loadtileend', this.status);
                if (this.status.lengthLoaded === this.status.lengthToBeSaved) {
                    this._baseLayer.fire('loadend', this.status);
                }
                return blob;
            });
        }
        _saveTile(tile, blob) {
            return __awaiter(this, void 0, void 0, function* () {
                yield saveTile(tile, blob);
                this.status.lengthSaved += 1;
                this._baseLayer.fire('savetileend', this.status);
                if (this.status.lengthSaved === this.status.lengthToBeSaved) {
                    this._baseLayer.fire('saveend', this.status);
                    this.setStorageSize();
                }
            });
        }
        _rmTiles() {
            const successCallback = () => {
                truncate().then(() => {
                    this.status.storagesize = 0;
                    this._baseLayer.fire('tilesremoved');
                    this._baseLayer.fire('storagesize', this.status);
                });
            };
            if (this.options.confirmRemoval) {
                this.options.confirmRemoval(this.status, successCallback);
            }
            else {
                successCallback();
            }
        }
    }
    function savetiles(baseLayer, options) {
        return new ControlSaveTiles(baseLayer, options);
    }
    /**  @ts-ignore */
    if (window.L) {
        /**  @ts-ignore */
        window.L.control.savetiles = savetiles;
    }

    exports.downloadTile = downloadTile;
    exports.getBlobByKey = getBlobByKey;
    exports.getStorageInfo = getStorageInfo;
    exports.getStorageLength = getStorageLength;
    exports.getStoredTilesAsJson = getStoredTilesAsJson;
    exports.removeTile = removeTile;
    exports.saveTile = saveTile;
    exports.savetiles = savetiles;
    exports.tileLayerOffline = tileLayerOffline;
    exports.truncate = truncate;

}));
