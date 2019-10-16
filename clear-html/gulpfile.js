const
  GULP = require('gulp'),
  SASS = require('gulp-sass'),
  BROWSERSYNC = require('browser-sync'),
  RSYNC = require('gulp-rsync'),
  CONCAT = require('gulp-concat'),
  AUTOPREFIXER = require('gulp-autoprefixer'),
  CLEANCSS = require('gulp-clean-css');

// BROWSER-SYNC LOCAL SERVER
GULP.task('browser-sync', () => {
  BROWSERSYNC({
    server: {
      baseDir: 'app',
    },
    notify: false,
  })
});


// CUSTOM STYLES
GULP.task('styles', () => {
  return GULP.src('app/sass/**/*.sass')
    .pipe(SASS({
      outputStyle: 'expanded',
      includePaths: [__dirname + '/node_modules']
    }))
    .pipe(CONCAT('styles.min.css'))
    .pipe(AUTOPREFIXER({
      grid: true,
      overrideBrowserslist: ['lats 10 versions']
    }))
    .pipe(CLEANCSS({
      level: { 1: { specialCommnets: 0 }}
    }))
    .pipe(GULP.dest('app/css'))
    .pipe(BROWSERSYNC.stream())
});


// WATCH
GULP.task('watch', () => {
  GULP.watch('app/*.html', GULP.parallel('code'));
  GULP.watch('app/sass/**/*.sass', GULP.parallel('styles'));
  //GULP.watch(['app/js/_custom.js', 'app/js/_libs.js'], GULP.parallel('scripts'));
});

// CODE & RELOAD
GULP.task('code', () => {
  return GULP.src('app/**/*.html')
    .pipe(BROWSERSYNC.reload({ stream: true }))
});

// DEPLOY
GULP.task('rsync', () => {
  return GULP.src('app/')
    .pipe(RSYNC({
      root: 'app/',
      hostname: 'username@yousite.com',
      destination: 'yousute/public_html/',
      exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }))
});




GULP.task('default', GULP.parallel('styles', 'browser-sync', 'watch'));


// function defaultTask(cb) {
//   cb();
// }
//
// exports.default = defaultTask;
