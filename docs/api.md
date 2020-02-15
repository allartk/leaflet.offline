## Classes

<dl>
<dt><a href="#ControlSaveTiles">ControlSaveTiles</a></dt>
<dd></dd>
<dt><a href="#TileLayerOffline">TileLayerOffline</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getStorageLength">getStorageLength()</a> ⇒ <code>Promise.&lt;Number&gt;</code></dt>
<dd></dd>
<dt><a href="#getStorageInfo">getStorageInfo(urlTemplate)</a> ⇒ <code>Promise.&lt;Array.&lt;tileInfo&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#downloadTile">downloadTile(tileUrl)</a> ⇒ <code>Promise.&lt;blob&gt;</code></dt>
<dd></dd>
<dt><a href="#saveTile">saveTile(tileInfo, blob)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#getTileUrl">getTileUrl(urlTemplate, data)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getTileUrls">getTileUrls(layer, bounds, zoom)</a> ⇒ <code><a href="#tileInfo">Array.&lt;tileInfo&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getStoredTilesAsJson">getStoredTilesAsJson(layer, tiles)</a> ⇒ <code>object</code></dt>
<dd><p>Get a geojson of tiles from one resource</p>
</dd>
<dt><a href="#removeTile">removeTile(key)</a> ⇒ <code>Promise</code></dt>
<dd><p>Remove tile by key</p>
</dd>
<dt><a href="#getTile">getTile(key)</a> ⇒ <code>Promise.&lt;blob&gt;</code></dt>
<dd></dd>
<dt><a href="#truncate">truncate()</a> ⇒ <code>Promise</code></dt>
<dd><p>Remove everything</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ControlStatus">ControlStatus</a> : <code>Object</code></dt>
<dd><p>Status of ControlSaveTiles, keeps info about process during downloading
ans saving tiles. Used internal and as object for events.</p>
</dd>
<dt><a href="#tileInfo">tileInfo</a> : <code>Object</code></dt>
<dd></dd>
</dl>

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
    * _instance_
        * ["storagesize"](#TileLayerOffline+event_storagesize)
    * _static_
        * [.getSimultaneous()](#TileLayerOffline.getSimultaneous) ⇒ <code>number</code>
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

<a name="TileLayerOffline+event_storagesize"></a>

### "storagesize"
Tiles removed event

**Kind**: event emitted by [<code>TileLayerOffline</code>](#TileLayerOffline)  
<a name="TileLayerOffline.getSimultaneous"></a>

### TileLayerOffline.getSimultaneous() ⇒ <code>number</code>
**Kind**: static method of [<code>TileLayerOffline</code>](#TileLayerOffline)  
**Returns**: <code>number</code> - Number of simultanous downloads from tile server  
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
<a name="getStorageLength"></a>

## getStorageLength() ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: global function  
**Returns**: <code>Promise.&lt;Number&gt;</code> - which resolves to int  
<a name="getStorageInfo"></a>

## getStorageInfo(urlTemplate) ⇒ <code>Promise.&lt;Array.&lt;tileInfo&gt;&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| urlTemplate | <code>string</code> | 

<a name="downloadTile"></a>

## downloadTile(tileUrl) ⇒ <code>Promise.&lt;blob&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| tileUrl | <code>string</code> | 

<a name="saveTile"></a>

## saveTile(tileInfo, blob) ⇒ <code>Promise</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| tileInfo | [<code>tileInfo</code>](#tileInfo) | 
| blob | <code>blob</code> | 

<a name="getTileUrl"></a>

## getTileUrl(urlTemplate, data) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| urlTemplate | <code>string</code> |  |
| data | <code>object</code> | x, y, z, s |
| data.s | <code>string</code> | subdomain |

<a name="getTileUrls"></a>

## getTileUrls(layer, bounds, zoom) ⇒ [<code>Array.&lt;tileInfo&gt;</code>](#tileInfo)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>object</code> | leaflet tilelayer |
| bounds | <code>object</code> |  |
| zoom | <code>number</code> | zoomlevel 0-19 |

<a name="getStoredTilesAsJson"></a>

## getStoredTilesAsJson(layer, tiles) ⇒ <code>object</code>
Get a geojson of tiles from one resource

**Kind**: global function  
**Returns**: <code>object</code> - geojson  

| Param | Type |
| --- | --- |
| layer | <code>object</code> | 
| tiles | [<code>Array.&lt;tileInfo&gt;</code>](#tileInfo) | 

<a name="removeTile"></a>

## removeTile(key) ⇒ <code>Promise</code>
Remove tile by key

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="getTile"></a>

## getTile(key) ⇒ <code>Promise.&lt;blob&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="truncate"></a>

## truncate() ⇒ <code>Promise</code>
Remove everything

**Kind**: global function  
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

<a name="tileInfo"></a>

## tileInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | storage key |
| url | <code>string</code> | resolved url |
| urlTemplate | <code>string</code> | orig url, used to find tiles per layer |
| x | <code>string</code> | left point of tile |
| y | <code>string</code> | top point coord of tile |
| z | <code>string</code> | tile zoomlevel |

