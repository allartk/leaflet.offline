[leaflet.offline](../README.md) / [Exports](../modules.md) / TileLayerOffline

# Class: TileLayerOffline

## Hierarchy

- `TileLayer`

  ↳ **`TileLayerOffline`**

## Table of contents

### Constructors

- [constructor](TileLayerOffline.md#constructor)

### Properties

- [\_map](TileLayerOffline.md#_map)
- [\_tileZoom](TileLayerOffline.md#_tilezoom)
- [\_tiles](TileLayerOffline.md#_tiles)
- [\_url](TileLayerOffline.md#_url)
- [options](TileLayerOffline.md#options)

### Methods

- [\_abortLoading](TileLayerOffline.md#_abortloading)
- [\_getStorageKey](TileLayerOffline.md#_getstoragekey)
- [\_getZoomForUrl](TileLayerOffline.md#_getzoomforurl)
- [\_tileCoordsToKey](TileLayerOffline.md#_tilecoordstokey)
- [\_tileOnError](TileLayerOffline.md#_tileonerror)
- [\_tileOnLoad](TileLayerOffline.md#_tileonload)
- [\_wrapCoords](TileLayerOffline.md#_wrapcoords)
- [addEventListener](TileLayerOffline.md#addeventlistener)
- [addEventParent](TileLayerOffline.md#addeventparent)
- [addOneTimeEventListener](TileLayerOffline.md#addonetimeeventlistener)
- [addTo](TileLayerOffline.md#addto)
- [beforeAdd](TileLayerOffline.md#beforeadd)
- [bindPopup](TileLayerOffline.md#bindpopup)
- [bindTooltip](TileLayerOffline.md#bindtooltip)
- [bringToBack](TileLayerOffline.md#bringtoback)
- [bringToFront](TileLayerOffline.md#bringtofront)
- [clearAllEventListeners](TileLayerOffline.md#clearalleventlisteners)
- [closePopup](TileLayerOffline.md#closepopup)
- [closeTooltip](TileLayerOffline.md#closetooltip)
- [createTile](TileLayerOffline.md#createtile)
- [fire](TileLayerOffline.md#fire)
- [fireEvent](TileLayerOffline.md#fireevent)
- [getAttribution](TileLayerOffline.md#getattribution)
- [getContainer](TileLayerOffline.md#getcontainer)
- [getEvents](TileLayerOffline.md#getevents)
- [getPane](TileLayerOffline.md#getpane)
- [getPopup](TileLayerOffline.md#getpopup)
- [getTileSize](TileLayerOffline.md#gettilesize)
- [getTileUrl](TileLayerOffline.md#gettileurl)
- [getTileUrls](TileLayerOffline.md#gettileurls)
- [getTooltip](TileLayerOffline.md#gettooltip)
- [hasEventListeners](TileLayerOffline.md#haseventlisteners)
- [isLoading](TileLayerOffline.md#isloading)
- [isPopupOpen](TileLayerOffline.md#ispopupopen)
- [isTooltipOpen](TileLayerOffline.md#istooltipopen)
- [listens](TileLayerOffline.md#listens)
- [off](TileLayerOffline.md#off)
- [on](TileLayerOffline.md#on)
- [onAdd](TileLayerOffline.md#onadd)
- [onRemove](TileLayerOffline.md#onremove)
- [once](TileLayerOffline.md#once)
- [openPopup](TileLayerOffline.md#openpopup)
- [openTooltip](TileLayerOffline.md#opentooltip)
- [redraw](TileLayerOffline.md#redraw)
- [remove](TileLayerOffline.md#remove)
- [removeEventListener](TileLayerOffline.md#removeeventlistener)
- [removeEventParent](TileLayerOffline.md#removeeventparent)
- [removeFrom](TileLayerOffline.md#removefrom)
- [setDataUrl](TileLayerOffline.md#setdataurl)
- [setOpacity](TileLayerOffline.md#setopacity)
- [setPopupContent](TileLayerOffline.md#setpopupcontent)
- [setTooltipContent](TileLayerOffline.md#settooltipcontent)
- [setUrl](TileLayerOffline.md#seturl)
- [setZIndex](TileLayerOffline.md#setzindex)
- [togglePopup](TileLayerOffline.md#togglepopup)
- [toggleTooltip](TileLayerOffline.md#toggletooltip)
- [unbindPopup](TileLayerOffline.md#unbindpopup)
- [unbindTooltip](TileLayerOffline.md#unbindtooltip)
- [addInitHook](TileLayerOffline.md#addinithook)
- [extend](TileLayerOffline.md#extend)
- [include](TileLayerOffline.md#include)
- [mergeOptions](TileLayerOffline.md#mergeoptions)

## Constructors

### constructor

• **new TileLayerOffline**(`urlTemplate`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `urlTemplate` | `string` |
| `options?` | `TileLayerOptions` |

#### Inherited from

TileLayer.constructor

#### Defined in

node_modules/@types/leaflet/index.d.ts:848

## Properties

### \_map

• `Protected` **\_map**: `Map`

#### Inherited from

TileLayer.\_map

#### Defined in

node_modules/@types/leaflet/index.d.ts:762

___

### \_tileZoom

• `Protected` `Optional` **\_tileZoom**: `number`

#### Inherited from

TileLayer.\_tileZoom

#### Defined in

node_modules/@types/leaflet/index.d.ts:821

___

### \_tiles

• `Protected` **\_tiles**: `InternalTiles`

#### Inherited from

TileLayer.\_tiles

#### Defined in

node_modules/@types/leaflet/index.d.ts:820

___

### \_url

• **\_url**: `string`

#### Defined in

[src/TileLayerOffline.ts:18](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileLayerOffline.ts#L18)

___

### options

• **options**: `TileLayerOptions`

#### Inherited from

TileLayer.options

#### Defined in

node_modules/@types/leaflet/index.d.ts:857

## Methods

### \_abortLoading

▸ `Protected` **_abortLoading**(): `void`

#### Returns

`void`

#### Inherited from

TileLayer.\_abortLoading

#### Defined in

node_modules/@types/leaflet/index.d.ts:854

___

### \_getStorageKey

▸ `Private` **_getStorageKey**(`coords`): `string`

get key to use for storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `coords` | `Object` |
| `coords.x` | `number` |
| `coords.y` | `number` |
| `coords.z` | `number` |

#### Returns

`string`

unique identifier.

#### Defined in

[src/TileLayerOffline.ts:57](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileLayerOffline.ts#L57)

___

### \_getZoomForUrl

▸ `Protected` **_getZoomForUrl**(): `number`

#### Returns

`number`

#### Inherited from

TileLayer.\_getZoomForUrl

#### Defined in

node_modules/@types/leaflet/index.d.ts:855

___

### \_tileCoordsToKey

▸ `Protected` **_tileCoordsToKey**(`coords`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coords` | `Coords` |

#### Returns

`string`

#### Inherited from

TileLayer.\_tileCoordsToKey

#### Defined in

node_modules/@types/leaflet/index.d.ts:817

___

### \_tileOnError

▸ `Protected` **_tileOnError**(`done`, `tile`, `e`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `done` | `DoneCallback` |
| `tile` | `HTMLElement` |
| `e` | `Error` |

#### Returns

`void`

#### Inherited from

TileLayer.\_tileOnError

#### Defined in

node_modules/@types/leaflet/index.d.ts:853

___

### \_tileOnLoad

▸ `Protected` **_tileOnLoad**(`done`, `tile`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `done` | `DoneCallback` |
| `tile` | `HTMLElement` |

#### Returns

`void`

#### Inherited from

TileLayer.\_tileOnLoad

#### Defined in

node_modules/@types/leaflet/index.d.ts:852

___

### \_wrapCoords

▸ `Protected` **_wrapCoords**(`parameter`): `Coords`

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `Coords` |

#### Returns

`Coords`

#### Inherited from

TileLayer.\_wrapCoords

#### Defined in

node_modules/@types/leaflet/index.d.ts:818

___

### addEventListener

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for on(...)

Adds a listener function (fn) to a particular event type of the object.
You can optionally specify the context of the listener (object the this
keyword will point to). You can also pass several space-separated types
(e.g. 'click dblclick').

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:538

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"baselayerchange"`` \| ``"overlayadd"`` \| ``"overlayremove"`` |
| `fn` | `LayersControlEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:539

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"layeradd"`` \| ``"layerremove"`` |
| `fn` | `LayerEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:541

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomlevelschange"`` \| ``"unload"`` \| ``"viewreset"`` \| ``"load"`` \| ``"zoomstart"`` \| ``"movestart"`` \| ``"zoom"`` \| ``"move"`` \| ``"zoomend"`` \| ``"moveend"`` \| ``"autopanstart"`` \| ``"dragstart"`` \| ``"drag"`` \| ``"add"`` \| ``"remove"`` \| ``"loading"`` \| ``"error"`` \| ``"update"`` \| ``"down"`` \| ``"predrag"`` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:543

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"resize"`` |
| `fn` | `ResizeEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:548

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"popupopen"`` \| ``"popupclose"`` |
| `fn` | `PopupEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:550

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tooltipopen"`` \| ``"tooltipclose"`` |
| `fn` | `TooltipEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:552

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationerror"`` |
| `fn` | `ErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:554

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationfound"`` |
| `fn` | `LocationEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:556

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"click"`` \| ``"dblclick"`` \| ``"mousedown"`` \| ``"mouseup"`` \| ``"mouseover"`` \| ``"mouseout"`` \| ``"mousemove"`` \| ``"contextmenu"`` \| ``"preclick"`` |
| `fn` | `LeafletMouseEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:558

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"keypress"`` \| ``"keydown"`` \| ``"keyup"`` |
| `fn` | `LeafletKeyboardEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:561

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomanim"`` |
| `fn` | `ZoomAnimEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:563

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"dragend"`` |
| `fn` | `DragEndEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:565

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileunload"`` \| ``"tileloadstart"`` \| ``"tileload"`` |
| `fn` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:567

▸ **addEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileerror"`` |
| `fn` | `TileErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:569

▸ **addEventListener**(`eventMap`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for on(...)

Adds a set of type/listener pairs, e.g. {click: onClick, mousemove: onMouseMove}

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventMap` | `LeafletEventHandlerFnMap` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:577

___

### addEventParent

▸ **addEventParent**(`obj`): [`TileLayerOffline`](TileLayerOffline.md)

Adds an event parent - an Evented that will receive propagated events

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Evented` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addEventParent

#### Defined in

node_modules/@types/leaflet/index.d.ts:522

___

### addOneTimeEventListener

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for once(...)

Behaves as on(...), except the listener will only get fired once and then removed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:644

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"baselayerchange"`` \| ``"overlayadd"`` \| ``"overlayremove"`` |
| `fn` | `LayersControlEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:645

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"layeradd"`` \| ``"layerremove"`` |
| `fn` | `LayerEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:647

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomlevelschange"`` \| ``"unload"`` \| ``"viewreset"`` \| ``"load"`` \| ``"zoomstart"`` \| ``"movestart"`` \| ``"zoom"`` \| ``"move"`` \| ``"zoomend"`` \| ``"moveend"`` \| ``"autopanstart"`` \| ``"dragstart"`` \| ``"drag"`` \| ``"add"`` \| ``"remove"`` \| ``"loading"`` \| ``"error"`` \| ``"update"`` \| ``"down"`` \| ``"predrag"`` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:649

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"resize"`` |
| `fn` | `ResizeEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:654

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"popupopen"`` \| ``"popupclose"`` |
| `fn` | `PopupEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:656

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tooltipopen"`` \| ``"tooltipclose"`` |
| `fn` | `TooltipEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:658

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationerror"`` |
| `fn` | `ErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:660

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationfound"`` |
| `fn` | `LocationEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:662

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"click"`` \| ``"dblclick"`` \| ``"mousedown"`` \| ``"mouseup"`` \| ``"mouseover"`` \| ``"mouseout"`` \| ``"mousemove"`` \| ``"contextmenu"`` \| ``"preclick"`` |
| `fn` | `LeafletMouseEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:664

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"keypress"`` \| ``"keydown"`` \| ``"keyup"`` |
| `fn` | `LeafletKeyboardEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:667

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomanim"`` |
| `fn` | `ZoomAnimEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:669

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"dragend"`` |
| `fn` | `DragEndEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:671

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileunload"`` \| ``"tileloadstart"`` \| ``"tileload"`` |
| `fn` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:673

▸ **addOneTimeEventListener**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileerror"`` |
| `fn` | `TileErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:675

▸ **addOneTimeEventListener**(`eventMap`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for once(...)

Behaves as on(...), except the listener will only get fired once and then removed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventMap` | `LeafletEventHandlerFnMap` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addOneTimeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:683

___

### addTo

▸ **addTo**(`map`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` \| `LayerGroup`<`any`\> |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.addTo

#### Defined in

node_modules/@types/leaflet/index.d.ts:730

___

### beforeAdd

▸ `Optional` **beforeAdd**(`map`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.beforeAdd

#### Defined in

node_modules/@types/leaflet/index.d.ts:760

___

### bindPopup

▸ **bindPopup**(`content`, `options?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | (`layer`: `Layer`) => `Content` \| `Content` \| `Popup` |
| `options?` | `PopupOptions` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.bindPopup

#### Defined in

node_modules/@types/leaflet/index.d.ts:736

___

### bindTooltip

▸ **bindTooltip**(`content`, `options?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `Content` \| (`layer`: `Layer`) => `Content` \| `Tooltip` |
| `options?` | `TooltipOptions` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.bindTooltip

#### Defined in

node_modules/@types/leaflet/index.d.ts:746

___

### bringToBack

▸ **bringToBack**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.bringToBack

#### Defined in

node_modules/@types/leaflet/index.d.ts:808

___

### bringToFront

▸ **bringToFront**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.bringToFront

#### Defined in

node_modules/@types/leaflet/index.d.ts:807

___

### clearAllEventListeners

▸ **clearAllEventListeners**(): [`TileLayerOffline`](TileLayerOffline.md)

Alias for off()

Removes all listeners to all events on the object.

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.clearAllEventListeners

#### Defined in

node_modules/@types/leaflet/index.d.ts:636

___

### closePopup

▸ **closePopup**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.closePopup

#### Defined in

node_modules/@types/leaflet/index.d.ts:739

___

### closeTooltip

▸ **closeTooltip**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.closeTooltip

#### Defined in

node_modules/@types/leaflet/index.d.ts:749

___

### createTile

▸ **createTile**(`coords`, `done`): `HTMLElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coords` | `Coords` |
| `done` | `DoneCallback` |

#### Returns

`HTMLElement`

#### Overrides

TileLayer.createTile

#### Defined in

[src/TileLayerOffline.ts:20](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileLayerOffline.ts#L20)

___

### fire

▸ **fire**(`type`, `data?`, `propagate?`): [`TileLayerOffline`](TileLayerOffline.md)

Fires an event of the specified type. You can optionally provide a data
object — the first argument of the listener function will contain its properties.
The event might can optionally be propagated to event parents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `data?` | `any` |
| `propagate?` | `boolean` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.fire

#### Defined in

node_modules/@types/leaflet/index.d.ts:468

___

### fireEvent

▸ **fireEvent**(`type`, `data?`, `propagate?`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for fire(...)

Fires an event of the specified type. You can optionally provide a data
object — the first argument of the listener function will contain its properties.
The event might can optionally be propagated to event parents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `data?` | `any` |
| `propagate?` | `boolean` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.fireEvent

#### Defined in

node_modules/@types/leaflet/index.d.ts:693

___

### getAttribution

▸ `Optional` **getAttribution**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Inherited from

TileLayer.getAttribution

#### Defined in

node_modules/@types/leaflet/index.d.ts:759

___

### getContainer

▸ **getContainer**(): ``null`` \| `HTMLElement`

#### Returns

``null`` \| `HTMLElement`

#### Inherited from

TileLayer.getContainer

#### Defined in

node_modules/@types/leaflet/index.d.ts:809

___

### getEvents

▸ `Optional` **getEvents**(): `Object`

#### Returns

`Object`

#### Inherited from

TileLayer.getEvents

#### Defined in

node_modules/@types/leaflet/index.d.ts:758

___

### getPane

▸ **getPane**(`name?`): `undefined` \| `HTMLElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |

#### Returns

`undefined` \| `HTMLElement`

#### Inherited from

TileLayer.getPane

#### Defined in

node_modules/@types/leaflet/index.d.ts:733

___

### getPopup

▸ **getPopup**(): `undefined` \| `Popup`

#### Returns

`undefined` \| `Popup`

#### Inherited from

TileLayer.getPopup

#### Defined in

node_modules/@types/leaflet/index.d.ts:743

___

### getTileSize

▸ **getTileSize**(): `Point`

#### Returns

`Point`

#### Inherited from

TileLayer.getTileSize

#### Defined in

node_modules/@types/leaflet/index.d.ts:814

___

### getTileUrl

▸ **getTileUrl**(`coords`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coords` | `Coords` |

#### Returns

`string`

#### Inherited from

TileLayer.getTileUrl

#### Defined in

node_modules/@types/leaflet/index.d.ts:850

___

### getTileUrls

▸ **getTileUrls**(`bounds`, `zoom`): [`TileInfo`](../modules.md#tileinfo)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `bounds` | `Bounds` |
| `zoom` | `number` |

#### Returns

[`TileInfo`](../modules.md#tileinfo)[]

#### Defined in

[src/TileLayerOffline.ts:66](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileLayerOffline.ts#L66)

___

### getTooltip

▸ **getTooltip**(): `undefined` \| `Tooltip`

#### Returns

`undefined` \| `Tooltip`

#### Inherited from

TileLayer.getTooltip

#### Defined in

node_modules/@types/leaflet/index.d.ts:753

___

### hasEventListeners

▸ **hasEventListeners**(`type`): `boolean`

Alias for listens(...)

Returns true if a particular event type has any listeners attached to it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`boolean`

#### Inherited from

TileLayer.hasEventListeners

#### Defined in

node_modules/@types/leaflet/index.d.ts:700

___

### isLoading

▸ **isLoading**(): `boolean`

#### Returns

`boolean`

#### Inherited from

TileLayer.isLoading

#### Defined in

node_modules/@types/leaflet/index.d.ts:812

___

### isPopupOpen

▸ **isPopupOpen**(): `boolean`

#### Returns

`boolean`

#### Inherited from

TileLayer.isPopupOpen

#### Defined in

node_modules/@types/leaflet/index.d.ts:741

___

### isTooltipOpen

▸ **isTooltipOpen**(): `boolean`

#### Returns

`boolean`

#### Inherited from

TileLayer.isTooltipOpen

#### Defined in

node_modules/@types/leaflet/index.d.ts:751

___

### listens

▸ **listens**(`type`): `boolean`

Returns true if a particular event type has any listeners attached to it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`boolean`

#### Inherited from

TileLayer.listens

#### Defined in

node_modules/@types/leaflet/index.d.ts:473

___

### off

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

Removes a previously added listener function. If no function is specified,
it will remove all the listeners of that particular event from the object.
Note that if you passed a custom context to on, you must pass the same context
to off in order to remove the listener.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fn?` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:417

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"baselayerchange"`` \| ``"overlayadd"`` \| ``"overlayremove"`` |
| `fn?` | `LayersControlEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:418

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"layeradd"`` \| ``"layerremove"`` |
| `fn?` | `LayerEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:420

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomlevelschange"`` \| ``"unload"`` \| ``"viewreset"`` \| ``"load"`` \| ``"zoomstart"`` \| ``"movestart"`` \| ``"zoom"`` \| ``"move"`` \| ``"zoomend"`` \| ``"moveend"`` \| ``"autopanstart"`` \| ``"dragstart"`` \| ``"drag"`` \| ``"add"`` \| ``"remove"`` \| ``"loading"`` \| ``"error"`` \| ``"update"`` \| ``"down"`` \| ``"predrag"`` |
| `fn?` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:422

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"resize"`` |
| `fn?` | `ResizeEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:427

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"popupopen"`` \| ``"popupclose"`` |
| `fn?` | `PopupEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:429

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tooltipopen"`` \| ``"tooltipclose"`` |
| `fn?` | `TooltipEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:431

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationerror"`` |
| `fn?` | `ErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:433

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationfound"`` |
| `fn?` | `LocationEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:435

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"click"`` \| ``"dblclick"`` \| ``"mousedown"`` \| ``"mouseup"`` \| ``"mouseover"`` \| ``"mouseout"`` \| ``"mousemove"`` \| ``"contextmenu"`` \| ``"preclick"`` |
| `fn?` | `LeafletMouseEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:437

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"keypress"`` \| ``"keydown"`` \| ``"keyup"`` |
| `fn?` | `LeafletKeyboardEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:440

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomanim"`` |
| `fn?` | `ZoomAnimEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:442

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"dragend"`` |
| `fn?` | `DragEndEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:444

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileunload"`` \| ``"tileloadstart"`` \| ``"tileload"`` |
| `fn?` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:446

▸ **off**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileerror"`` |
| `fn?` | `TileErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:448

▸ **off**(`eventMap`): [`TileLayerOffline`](TileLayerOffline.md)

Removes a set of type/listener pairs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventMap` | `LeafletEventHandlerFnMap` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:455

▸ **off**(): [`TileLayerOffline`](TileLayerOffline.md)

Removes all listeners to all events on the object.

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.off

#### Defined in

node_modules/@types/leaflet/index.d.ts:460

___

### on

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

Adds a listener function (fn) to a particular event type of the object.
You can optionally specify the context of the listener (object the this
keyword will point to). You can also pass several space-separated types
(e.g. 'click dblclick').

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:370

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"baselayerchange"`` \| ``"overlayadd"`` \| ``"overlayremove"`` |
| `fn` | `LayersControlEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:371

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"layeradd"`` \| ``"layerremove"`` |
| `fn` | `LayerEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:373

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomlevelschange"`` \| ``"unload"`` \| ``"viewreset"`` \| ``"load"`` \| ``"zoomstart"`` \| ``"movestart"`` \| ``"zoom"`` \| ``"move"`` \| ``"zoomend"`` \| ``"moveend"`` \| ``"autopanstart"`` \| ``"dragstart"`` \| ``"drag"`` \| ``"add"`` \| ``"remove"`` \| ``"loading"`` \| ``"error"`` \| ``"update"`` \| ``"down"`` \| ``"predrag"`` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:375

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"resize"`` |
| `fn` | `ResizeEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:380

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"popupopen"`` \| ``"popupclose"`` |
| `fn` | `PopupEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:382

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tooltipopen"`` \| ``"tooltipclose"`` |
| `fn` | `TooltipEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:384

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationerror"`` |
| `fn` | `ErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:386

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationfound"`` |
| `fn` | `LocationEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:388

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"click"`` \| ``"dblclick"`` \| ``"mousedown"`` \| ``"mouseup"`` \| ``"mouseover"`` \| ``"mouseout"`` \| ``"mousemove"`` \| ``"contextmenu"`` \| ``"preclick"`` |
| `fn` | `LeafletMouseEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:390

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"keypress"`` \| ``"keydown"`` \| ``"keyup"`` |
| `fn` | `LeafletKeyboardEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:393

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomanim"`` |
| `fn` | `ZoomAnimEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:395

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"dragend"`` |
| `fn` | `DragEndEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:397

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileunload"`` \| ``"tileloadstart"`` \| ``"tileload"`` |
| `fn` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:399

▸ **on**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileerror"`` |
| `fn` | `TileErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:401

▸ **on**(`eventMap`): [`TileLayerOffline`](TileLayerOffline.md)

Adds a set of type/listener pairs, e.g. {click: onClick, mousemove: onMouseMove}

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventMap` | `LeafletEventHandlerFnMap` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.on

#### Defined in

node_modules/@types/leaflet/index.d.ts:407

___

### onAdd

▸ **onAdd**(`map`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.onAdd

#### Defined in

node_modules/@types/leaflet/index.d.ts:756

___

### onRemove

▸ **onRemove**(`map`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.onRemove

#### Defined in

node_modules/@types/leaflet/index.d.ts:757

___

### once

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

Behaves as on(...), except the listener will only get fired once and then removed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:479

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"baselayerchange"`` \| ``"overlayadd"`` \| ``"overlayremove"`` |
| `fn` | `LayersControlEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:480

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"layeradd"`` \| ``"layerremove"`` |
| `fn` | `LayerEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:482

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomlevelschange"`` \| ``"unload"`` \| ``"viewreset"`` \| ``"load"`` \| ``"zoomstart"`` \| ``"movestart"`` \| ``"zoom"`` \| ``"move"`` \| ``"zoomend"`` \| ``"moveend"`` \| ``"autopanstart"`` \| ``"dragstart"`` \| ``"drag"`` \| ``"add"`` \| ``"remove"`` \| ``"loading"`` \| ``"error"`` \| ``"update"`` \| ``"down"`` \| ``"predrag"`` |
| `fn` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:484

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"resize"`` |
| `fn` | `ResizeEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:489

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"popupopen"`` \| ``"popupclose"`` |
| `fn` | `PopupEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:491

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tooltipopen"`` \| ``"tooltipclose"`` |
| `fn` | `TooltipEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:493

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationerror"`` |
| `fn` | `ErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:495

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationfound"`` |
| `fn` | `LocationEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:497

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"click"`` \| ``"dblclick"`` \| ``"mousedown"`` \| ``"mouseup"`` \| ``"mouseover"`` \| ``"mouseout"`` \| ``"mousemove"`` \| ``"contextmenu"`` \| ``"preclick"`` |
| `fn` | `LeafletMouseEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:499

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"keypress"`` \| ``"keydown"`` \| ``"keyup"`` |
| `fn` | `LeafletKeyboardEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:502

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomanim"`` |
| `fn` | `ZoomAnimEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:504

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"dragend"`` |
| `fn` | `DragEndEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:506

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileunload"`` \| ``"tileloadstart"`` \| ``"tileload"`` |
| `fn` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:508

▸ **once**(`type`, `fn`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileerror"`` |
| `fn` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:510

▸ **once**(`eventMap`): [`TileLayerOffline`](TileLayerOffline.md)

Behaves as on(...), except the listener will only get fired once and then removed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventMap` | `LeafletEventHandlerFnMap` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.once

#### Defined in

node_modules/@types/leaflet/index.d.ts:516

___

### openPopup

▸ **openPopup**(`latlng?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `latlng?` | `LatLngExpression` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.openPopup

#### Defined in

node_modules/@types/leaflet/index.d.ts:738

___

### openTooltip

▸ **openTooltip**(`latlng?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `latlng?` | `LatLngExpression` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.openTooltip

#### Defined in

node_modules/@types/leaflet/index.d.ts:748

___

### redraw

▸ **redraw**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.redraw

#### Defined in

node_modules/@types/leaflet/index.d.ts:813

___

### remove

▸ **remove**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.remove

#### Defined in

node_modules/@types/leaflet/index.d.ts:731

___

### removeEventListener

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for off(...)

Removes a previously added listener function. If no function is specified,
it will remove all the listeners of that particular event from the object.
Note that if you passed a custom context to on, you must pass the same context
to off in order to remove the listener.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fn?` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:589

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"baselayerchange"`` \| ``"overlayadd"`` \| ``"overlayremove"`` |
| `fn?` | `LayersControlEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:590

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"layeradd"`` \| ``"layerremove"`` |
| `fn?` | `LayerEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:592

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomlevelschange"`` \| ``"unload"`` \| ``"viewreset"`` \| ``"load"`` \| ``"zoomstart"`` \| ``"movestart"`` \| ``"zoom"`` \| ``"move"`` \| ``"zoomend"`` \| ``"moveend"`` \| ``"autopanstart"`` \| ``"dragstart"`` \| ``"drag"`` \| ``"add"`` \| ``"remove"`` \| ``"loading"`` \| ``"error"`` \| ``"update"`` \| ``"down"`` \| ``"predrag"`` |
| `fn?` | `LeafletEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:594

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"resize"`` |
| `fn?` | `ResizeEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:599

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"popupopen"`` \| ``"popupclose"`` |
| `fn?` | `PopupEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:601

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tooltipopen"`` \| ``"tooltipclose"`` |
| `fn?` | `TooltipEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:603

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationerror"`` |
| `fn?` | `ErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:605

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"locationfound"`` |
| `fn?` | `LocationEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:607

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"click"`` \| ``"dblclick"`` \| ``"mousedown"`` \| ``"mouseup"`` \| ``"mouseover"`` \| ``"mouseout"`` \| ``"mousemove"`` \| ``"contextmenu"`` \| ``"preclick"`` |
| `fn?` | `LeafletMouseEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:609

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"keypress"`` \| ``"keydown"`` \| ``"keyup"`` |
| `fn?` | `LeafletKeyboardEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:612

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"zoomanim"`` |
| `fn?` | `ZoomAnimEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:614

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"dragend"`` |
| `fn?` | `DragEndEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:616

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileunload"`` \| ``"tileloadstart"`` \| ``"tileload"`` |
| `fn?` | `TileEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:618

▸ **removeEventListener**(`type`, `fn?`, `context?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"tileerror"`` |
| `fn?` | `TileErrorEventHandlerFn` |
| `context?` | `any` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:620

▸ **removeEventListener**(`eventMap`): [`TileLayerOffline`](TileLayerOffline.md)

Alias for off(...)

Removes a set of type/listener pairs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventMap` | `LeafletEventHandlerFnMap` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventListener

#### Defined in

node_modules/@types/leaflet/index.d.ts:628

___

### removeEventParent

▸ **removeEventParent**(`obj`): [`TileLayerOffline`](TileLayerOffline.md)

Removes an event parent, so it will stop receiving propagated events

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Evented` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeEventParent

#### Defined in

node_modules/@types/leaflet/index.d.ts:527

___

### removeFrom

▸ **removeFrom**(`map`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.removeFrom

#### Defined in

node_modules/@types/leaflet/index.d.ts:732

___

### setDataUrl

▸ **setDataUrl**(`coords`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `coords` | `Object` |
| `coords.x` | `number` |
| `coords.y` | `number` |
| `coords.z` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/TileLayerOffline.ts:42](https://github.com/allartk/leaflet.offline/blob/c681d1c/src/TileLayerOffline.ts#L42)

___

### setOpacity

▸ **setOpacity**(`opacity`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opacity` | `number` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.setOpacity

#### Defined in

node_modules/@types/leaflet/index.d.ts:810

___

### setPopupContent

▸ **setPopupContent**(`content`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `Content` \| `Popup` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.setPopupContent

#### Defined in

node_modules/@types/leaflet/index.d.ts:742

___

### setTooltipContent

▸ **setTooltipContent**(`content`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `Content` \| `Tooltip` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.setTooltipContent

#### Defined in

node_modules/@types/leaflet/index.d.ts:752

___

### setUrl

▸ **setUrl**(`url`, `noRedraw?`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `noRedraw?` | `boolean` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.setUrl

#### Defined in

node_modules/@types/leaflet/index.d.ts:849

___

### setZIndex

▸ **setZIndex**(`zIndex`): [`TileLayerOffline`](TileLayerOffline.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `zIndex` | `number` |

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.setZIndex

#### Defined in

node_modules/@types/leaflet/index.d.ts:811

___

### togglePopup

▸ **togglePopup**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.togglePopup

#### Defined in

node_modules/@types/leaflet/index.d.ts:740

___

### toggleTooltip

▸ **toggleTooltip**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.toggleTooltip

#### Defined in

node_modules/@types/leaflet/index.d.ts:750

___

### unbindPopup

▸ **unbindPopup**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.unbindPopup

#### Defined in

node_modules/@types/leaflet/index.d.ts:737

___

### unbindTooltip

▸ **unbindTooltip**(): [`TileLayerOffline`](TileLayerOffline.md)

#### Returns

[`TileLayerOffline`](TileLayerOffline.md)

#### Inherited from

TileLayer.unbindTooltip

#### Defined in

node_modules/@types/leaflet/index.d.ts:747

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

TileLayer.addInitHook

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

TileLayer.addInitHook

#### Defined in

node_modules/@types/leaflet/index.d.ts:26

___

### extend

▸ `Static` **extend**(`props`): (...`args`: `any`[]) => `any` & typeof `Class`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

(...`args`: `any`[]) => `any` & typeof `Class`

#### Inherited from

TileLayer.extend

#### Defined in

node_modules/@types/leaflet/index.d.ts:21

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

TileLayer.include

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

TileLayer.mergeOptions

#### Defined in

node_modules/@types/leaflet/index.d.ts:23
