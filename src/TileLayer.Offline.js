/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
L.TileLayer.Offline = L.TileLayer.Functional.extend({
    initialize: function(options) {
        var tileFunction = function(view) {            
            var url = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{0}/{1}/{2}.jpg'
                    .replace('{0}', view.zoom)
                    .replace('{1}', view.tile.row)
                    .replace('{2}', view.tile.column)
                    .replace('{3}', view.subdomain);
            return url;
        }
        this._tileFunction = tileFunction;
        L.TileLayer.prototype.initialize.call(this, null, options);
    }

});

L.tileLayer.offline = function(url, options) {
    return new L.TileLayer.Offline(url, options);
};

