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
var proxy = require('http-proxy-middleware');


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

gulp.task('example', ['css', 'img', 'js'], function () {
	connect.server({
		root: ['examples',
			'dist',
			path.dirname(require.resolve('localforage'))
		],
		middleware: function () {
			return [
				proxy('/tiles', {
					pathRewrite: {
						'^/tiles/': '/'
					},
					target: 'http://a.tile.openstreetmap.org/',
					changeOrigin:true
				})
			];
		},
		livereload: true
	});
	gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('release', ['css', 'img', 'minify']);
