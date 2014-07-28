/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
L.TileLayer.Offline = L.TileLayer.Functional.extend({
    initialize: function(url, options) {
        var tileFunction = function(url, view) {
            var deferred = $.Deferred();
            var ObjectUrl = url
                    .replace('{z}', view.zoom)
                    .replace('{y}', view.tile.row)
                    .replace('{x}', view.tile.column)
                    .replace('{s}', view.subdomain);
            lzTiles.get(ObjectUrl, 'TileLayer', function(data) {
                if (data) {                                 
                    ObjectUrl = URL.createObjectURL(data.image);
                    console.log(ObjectUrl);
                }
                deferred.resolve(ObjectUrl);
            });
            return deferred.promise();
        }
        this._tileFunction = tileFunction;
        L.TileLayer.prototype.initialize.call(this, url, options);
    },
    getTileUrl: function(tilePoint) {
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

        return this._tileFunction(this._url, view);
    }

});

L.tileLayer.offline = function(url, options) {
    return new L.TileLayer.Offline(url, options);
};

