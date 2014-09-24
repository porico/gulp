// plugin
var gulp = require('gulp'),
  plumber = require('gulp-plumber'), //あるプラグインでエラーが発生してもほかのプラグインの処理を止めない
  notify = require('gulp-notify'), //error時にメッセージを表示させる
  stylus = require('gulp-stylus'),
  csslint = require('gulp-csslint'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  //connect = require('gulp-connect'),
  webserver = require('gulp-webserver'), //gulp-connectの後継
  watch = require('gulp-watch'), //不要？
  nib = require('nib'); //reset.cssの定義。gulp-stylusと合わせて使う。

var DEST = './htdocs/';
var DEST_CSS = './htdocs/**/*.css';
var SRC = './src/**/*.styl';


// task config
gulp.task('stylus', function() {
  gulp.src(SRC)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //.pipe(plumber())
    // .pipe(stylus())
    .pipe(stylus({
      use: nib(),
      compress: false
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('csslint', function() {
  gulp.src(DEST_CSS)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
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
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
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
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
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


