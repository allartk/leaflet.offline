var gulp = require('gulp');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
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
        .pipe(gulp.dest('./dist/'))
		.pipe(connect.reload());

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



gulp.task('example', ['js'], function () {
	connect.server({
		root: ['./',
			path.dirname(require.resolve('localforage')),
			path.dirname(require.resolve('leaflet.vectorgrid'))
		],
		livereload: true
	});
	gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('release', ['minify']);
