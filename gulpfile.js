var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('dist',['js','css','img']);


gulp.task('js',function() {
    gulp.src('src/**/*.js')
    .pipe(concat('leaflet.offline.js'))
    .pipe(gulp.dest('./dist/'));
})

gulp.task('css',function() {
    gulp.src('src/**/*.css')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('img',function() {
    gulp.src('src/images/*')
    .pipe(gulp.dest('./dist/images/'))
})

gulp.task('example',['dist'],function() {
    //serve external libs like localforage and index.html
})
