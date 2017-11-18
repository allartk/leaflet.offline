leaflet.offline
===============

Just a modern and slim library to store image and vector tiles offline.
Easy to use in your existing projects. Take a look in the example folder and see how it works, or head
to **http://allartk.github.io/leaflet.offline/**!


## Dependencies

* [Leafletjs](http://leafletjs.com/) (version 1.0, look in releases if you use an older leaflet version)
* [localforage](https://github.com/localForage/localForage) To store the tiles
* ~~In progress: optional [Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid)~~


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

I encourage you to a bundler like [browserify](http://browserify.org/), webpack or so.


```
import 'leaflet.offline'
```



### Run example

For running the example, you'll need to clone the project.
Then, from the project root run and 

```
npm install
npm start
```
Visit http://localhost:3000/:

## Api

Generate docs with

```
npm docs
```
