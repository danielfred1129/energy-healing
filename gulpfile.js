var gulp = require('gulp');
var lr = require('gulp-livereload');
var $ = require('gulp-load-plugins')();
var src = 'views';

var out = 'public';
var scssIncludes = [
  './public/vendor'
];

gulp.task("connect", function () {
  return $.connect.server({
    root: "public",
    port: 1337,
    livereload: true
  });
});

gulp.task('ejs', function () {
  return gulp.src([src + '/*.ejs'])
    .pipe($.ejs())
    .pipe(gulp.dest(out + '/'))
    .pipe($.connect.reload());
});

gulp.task('scss', function () {
  return gulp.src('./views/scss/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: scssIncludes
    }).on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./public/css/'))
    .pipe($.connect.reload());
});

gulp.task('watch', function () {
  lr.listen()
  gulp.watch([src + '/scss/*.scss', src + '/scss/**/*.scss'], ['scss']).on('change', function(file) {
    lr.changed(file.path);
  });
  // gulp.watch([src + '/*.ejs', src + '/ejs/**/*.ejs'], ['ejs']).on('change', function(file) {
  //   lr.changed(file.path);
  // });
});

gulp.task('default', [/*'connect', 'ejs',*/ 'scss', 'watch']);
