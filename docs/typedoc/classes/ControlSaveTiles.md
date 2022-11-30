[leaflet.offline](../README.md) / [Exports](../modules.md) / ControlSaveTiles

# Class: ControlSaveTiles

## Hierarchy

- `Control`

  ↳ **`ControlSaveTiles`**

## Table of contents

### Constructors

- [constructor](ControlSaveTiles.md#constructor)

### Properties

- [\_baseLayer](ControlSaveTiles.md#_baselayer)
- [\_map](ControlSaveTiles.md#_map)
- [\_refocusOnMap](ControlSaveTiles.md#_refocusonmap)
- [options](ControlSaveTiles.md#options)
- [status](ControlSaveTiles.md#status)

### Methods

- [\_calculateTiles](ControlSaveTiles.md#_calculatetiles)
- [\_createButton](ControlSaveTiles.md#_createbutton)
- [\_loadTile](ControlSaveTiles.md#_loadtile)
- [\_resetStatus](ControlSaveTiles.md#_resetstatus)
- [\_rmTiles](ControlSaveTiles.md#_rmtiles)
- [\_saveTile](ControlSaveTiles.md#_savetile)
- [\_saveTiles](ControlSaveTiles.md#_savetiles)
- [addTo](ControlSaveTiles.md#addto)
- [getContainer](ControlSaveTiles.md#getcontainer)
- [getPosition](ControlSaveTiles.md#getposition)
- [getStorageSize](ControlSaveTiles.md#getstoragesize)
- [onAdd](ControlSaveTiles.md#onadd)
- [onRemove](ControlSaveTiles.md#onremove)
- [remove](ControlSaveTiles.md#remove)
- [setLayer](ControlSaveTiles.md#setlayer)
- [setPosition](ControlSaveTiles.md#setposition)
- [setStorageSize](ControlSaveTiles.md#setstoragesize)
- [addInitHook](ControlSaveTiles.md#addinithook)
- [extend](ControlSaveTiles.md#extend)
- [include](ControlSaveTiles.md#include)
- [mergeOptions](ControlSaveTiles.md#mergeoptions)

## Constructors

### constructor

• **new ControlSaveTiles**(`baseLayer`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLayer` | [`TileLayerOffline`](TileLayerOffline.md) |
| `options` | `Partial`<[`SaveTileOptions`](../interfaces/SaveTileOptions.md)\> |

#### Overrides

Control.constructor

#### Defined in

[src/ControlSaveTiles.ts:58](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L58)

## Properties

### \_baseLayer

• **\_baseLayer**: [`TileLayerOffline`](TileLayerOffline.md)

#### Defined in

[src/ControlSaveTiles.ts:46](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L46)

___

### \_map

• **\_map**: `Map`

#### Defined in

[src/ControlSaveTiles.ts:42](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L42)

___

### \_refocusOnMap

• **\_refocusOnMap**: `EventHandlerFn`

#### Defined in

[src/ControlSaveTiles.ts:44](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L44)

___

### options

• **options**: [`SaveTileOptions`](../interfaces/SaveTileOptions.md)

#### Overrides

Control.options

#### Defined in

[src/ControlSaveTiles.ts:48](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L48)

___

### status

• **status**: [`SaveStatus`](../interfaces/SaveStatus.md)

#### Defined in

[src/ControlSaveTiles.ts:50](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L50)

## Methods

### \_calculateTiles

▸ **_calculateTiles**(): [`TileInfo`](../modules.md#tileinfo)[]

#### Returns

[`TileInfo`](../modules.md#tileinfo)[]

#### Defined in

[src/ControlSaveTiles.ts:165](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L165)

___

### \_createButton

▸ **_createButton**(`html`, `className`, `container`, `fn`): `HTMLAnchorElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `html` | `string` |
| `className` | `string` |
| `container` | `HTMLElement` |
| `fn` | `EventHandlerFn` |

#### Returns

`HTMLAnchorElement`

#### Defined in

[src/ControlSaveTiles.ts:118](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L118)

___

### \_loadTile

▸ **_loadTile**(`tile`): `Promise`<`undefined` \| `Blob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`TileInfo`](../modules.md#tileinfo) |

#### Returns

`Promise`<`undefined` \| `Blob`\>

#### Defined in

[src/ControlSaveTiles.ts:210](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L210)

___

### \_resetStatus

▸ **_resetStatus**(`tiles`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tiles` | [`TileInfo`](../modules.md#tileinfo)[] |

#### Returns

`void`

#### Defined in

[src/ControlSaveTiles.ts:200](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L200)

___

### \_rmTiles

▸ **_rmTiles**(): `void`

#### Returns

`void`

#### Defined in

[src/ControlSaveTiles.ts:238](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L238)

___

### \_saveTile

▸ **_saveTile**(`tile`, `blob`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`TileInfo`](../modules.md#tileinfo) |
| `blob` | `Blob` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/ControlSaveTiles.ts:228](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L228)

___

### \_saveTiles

▸ **_saveTiles**(): `void`

#### Returns

`void`

#### Defined in

[src/ControlSaveTiles.ts:137](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L137)

___

### addTo

▸ **addTo**(`map`): [`ControlSaveTiles`](ControlSaveTiles.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

[`ControlSaveTiles`](ControlSaveTiles.md)

#### Inherited from

Control.addTo

#### Defined in

node_modules/@types/leaflet/index.d.ts:1433

___

### getContainer

▸ **getContainer**(): `undefined` \| `HTMLElement`

#### Returns

`undefined` \| `HTMLElement`

#### Inherited from

Control.getContainer

#### Defined in

node_modules/@types/leaflet/index.d.ts:1432

___

### getPosition

▸ **getPosition**(): `ControlPosition`

#### Returns

`ControlPosition`

#### Inherited from

Control.getPosition

#### Defined in

node_modules/@types/leaflet/index.d.ts:1430

___

### getStorageSize

▸ **getStorageSize**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | `Function` |

#### Returns

`void`

#### Defined in

[src/ControlSaveTiles.ts:93](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L93)

___

### onAdd

▸ **onAdd**(): `HTMLDivElement`

#### Returns

`HTMLDivElement`

#### Overrides

Control.onAdd

#### Defined in

[src/ControlSaveTiles.ts:105](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L105)

___

### onRemove

▸ `Optional` **onRemove**(`map`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

`void`

#### Inherited from

Control.onRemove

#### Defined in

node_modules/@types/leaflet/index.d.ts:1438

___

### remove

▸ **remove**(): [`ControlSaveTiles`](ControlSaveTiles.md)

#### Returns

[`ControlSaveTiles`](ControlSaveTiles.md)

#### Inherited from

Control.remove

#### Defined in

node_modules/@types/leaflet/index.d.ts:1434

___

### setLayer

▸ **setLayer**(`layer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | [`TileLayerOffline`](TileLayerOffline.md) |

#### Returns

`void`

#### Defined in

[src/ControlSaveTiles.ts:101](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L101)

___

### setPosition

▸ **setPosition**(`position`): [`ControlSaveTiles`](ControlSaveTiles.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `ControlPosition` |

#### Returns

[`ControlSaveTiles`](ControlSaveTiles.md)

#### Inherited from

Control.setPosition

#### Defined in

node_modules/@types/leaflet/index.d.ts:1431

___

### setStorageSize

▸ **setStorageSize**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[src/ControlSaveTiles.ts:80](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/ControlSaveTiles.ts#L80)

___

### addInitHook

▸ `Static` **addInitHook**(`initHookFn`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `initHookFn` | () => `void` |

#### Returns

`any`

#### Inherited from

Control.addInitHook

#### Defined in

node_modules/@types/leaflet/index.d.ts:25

▸ `Static` **addInitHook**(`methodName`, ...`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `methodName` | `string` |
| `...args` | `any`[] |

#### Returns

`any`

#### Inherited from

Control.addInitHook

#### Defined in

node_modules/@types/leaflet/index.d.ts:26

___

### extend

▸ `Static` **extend**<`T`\>(`props`): (...`args`: `any`[]) => `T` & typeof `Control`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `T` |

#### Returns

(...`args`: `any`[]) => `T` & typeof `Control`

#### Inherited from

Control.extend

#### Defined in

node_modules/@types/leaflet/index.d.ts:1428

___

### include

▸ `Static` **include**(`props`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`any`

#### Inherited from

Control.include

#### Defined in

node_modules/@types/leaflet/index.d.ts:22

___

### mergeOptions

▸ `Static` **mergeOptions**(`props`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`any`

#### Inherited from

Control.mergeOptions

#### Defined in

node_modules/@types/leaflet/index.d.ts:23
