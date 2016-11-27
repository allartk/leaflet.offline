var gulp = require('gulp');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var path = require('path');
var rename = require('gulp-rename');


// shoud make a standalon js, without localforage
gulp.task('js', function () {
	var b = browserify([
		'./src/leaflet.offline.js',
	], {
		'transform': ['browserify-shim']
	});
	   b.external('localforage')
        .bundle()
        .pipe(source('leaflet.offline.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/'));

});

gulp.task('minify', ['js'], function () {
	gulp.src(['dist/*.js', '!dist/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

// should make node entry, see https://github.com/Leaflet/Leaflet/tree/v1.0.2/dist
gulp.task('src', function () {
	gulp.src('src/**/*.js')
    .pipe(concat('leaflet.offline-src.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});

gulp.task('css', function () {
	gulp.src('src/**/*.css')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img', function () {
	gulp.src('src/images/*')
    .pipe(gulp.dest('./dist/images/'));
});

// just an example
gulp.task('bundle', function () {
	var b = browserify([
		'./src/Control.SaveTiles.js',
		'./src/TileLayer.Offline.js'
	]);
	return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./examples/js/'));
});

gulp.task('example', ['css', 'img', 'js'], function () {
	connect.server({
		root: ['examples',
			'dist',
			path.dirname(require.resolve('leaflet.functionaltilelayer')),
			path.dirname(require.resolve('localforage'))
		],
		livereload: true
	});
	gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('release', ['css', 'img', 'minify']);
