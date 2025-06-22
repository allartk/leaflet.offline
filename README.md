# leaflet.offline

[![npm version](https://badge.fury.io/js/leaflet.offline.svg)](https://badge.fury.io/js/leaflet.offline)
[![codecov](https://codecov.io/github/allartk/leaflet.offline/graph/badge.svg?token=dy1uNlSvsh)](https://codecov.io/github/allartk/leaflet.offline)
[![Build Status](https://travis-ci.org/allartk/leaflet.offline.png?branch=master)](https://travis-ci.org/allartk/leaflet.offline)

This library can be used to create maps, which are still available when you are offline and are fast when your connection is not. It works in the browser or can be used in an mobile app based on html and in progressive webapps.

- [examples](https://github.com/allartk/leaflet.offline/tree/main/examples)

## Dependencies

- [Leafletjs](http://leafletjs.com/)
- [idb](https://www.npmjs.com/package/idb) To store the tiles with promises

## Install

### With npm

The package and it's dependencies can also be downloaded into
your existing project with [npm](http://npmjs.com):

```
npm install leaflet.offline
```

In your script add:

```
import 'leaflet.offline'
```

### Manual

Unpack the file for the release (find them under the releasestab ) and add dist/bundle.js in a script tag
to your page (after leaflet and idb).

### Development

For running the example locally, you'll need to clone the project and run:

```
npm i && npm run build
cd docs
npm install && npm run start
```

**pull requests welcome**

* You MUST test your code with `npm test` and  `npm run lint`. On wsl wit ubuntu 24.04, install first libasound, libnss3: `sudo apt install libasound2t64 libnss3`, see [puppeteer docs](https://pptr.dev/guides/system-requirements)
* Please one feature at a time, if you can split your PR, please do so.
* Also, do not mix a feature with package updates.
* [Use commit message conventions](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules)

## Api

Generate docs with

```
npm run-script docs
```
