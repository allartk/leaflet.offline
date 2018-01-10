leaflet.offline
===============

Working on a new version based on es6 code. For docs of the latest release look here:

**https://github.com/allartk/leaflet.offline/tree/v0.2.0**


Just a modern and slim library to store tiles offline.
Easy to use in your existing projects. Take a look at [index.html](http://allartk.github.io/leaflet.offline/) for a working example


## Dependencies

* [Leafletjs](http://leafletjs.com/) (version 1.0, look in releases if you use an older leaflet version)
* [localforage](https://github.com/localForage/localForage) To store the tiles


## Install

### Manual or Clone

Just use one of github's download methods (look under the releasestab ) and add dist/leaflet.offline.min.js in a script tag
to your page (after leaflet and localforage)

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

### Development

For running the example locally, you'll need to clone the project and run:

```
npm install
npm start
```
Visit http://localhost:3000/ and watch the page reload when you change.

## Api

Generate docs with

```
npm run-script docs
```
