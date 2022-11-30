[leaflet.offline](README.md) / Exports

# leaflet.offline

## Table of contents

### Classes

- [ControlSaveTiles](classes/ControlSaveTiles.md)
- [TileLayerOffline](classes/TileLayerOffline.md)

### Interfaces

- [SaveStatus](interfaces/SaveStatus.md)
- [SaveTileOptions](interfaces/SaveTileOptions.md)

### Type Aliases

- [TileInfo](modules.md#tileinfo)

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

## Type Aliases

### TileInfo

Ƭ **TileInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createdAt` | `number` |
| `key` | `string` |
| `url` | `string` |
| `urlTemplate` | `string` |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Defined in

[src/TileManager.ts:13](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L13)

## Functions

### downloadTile

▸ **downloadTile**(`tileUrl`): `Promise`<`Blob`\>

**`Example`**

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

[src/TileManager.ts:80](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L80)

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

[src/TileManager.ts:196](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L196)

___

### getStorageInfo

▸ **getStorageInfo**(`urlTemplate`): `Promise`<[`TileInfo`](modules.md#tileinfo)[]\>

**`Example`**

```js
import { getStorageInfo } from 'leaflet.offline'
getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `urlTemplate` | `string` |

#### Returns

`Promise`<[`TileInfo`](modules.md#tileinfo)[]\>

#### Defined in

[src/TileManager.ts:67](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L67)

___

### getStorageLength

▸ **getStorageLength**(): `Promise`<`number`\>

**`Example`**

```js
import { getStorageLength } from 'leaflet.offline'
getStorageLength().then(i => console.log(i + 'tiles in storage'))
```

#### Returns

`Promise`<`number`\>

#### Defined in

[src/TileManager.ts:55](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L55)

___

### getStoredTilesAsJson

▸ **getStoredTilesAsJson**(`layer`, `tiles`): `FeatureCollection`

Get a geojson of tiles from one resource

**`Example`**

```ts
const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const getGeoJsonData = () => LeafletOffline.getStorageInfo(urlTemplate)
 .then((data) => LeafletOffline.getStoredTilesAsJson(baseLayer, data));

getGeoJsonData().then((geojson) => {
  storageLayer = L.geoJSON(geojson).bindPopup(
    (clickedLayer) => clickedLayer.feature.properties.key,
  );
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | `GridLayer` |
| `tiles` | [`TileInfo`](modules.md#tileinfo)[] |

#### Returns

`FeatureCollection`

#### Defined in

[src/TileManager.ts:141](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L141)

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

[src/TileManager.ts:188](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L188)

___

### saveTile

▸ **saveTile**(`tileInfo`, `blob`): `Promise`<`IDBValidKey`\>

**`Example`**

```js
saveTile(tileInfo, blob).then(() => console.log(`saved tile from ${tileInfo.url}`))
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileInfo` | [`TileInfo`](modules.md#tileinfo) |
| `blob` | `Blob` |

#### Returns

`Promise`<`IDBValidKey`\>

#### Defined in

[src/TileManager.ts:93](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L93)

___

### savetiles

▸ **savetiles**(`baseLayer`, `options`): [`ControlSaveTiles`](classes/ControlSaveTiles.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLayer` | [`TileLayerOffline`](classes/TileLayerOffline.md) |
| `options` | `Partial`<[`SaveTileOptions`](interfaces/SaveTileOptions.md)\> |

#### Returns

[`ControlSaveTiles`](classes/ControlSaveTiles.md)

#### Defined in

[src/ControlSaveTiles.ts:254](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L254)

___

### tileLayerOffline

▸ **tileLayerOffline**(`url`, `options`): [`TileLayerOffline`](classes/TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options` | `TileLayerOptions` |

#### Returns

[`TileLayerOffline`](classes/TileLayerOffline.md)

#### Defined in

[src/TileLayerOffline.ts:100](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileLayerOffline.ts#L100)

___

### truncate

▸ **truncate**(): `Promise`<`void`\>

Remove everything

#### Returns

`Promise`<`void`\>

#### Defined in

[src/TileManager.ts:211](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileManager.ts#L211)
