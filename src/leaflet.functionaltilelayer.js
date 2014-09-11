L.TileLayer.Functional = L.TileLayer.extend({

  _tileFunction: null,

  initialize: function (tileFunction, options) {
    this._tileFunction = tileFunction;
    L.TileLayer.prototype.initialize.call(this, null, options);
  },

  getTileUrl: function (tilePoint) {
    var map = this._map,
      crs = map.options.crs,
      tileSize = this.options.tileSize,
      zoom = tilePoint.z,
      nwPoint = tilePoint.multiplyBy(tileSize),
      sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
      nw = crs.project(map.unproject(nwPoint, zoom)),
      se = crs.project(map.unproject(sePoint, zoom)),
      bbox = [nw.x, se.y, se.x, nw.y].join(',');

    // Setup object to send to tile function.
    var view = {
      bbox: bbox,
      width: tileSize,
      height: tileSize,
      zoom: zoom,
      tile: {
        row: this.options.tms ? this._tileNumBounds.max.y - tilePoint.y : tilePoint.y,
        column: tilePoint.x
      },
      subdomain: this._getSubdomain(tilePoint)
    };

    return this._tileFunction(view);
  },

  _loadTile: function (tile, tilePoint) {
    tile._layer = this;
    tile.onload = this._tileOnLoad;
    tile.onerror = this._tileOnError;

    this._adjustTilePoint(tilePoint);
    var tileUrl = this.getTileUrl(tilePoint);

    if (typeof tileUrl === 'string') {
      tile.src = tileUrl;
      this.fire('tileloadstart', {
        tile: tile,
        url: tile.src
      });
    } else if (typeof tileUrl.then === 'function') {
      // Assume we are dealing with a promise.
      var self = this;
      tileUrl.then(function (tileUrl) {
        tile.src = tileUrl;
        self.fire('tileloadstart', {
          tile: tile,
          url: tile.src
        });
      });
    }
  }
});

L.tileLayer.functional = function (tileFunction, options) {
  return new L.TileLayer.Functional(tileFunction, options);
};