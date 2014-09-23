// plugin
var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  stylus = require('gulp-stylus'),
  csslint = require('gulp-csslint'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  //connect = require('gulp-connect'),
  webserver = require('gulp-webserver'),
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

// https://www.npmjs.org/package/gulp-connect
// gulp-connect は deprecated。新たに作られたgulp-webserverがよい
/*gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: 8080,
    livereload: true
  });
});
gulp.task('html', function() {
  gulp.src(DEST)
    .pipe(connect.reload());
});
*/

// https://github.com/schickling/gulp-webserver
gulp.task('webserver', function() {
  gulp.src('htdocs')
    .pipe(webserver({
      livereload: true,
      //directoryListing: true, //ディレクトリ一覧を表示するか
      open: true,
      port: 9006
    }));
});

// https://github.com/floatdrop/gulp-watch/blob/master/docs/readme.md
gulp.task('build', function() { console.log('working!'); });
gulp.task('watch', function() {

  // simple
  gulp.watch(SRC, ['stylus', 'csslint']);

/*
  // callbackを指定したいとき
  gulp.watch(SRC, function(files, cb) {
    gulp.start('build', cb);
  });
*/
/*
  // incremental build
  gulp.src(SRC)
  .pipe(watch(SRC, function(files, cb) {
    return files.pipe(gulp.dest(DEST));
  }))
  .pipe(gulp.dest(DEST));
*/
});


// task to run
//gulp.task('default', ['stylus', 'csslint', 'watch']);
gulp.task('default', ['stylus', 'csslint', 'webserver', 'watch']);
//gulp.task('default', ['stylus', 'csslint', 'cssmin', 'watch']);


