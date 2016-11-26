var gulp = require('gulp');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('dist',['js','css','img']);

//shoud make a standalon js
gulp.task('js',function() {
    gulp.src('src/**/*.js')
    .pipe(concat('leaflet.offline.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css',function() {
    gulp.src('src/**/*.css')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('img',function() {
    gulp.src('src/images/*')
    .pipe(gulp.dest('./dist/images/'))
});

//creates a all in one
gulp.task('bundle',function() {
    var b = browserify([
        './src/Control.SaveTiles.js',
        './src/TileLayer.Offline.js',
    ]);
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
})


gulp.task('example',['css','img','bundle'],function() {
    //serve external libs like localforage and index.html
})
