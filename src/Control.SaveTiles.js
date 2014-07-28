//storage tables
var lzTiles = new LazyStorage('Leaflet',1,
    {'TileLayer':
        {
            'name': 'TileLayer',
            'indexes': [{'name': 'image'}]
        }
    }
);

/**
 * inspired by control.zoom 
 */
L.Control.SaveTiles = L.Control.extend({
    //TODO add zoom level to save
    options: {
        position: 'topleft',
        saveText: 'Save',
    },
    initialize: function(baseLayer, options) {
        this._baseLayer = baseLayer;
        L.setOptions(this, options);
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'savetiles leaflet-bar'),
                options = this.options;
        this._createButton(options.saveText, "Save tiles", "savetiles", container, this._saveTiles)
        return container;
    },
    _createButton: function(html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
        //TODO enable disable on layer change map

        return link;
    },
    _saveTiles: function() {
        var bounds = this._map.getPixelBounds(),
                zoom = this._map.getZoom(),
                tileSize = this._baseLayer._getTileSize();
        var tileBounds = L.bounds(
                bounds.min.divideBy(tileSize).floor(),
                bounds.max.divideBy(tileSize).floor());
                
        //tiles to save
        var tiles = [];
	for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                var tilePoint = new L.Point(i, j);
                tilePoint.z = zoom;
                tiles.push(L.TileLayer.prototype.getTileUrl.call(this._baseLayer,tilePoint));                
            }
        }
        this._loadTile(tiles.shift());
    },
    //return blob in callback
    _loadTile: function(tileUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', tileUrl);
        xhr.responseType = 'blob';
        xhr.send();
        var $this = this;
        xhr.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){                
                $this._saveTile(tileUrl,this.response);
            }
        };
    },
    _saveTile: function(tileUrl,blob) {        
        lzTiles.delete('TileLayer',{'guid':tileUrl},function(data){ 
            lzTiles.save('TileLayer',{'guid':tileUrl,'image': blob},function(data){ console.log(data) })
        });
    },
    onRemove: function() {

    }
});

L.control.savetiles = function(baseLayer, options) {
    return new L.Control.SaveTiles(baseLayer, options);
};