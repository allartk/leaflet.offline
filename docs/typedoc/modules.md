[leaflet.offline](README.md) / Exports

# leaflet.offline

## Table of contents

### Functions

- [downloadTile](modules.md#downloadtile)
- [getBlobByKey](modules.md#getblobbykey)
- [getStorageInfo](modules.md#getstorageinfo)
- [getStorageLength](modules.md#getstoragelength)
- [getStoredTilesAsJson](modules.md#getstoredtilesasjson)
- [removeTile](modules.md#removetile)
- [saveTile](modules.md#savetile)
- [savetiles](modules.md#savetiles)
- [tileLayerOffline](modules.md#tilelayeroffline)
- [truncate](modules.md#truncate)

## Functions

### downloadTile

▸ **downloadTile**(`tileUrl`): `Promise`<`Blob`\>

**`example`**
```js
import { downloadTile } from 'leaflet.offline'
downloadTile(tileInfo.url).then(blob => saveTile(tileInfo, blob))
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileUrl` | `string` |

#### Returns

`Promise`<`Blob`\>

#### Defined in

[TileManager.ts:82](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L82)

___

### getBlobByKey

▸ **getBlobByKey**(`key`): `Promise`<`Blob`\>

Get single tile blob

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`Blob`\>

#### Defined in

[TileManager.ts:197](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L197)

___

### getStorageInfo

▸ **getStorageInfo**(`urlTemplate`): `Promise`<`TileInfo`[]\>

**`example`**
```js
import { getStorageInfo } from 'leaflet.offline'
getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `urlTemplate` | `string` |

#### Returns

`Promise`<`TileInfo`[]\>

#### Defined in

[TileManager.ts:66](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L66)

___

### getStorageLength

▸ **getStorageLength**(): `Promise`<`number`\>

**`example`**
```js
import { getStorageLength } from 'leaflet.offline'
getStorageLength().then(i => console.log(i + 'tiles in storage'))
```

#### Returns

`Promise`<`number`\>

#### Defined in

[TileManager.ts:55](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L55)

___

### getStoredTilesAsJson

▸ **getStoredTilesAsJson**(`layer`, `tiles`): `FeatureCollection`

Get a geojson of tiles from one resource

**`example`**
const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const getGeoJsonData = () => LeafletOffline.getStorageInfo(urlTemplate)
 .then((data) => LeafletOffline.getStoredTilesAsJson(baseLayer, data));

getGeoJsonData().then((geojson) => {
  storageLayer = L.geoJSON(geojson).bindPopup(
    (clickedLayer) => clickedLayer.feature.properties.key,
  );
});

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | `GridLayer` |
| `tiles` | `TileInfo`[] |

#### Returns

`FeatureCollection`

#### Defined in

[TileManager.ts:143](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L143)

___

### removeTile

▸ **removeTile**(`key`): `Promise`<`void`\>

Remove tile by key

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[TileManager.ts:190](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L190)

___

### saveTile

▸ **saveTile**(`tileInfo`, `blob`): `Promise`<`IDBValidKey`\>

**`example`**
```js
saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileInfo` | `TileInfo` |
| `blob` | `Blob` |

#### Returns

`Promise`<`IDBValidKey`\>

#### Defined in

[TileManager.ts:96](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L96)

___

### savetiles

▸ **savetiles**(`baseLayer`, `options`): `ControlSaveTiles`

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLayer` | `TileLayerOffline` |
| `options` | `SaveTileOptionsArg` |

#### Returns

`ControlSaveTiles`

#### Defined in

[ControlSaveTiles.ts:252](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/ControlSaveTiles.ts#L252)

___

### tileLayerOffline

▸ **tileLayerOffline**(`url`, `options`): `TileLayerOffline`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options` | `TileLayerOptions` |

#### Returns

`TileLayerOffline`

#### Defined in

[TileLayerOffline.ts:100](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileLayerOffline.ts#L100)

___

### truncate

▸ **truncate**(): `Promise`<`void`\>

Remove everything

#### Returns

`Promise`<`void`\>

#### Defined in

[TileManager.ts:206](https://github.com/allartk/leaflet.offline/blob/ecbebae/src/TileManager.ts#L206)
