## Modules

<dl>
<dt><a href="#module_TileManager">TileManager</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#ControlSaveTiles">ControlSaveTiles</a></dt>
<dd></dd>
<dt><a href="#TileLayerOffline">TileLayerOffline</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#L">L</a> : <code>object</code></dt>
<dd><p>Leaflet namespace.</p>
</dd>
<dt><a href="#L">L</a> : <code>object</code></dt>
<dd><p>Leaflet namespace.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ControlStatus">ControlStatus</a> : <code>Object</code></dt>
<dd><p>Status of ControlSaveTiles, keeps info about process during downloading
ans saving tiles. Used internal and as object for events.</p>
</dd>
</dl>

<a name="module_TileManager"></a>

## TileManager

* [TileManager](#module_TileManager)
    * _static_
        * [.getStorageLength()](#module_TileManager.getStorageLength) ⇒ <code>Promise.&lt;Number&gt;</code>
        * [.getStorageInfo(urlTemplate)](#module_TileManager.getStorageInfo) ⇒ <code>Promise.&lt;Array.&lt;tileInfo&gt;&gt;</code>
        * [.downloadTile(tileUrl)](#module_TileManager.downloadTile) ⇒ <code>Promise.&lt;blob&gt;</code>
        * [.saveTile(tileInfo, blob)](#module_TileManager.saveTile) ⇒ <code>Promise</code>
        * [.getTileUrl(urlTemplate, data)](#module_TileManager.getTileUrl) ⇒ <code>string</code>
        * [.getTileUrls(layer, bounds, zoom)](#module_TileManager.getTileUrls) ⇒ <code>Array.&lt;tileInfo&gt;</code>
        * [.getStoredTilesAsJson(layer, tiles)](#module_TileManager.getStoredTilesAsJson) ⇒ <code>object</code>
        * [.removeTile(key)](#module_TileManager.removeTile) ⇒ <code>Promise</code>
        * [.getTile(key)](#module_TileManager.getTile) ⇒ <code>Promise.&lt;blob&gt;</code>
        * [.truncate()](#module_TileManager.truncate) ⇒ <code>Promise</code>
    * _inner_
        * [~tileInfo](#module_TileManager..tileInfo) : <code>Object</code>

<a name="module_TileManager.getStorageLength"></a>

### TileManager.getStorageLength() ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - which resolves to int  
<a name="module_TileManager.getStorageInfo"></a>

### TileManager.getStorageInfo(urlTemplate) ⇒ <code>Promise.&lt;Array.&lt;tileInfo&gt;&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| urlTemplate | <code>string</code> | 

<a name="module_TileManager.downloadTile"></a>

### TileManager.downloadTile(tileUrl) ⇒ <code>Promise.&lt;blob&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| tileUrl | <code>string</code> | 

<a name="module_TileManager.saveTile"></a>

### TileManager.saveTile(tileInfo, blob) ⇒ <code>Promise</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| tileInfo | <code>tileInfo</code> | 
| blob | <code>blob</code> | 

<a name="module_TileManager.getTileUrl"></a>

### TileManager.getTileUrl(urlTemplate, data) ⇒ <code>string</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type | Description |
| --- | --- | --- |
| urlTemplate | <code>string</code> |  |
| data | <code>object</code> | x, y, z, s |
| data.s | <code>string</code> | subdomain |

<a name="module_TileManager.getTileUrls"></a>

### TileManager.getTileUrls(layer, bounds, zoom) ⇒ <code>Array.&lt;tileInfo&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>object</code> | leaflet tilelayer |
| bounds | <code>object</code> |  |
| zoom | <code>number</code> | zoomlevel 0-19 |

<a name="module_TileManager.getStoredTilesAsJson"></a>

### TileManager.getStoredTilesAsJson(layer, tiles) ⇒ <code>object</code>
Get a geojson of tiles from one resource

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  
**Returns**: <code>object</code> - geojson  

| Param | Type |
| --- | --- |
| layer | <code>object</code> | 
| tiles | <code>Array.&lt;tileInfo&gt;</code> | 

<a name="module_TileManager.removeTile"></a>

### TileManager.removeTile(key) ⇒ <code>Promise</code>
Remove tile by key

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_TileManager.getTile"></a>

### TileManager.getTile(key) ⇒ <code>Promise.&lt;blob&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_TileManager.truncate"></a>

### TileManager.truncate() ⇒ <code>Promise</code>
Remove everything

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  
<a name="module_TileManager..tileInfo"></a>

### TileManager~tileInfo : <code>Object</code>
**Kind**: inner typedef of [<code>TileManager</code>](#module_TileManager)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | storage key |
| url | <code>string</code> | resolved url |
| urlTemplate | <code>string</code> | orig url, used to find tiles per layer |
| x | <code>string</code> | left point of tile |
| y | <code>string</code> | top point coord of tile |
| z | <code>string</code> | tile zoomlevel |

<a name="ControlSaveTiles"></a>

## ControlSaveTiles
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| status | [<code>ControlStatus</code>](#ControlStatus) | 


* [ControlSaveTiles](#ControlSaveTiles)
    * [new ControlSaveTiles()](#new_ControlSaveTiles_new)
    * [.setLayer(layer)](#ControlSaveTiles.setLayer)
    * [.setOption(name, value)](#ControlSaveTiles.setOption)

<a name="new_ControlSaveTiles_new"></a>

### new ControlSaveTiles()
Shows control on map to save tiles

<a name="ControlSaveTiles.setLayer"></a>

### ControlSaveTiles.setLayer(layer)
Change baseLayer

**Kind**: static method of [<code>ControlSaveTiles</code>](#ControlSaveTiles)  

| Param | Type |
| --- | --- |
| layer | [<code>TileLayerOffline</code>](#TileLayerOffline) | 

<a name="ControlSaveTiles.setOption"></a>

### ControlSaveTiles.setOption(name, value)
Update a config option

**Kind**: static method of [<code>ControlSaveTiles</code>](#ControlSaveTiles)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>mixed</code> | 

<a name="TileLayerOffline"></a>

## TileLayerOffline
**Kind**: global class  

* [TileLayerOffline](#TileLayerOffline)
    * [new TileLayerOffline()](#new_TileLayerOffline_new)
    * [.getSimultaneous()](#TileLayerOffline.getSimultaneous) ⇒ <code>number</code>
    * ["storagesize"](#TileLayerOffline.event_storagesize)
    * ["savestart"](#TileLayerOffline.event_savestart)
    * ["loadtileend"](#TileLayerOffline.event_loadtileend)
    * ["loadend"](#TileLayerOffline.event_loadend)
    * ["savetileend"](#TileLayerOffline.event_savetileend)
    * ["saveend"](#TileLayerOffline.event_saveend)
    * ["tilesremoved"](#TileLayerOffline.event_tilesremoved)

<a name="new_TileLayerOffline_new"></a>

### new TileLayerOffline()
A layer that uses store tiles when available. Falls back to online.
Use this layer directly or extend it

<a name="TileLayerOffline.getSimultaneous"></a>

### TileLayerOffline.getSimultaneous() ⇒ <code>number</code>
**Kind**: static method of [<code>TileLayerOffline</code>](#TileLayerOffline)  
**Returns**: <code>number</code> - Number of simultanous downloads from tile server  
<a name="TileLayerOffline.event_storagesize"></a>

### "storagesize"
Control finished calculating storage size

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.event_savestart"></a>

### "savestart"
Start saving tiles

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.event_loadtileend"></a>

### "loadtileend"
Tile fetched

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.event_loadend"></a>

### "loadend"
All tiles fetched

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.event_savetileend"></a>

### "savetileend"
Tile saved

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.event_saveend"></a>

### "saveend"
All tiles saved

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.event_tilesremoved"></a>

### "tilesremoved"
Tile removed

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="L"></a>

## L : <code>object</code>
Leaflet namespace.

**Kind**: global namespace  

* [L](#L) : <code>object</code>
    * [.control](#L.control) : <code>object</code>
        * [.savetiles(baseLayer)](#L.control.savetiles) ⇒ [<code>ControlSaveTiles</code>](#ControlSaveTiles)
    * [.tileLayer](#L.tileLayer) : <code>object</code>
        * [.offline(url, options)](#L.tileLayer.offline) ⇒ [<code>TileLayerOffline</code>](#TileLayerOffline)

<a name="L.control"></a>

### L.control : <code>object</code>
Control namespace.

**Kind**: static namespace of [<code>L</code>](#L)  
<a name="L.control.savetiles"></a>

#### control.savetiles(baseLayer) ⇒ [<code>ControlSaveTiles</code>](#ControlSaveTiles)
**Kind**: static method of [<code>control</code>](#L.control)  

| Param | Type | Description |
| --- | --- | --- |
| baseLayer | <code>object</code> | [http://leafletjs.com/reference-1.2.0.html#tilelayer](http://leafletjs.com/reference-1.2.0.html#tilelayer) |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.position] | <code>string</code> | default topleft |
| [options.saveText] | <code>string</code> | html for save button, default + |
| [options.rmText] | <code>string</code> | html for remove button, deflault - |
| [options.maxZoom] | <code>number</code> | maximum zoom level that will be reached when saving tiles with saveWhatYouSee. Default 19 |
| [options.saveWhatYouSee] | <code>boolean</code> | save the tiles that you see on screen plus deeper zooms, ignores zoomLevels options. Default false |
| [options.confirm] | <code>function</code> | function called before confirm, default null. Args of function are ControlStatus and callback. |
| [options.confirmRemoval] | <code>function</code> | function called before confirm, default null |

<a name="L.tileLayer"></a>

### L.tileLayer : <code>object</code>
Tilelayer namespace.

**Kind**: static namespace of [<code>L</code>](#L)  
<a name="L.tileLayer.offline"></a>

#### tileLayer.offline(url, options) ⇒ [<code>TileLayerOffline</code>](#TileLayerOffline)
**Kind**: static method of [<code>tileLayer</code>](#L.tileLayer)  
**Returns**: [<code>TileLayerOffline</code>](#TileLayerOffline) - an instance of TileLayerOffline  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | [description] |
| options | <code>object</code> | [http://leafletjs.com/reference-1.2.0.html#tilelayer](http://leafletjs.com/reference-1.2.0.html#tilelayer) |

<a name="L"></a>

## L : <code>object</code>
Leaflet namespace.

**Kind**: global namespace  

* [L](#L) : <code>object</code>
    * [.control](#L.control) : <code>object</code>
        * [.savetiles(baseLayer)](#L.control.savetiles) ⇒ [<code>ControlSaveTiles</code>](#ControlSaveTiles)
    * [.tileLayer](#L.tileLayer) : <code>object</code>
        * [.offline(url, options)](#L.tileLayer.offline) ⇒ [<code>TileLayerOffline</code>](#TileLayerOffline)

<a name="L.control"></a>

### L.control : <code>object</code>
Control namespace.

**Kind**: static namespace of [<code>L</code>](#L)  
<a name="L.control.savetiles"></a>

#### control.savetiles(baseLayer) ⇒ [<code>ControlSaveTiles</code>](#ControlSaveTiles)
**Kind**: static method of [<code>control</code>](#L.control)  

| Param | Type | Description |
| --- | --- | --- |
| baseLayer | <code>object</code> | [http://leafletjs.com/reference-1.2.0.html#tilelayer](http://leafletjs.com/reference-1.2.0.html#tilelayer) |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.position] | <code>string</code> | default topleft |
| [options.saveText] | <code>string</code> | html for save button, default + |
| [options.rmText] | <code>string</code> | html for remove button, deflault - |
| [options.maxZoom] | <code>number</code> | maximum zoom level that will be reached when saving tiles with saveWhatYouSee. Default 19 |
| [options.saveWhatYouSee] | <code>boolean</code> | save the tiles that you see on screen plus deeper zooms, ignores zoomLevels options. Default false |
| [options.confirm] | <code>function</code> | function called before confirm, default null. Args of function are ControlStatus and callback. |
| [options.confirmRemoval] | <code>function</code> | function called before confirm, default null |

<a name="L.tileLayer"></a>

### L.tileLayer : <code>object</code>
Tilelayer namespace.

**Kind**: static namespace of [<code>L</code>](#L)  
<a name="L.tileLayer.offline"></a>

#### tileLayer.offline(url, options) ⇒ [<code>TileLayerOffline</code>](#TileLayerOffline)
**Kind**: static method of [<code>tileLayer</code>](#L.tileLayer)  
**Returns**: [<code>TileLayerOffline</code>](#TileLayerOffline) - an instance of TileLayerOffline  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | [description] |
| options | <code>object</code> | [http://leafletjs.com/reference-1.2.0.html#tilelayer](http://leafletjs.com/reference-1.2.0.html#tilelayer) |

<a name="ControlStatus"></a>

## ControlStatus : <code>Object</code>
Status of ControlSaveTiles, keeps info about process during downloading
ans saving tiles. Used internal and as object for events.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| storagesize | <code>number</code> | total number of saved tiles. |
| lengthToBeSaved | <code>number</code> | number of tiles that will be saved in db during current process |
| lengthSaved | <code>number</code> | number of tiles saved during current process |
| lengthLoaded | <code>number</code> | number of tiles loaded during current process |
| _tilesforSave | <code>array</code> | tiles waiting for processing |

