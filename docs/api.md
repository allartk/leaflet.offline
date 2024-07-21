## Modules

<dl>
<dt><a href="#module_TileManager">TileManager</a></dt>
<dd><p>Api methods used in control and layer
For advanced usage</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#ControlSaveTiles">ControlSaveTiles</a></dt>
<dd></dd>
<dt><a href="#TileLayerOffline">TileLayerOffline</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ControlStatus">ControlStatus</a> : <code>Object</code></dt>
<dd><p>Status of ControlSaveTiles, keeps info about process during downloading
and saving tiles. Used internal and as object for events.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_L.control">L.control</a></dt>
<dd><p>Leaflet control</p>
</dd>
<dt><a href="#external_L.tileLayer">L.tileLayer</a></dt>
<dd><p>Leaflet tilelayer</p>
</dd>
</dl>

<a name="module_TileManager"></a>

## TileManager
Api methods used in control and layer
For advanced usage


* [TileManager](#module_TileManager)
    * _static_
        * [.getStorageInfo(urlTemplate)](#module_TileManager.getStorageInfo) ⇒ <code>Promise.&lt;Array.&lt;tileInfo&gt;&gt;</code>
        * [.downloadTile(tileUrl)](#module_TileManager.downloadTile) ⇒ <code>Promise.&lt;blob&gt;</code>
        * [.saveTile(tileInfo, blob)](#module_TileManager.saveTile) ⇒ <code>Promise</code>
        * [.getTileUrl(urlTemplate, data)](#module_TileManager.getTileUrl) ⇒ <code>string</code>
        * [.getTileUrls(layer, bounds, zoom)](#module_TileManager.getTileUrls) ⇒ <code>Array.&lt;tileInfo&gt;</code>
        * [.getStoredTilesAsJson(layer, tiles)](#module_TileManager.getStoredTilesAsJson) ⇒ <code>object</code>
        * [.removeTile(key)](#module_TileManager.removeTile) ⇒ <code>Promise</code>
        * [.getTile(key)](#module_TileManager.getTile) ⇒ <code>Promise.&lt;Blob&gt;</code>
        * [.truncate()](#module_TileManager.truncate) ⇒ <code>Promise</code>
    * _inner_
        * [~tileInfo](#module_TileManager..tileInfo) ⇒ <code>Promise.&lt;Number&gt;</code>

<a name="module_TileManager.getStorageInfo"></a>

### TileManager.getStorageInfo(urlTemplate) ⇒ <code>Promise.&lt;Array.&lt;tileInfo&gt;&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| urlTemplate | <code>string</code> | 

**Example**  
```js
import { getStorageInfo } from 'leaflet.offline'
getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
```
<a name="module_TileManager.downloadTile"></a>

### TileManager.downloadTile(tileUrl) ⇒ <code>Promise.&lt;blob&gt;</code>
**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| tileUrl | <code>string</code> | 

**Example**  
```js
import { downloadTile } from 'leaflet.offline'
downloadTile(tileInfo.url).then(blob => saveTile(tileInfo, blob))
```
<a name="module_TileManager.saveTile"></a>

### TileManager.saveTile(tileInfo, blob) ⇒ <code>Promise</code>
TODO validate tileinfo props?

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| tileInfo | <code>tileInfo</code> | 
| blob | <code>Blob</code> | 

**Example**  
```js
saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
```
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
| bounds | <code>object</code> | L.bounds |
| zoom | <code>number</code> | zoomlevel 0-19 |

**Example**  
```js
const p1 = L.point(10, 10)
const p2 = L.point(40, 60)
getTileUrls(layer, L.bounds(p1,p2), 12)
```
<a name="module_TileManager.getStoredTilesAsJson"></a>

### TileManager.getStoredTilesAsJson(layer, tiles) ⇒ <code>object</code>
Get a geojson of tiles from one resource

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  
**Returns**: <code>object</code> - geojson  

| Param | Type |
| --- | --- |
| layer | <code>object</code> | 
| tiles | <code>Array.&lt;tileInfo&gt;</code> | 

**Example**  
```js
const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const getGeoJsonData = () => LeafletOffline.getStorageInfo(urlTemplate)
 .then((data) => LeafletOffline.getStoredTilesAsJson(baseLayer, data));

getGeoJsonData().then((geojson) => {
  storageLayer = L.geoJSON(geojson).bindPopup(
    (clickedLayer) => clickedLayer.feature.properties.key,
  );
});
```
<a name="module_TileManager.removeTile"></a>

### TileManager.removeTile(key) ⇒ <code>Promise</code>
Remove tile by key

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_TileManager.getTile"></a>

### TileManager.getTile(key) ⇒ <code>Promise.&lt;Blob&gt;</code>
Get single tile blob

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_TileManager.truncate"></a>

### TileManager.truncate() ⇒ <code>Promise</code>
Remove everything

**Kind**: static method of [<code>TileManager</code>](#module_TileManager)  
<a name="module_TileManager..tileInfo"></a>

### TileManager~tileInfo ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: inner typedef of [<code>TileManager</code>](#module_TileManager)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - get number of store tiles  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | storage key |
| url | <code>string</code> | resolved url |
| urlTemplate | <code>string</code> | orig url, used to find tiles per layer |
| x | <code>string</code> | left point of tile |
| y | <code>string</code> | top point coord of tile |
| z | <code>string</code> | tile zoomlevel |

**Example**  
```js
import { getStorageLength } from 'leaflet.offline'
getStorageLength().then(i => console.log(i + 'tiles in storage'))
```
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

**Example**  
```js
const controlSaveTiles = L.control.savetiles(baseLayer, {
zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
confirm(layer, successCallback) {
  if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
    successCallback();
  }
},
confirmRemoval(layer, successCallback) {
  if (window.confirm('Remove all the tiles?')) {
    successCallback();
  }
},
saveText: '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>',
});
```
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
    * ["storagesize"](#TileLayerOffline.event_storagesize)
    * ["savestart"](#TileLayerOffline.event_savestart)
    * ["loadtileend"](#TileLayerOffline.event_loadtileend)
    * ["loadend"](#TileLayerOffline.event_loadend)
    * ["savetileend"](#TileLayerOffline.event_savetileend)
    * ["saveend"](#TileLayerOffline.event_saveend)
    * ["tilesremoved"](#TileLayerOffline.event_tilesremoved)

<a name="new_TileLayerOffline_new"></a>

### new TileLayerOffline()
A layer that uses stored tiles when available. Falls back to online.

**Example**  
```js
const tileLayerOffline = L.tileLayer
.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data {attribution.OpenStreetMap}',
  subdomains: 'abc',
  minZoom: 13,
})
.addTo(map);
```
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
<a name="ControlStatus"></a>

## ControlStatus : <code>Object</code>
Status of ControlSaveTiles, keeps info about process during downloading
and saving tiles. Used internal and as object for events.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| storagesize | <code>number</code> | total number of saved tiles. |
| lengthToBeSaved | <code>number</code> | number of tiles that will be saved in db during current process |
| lengthSaved | <code>number</code> | number of tiles saved during current process |
| lengthLoaded | <code>number</code> | number of tiles loaded during current process |
| _tilesforSave | <code>array</code> | tiles waiting for processing |

<a name="external_L.control"></a>

## L.control
Leaflet control

**Kind**: global external  
**See**: [Control](https://leafletjs.com/reference-1.6.0.html#control)  
<a name="external_L.control.savetiles"></a>

### L.control.savetiles(baseLayer) ⇒ [<code>ControlSaveTiles</code>](#ControlSaveTiles)
**Kind**: static method of [<code>L.control</code>](#external_L.control)  

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
| [options.parallel] | <code>number</code> | parallel downloads (default 50) |
| [options.saveWhatYouSee] | <code>boolean</code> | save the tiles that you see on screen plus deeper zooms, ignores zoomLevels options. Default false |
| [options.confirm] | <code>function</code> | function called before confirm, default null. Args of function are ControlStatus and callback. |
| [options.confirmRemoval] | <code>function</code> | function called before confirm, default null |

<a name="external_L.tileLayer"></a>

## L.tileLayer
Leaflet tilelayer

**Kind**: global external  
**See**: [TileLayer](https://leafletjs.com/reference-1.6.0.html#tilelayer)  
<a name="external_L.tileLayer.offline"></a>

### L.tileLayer.offline(url, options) ⇒ [<code>TileLayerOffline</code>](#TileLayerOffline)
**Kind**: static method of [<code>L.tileLayer</code>](#external_L.tileLayer)  
**Returns**: [<code>TileLayerOffline</code>](#TileLayerOffline) - an instance of TileLayerOffline  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | [description] |
| options | <code>object</code> | [http://leafletjs.com/reference-1.2.0.html#tilelayer](http://leafletjs.com/reference-1.2.0.html#tilelayer) |

