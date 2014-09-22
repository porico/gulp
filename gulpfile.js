// plugin
var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  csslint = require('gulp-csslint'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  watch = require('gulp-watch'), //不要？
  nib = require('nib');

var DEST = './htdocs/';
var DEST_CSS = './htdocs/**/*.css';
var SRC = './src/**/*.styl';


// task config
gulp.task('stylus', function() {
  gulp.src(SRC)
    // .pipe(stylus())
    .pipe(stylus({
      use: nib(),
      compress: false
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('csslint', function() {
  gulp.src(DEST_CSS)
    .pipe(csslint())
    .pipe(csslint.reporter());
});

/* minファイルの生成されるタイミングがおかしい・・・ */
/*gulp.task('cssmin', function() {
  gulp.src(DEST_CSS)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(DEST));
});*/

gulp.task('watch', function() {
  gulp.src(SRC)
/*  .pipe(watch(SRC, function(files) {
    return files.pipe(gulp.dest(DEST));
  }))*/
  .pipe(gulp.dest(DEST));
});


// task to run
gulp.task('default', ['stylus', 'csslint', 'watch']);
//gulp.task('default', ['stylus', 'csslint', 'cssmin', 'watch']);


