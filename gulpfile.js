// plugin
var gulp = require('gulp'),
  mypRefactoring = require('myplugin-refactoring'), //自作プラグイン
  plumber = require('gulp-plumber'), //あるプラグインでエラーが発生してもほかのプラグインの処理を止めない
  notify = require('gulp-notify'), //error時にメッセージを表示させる
  sourcemaps = require('gulp-sourcemaps'),
  stylus = require('gulp-stylus'),
  csslint = require('gulp-csslint'),
  cssmin = require('gulp-cssmin'),
  uncss =  require('gulp-uncss'), //find unused css
  cssnext =  require('gulp-cssnext'), //PostCSS
  autoprefixer =  require('gulp-autoprefixer'), //PostCSS
  glob = require('glob'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  /*
  browserify = require('browserify'),
  source = require('vinyl-source-stream'), //gulp-browserifyがblacklist化したため、browserifyとvinyl-source-streamを併用する方法を推奨
  */
  //connect = require('gulp-connect'),
  webserver = require('gulp-webserver'), //gulp-connectの後継
  watch = require('gulp-watch'), //不要？
  imagemin = require('gulp-imagemin'),
  pngcrush = require('imagemin-pngcrush'), //imagemin plugin
  pngquant = require('imagemin-pngquant'), //imagemin plugin
  nib = require('nib'); //reset, mixinの定義。gulp-stylusと合わせて使う。

var DEST = './htdocs/';
var DEST_HTML = './htdocs/**/*.html';
var DEST_JS = './htdocs/js';
var DEST_CSS = './htdocs/**/*.css';
var SRC = './src/**/*.styl';
var SRC_IMG = './src/**/*.{gif,jpg,png,svg}';
//var SRC_JS = './src/**/*.js';
var SRC_JS = './src/**/*.coffee';
var OUT = './out/';

//自作プラグイン myplugin-refactoring
gulp.task('mypRefactoring', function() {
  gulp.src(DEST_CSS)
    .pipe(mypRefactoring())
    .pipe(gulp.dest(OUT));
});

// task config
gulp.task('stylus', function() {
  gulp.src(SRC)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //.pipe(plumber())
    // .pipe(stylus())
    .pipe(sourcemaps.init())
    .pipe(stylus({ use: nib(), compress: false }))
    .pipe(sourcemaps.write('.'))
    //.pipe(autoprefixer({browsers: ['last 3 versions', 'ie 8']}))
    .pipe(gulp.dest(DEST));
});

gulp.task('csslint', function() {
  gulp.src(DEST_CSS)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(csslint())
    .pipe(csslint.reporter());
});

gulp.task('browserify', function() {
/*
  // gulp-browserifyがblacklist化したので以下のように記述せよ、とある
  // http://qiita.com/mizchi/items/10a8e2b3e6c2c3235e61
  //return browserify(SRC_JS)
  return browserify('./src/js/_utils.coffee')
    .bundle()
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    // Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest(DEST));
*/
  //gulp-browserify
  gulp.src(SRC_JS, { read: false })
    .pipe(plumber())
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
      // insertGlobals : true,
      // debug : !gulp.env.production
    }))
    // .pipe(expand('js'))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(DEST_JS));

});

gulp.task('imagemin', function() {
  gulp.src(SRC_IMG)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(imagemin({
      use: [pngcrush()]
    }))
/*    .pipe(imagemin({
      use: [pngcrush(), pngquant()] //pngquant()がerrorになる
    }))*/
    .pipe(gulp.dest(DEST));
});

/* minファイルの生成されるタイミングがおかしい・・・ */
/*gulp.task('cssmin', function() {
  gulp.src(DEST_CSS)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(DEST));
});*/

gulp.task('uncss', function() {
  gulp.src(DEST_CSS)
    .pipe(uncss({
      html: glob.sync(DEST_HTML)
    }))
    .pipe(gulp.dest('./out'));
});

gulp.task('uncss-urls', function() {
  gulp.src(DEST_CSS)
    .pipe(uncss({
      html: [
      'http://example.com/**/*.html'
      ]
    }))
    .pipe(gulp.dest('./out'));
});

gulp.task('cssnext', function() {
  return gulp.src('./htdocs/cssnext/**/*.css') // コンパイルするファイルの指定
  .pipe(cssnext())
  .pipe(gulp.dest('./htdocs/css')); // コンパイルしたファイルの出力先を指定
});

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
  gulp.watch(SRC, ['stylus', 'csslint', 'cssnext']);

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
gulp.task('default', ['stylus', 'csslint', 'browserify', 'webserver', 'watch']);
//gulp.task('default', ['stylus', 'csslint', 'cssmin', 'watch']);

gulp.task('build', ['imagemin', 'stylus', 'csslint', 'browserify']);

