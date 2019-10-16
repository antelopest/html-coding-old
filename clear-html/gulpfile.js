const
  GULP = require('gulp'),
  SASS = require('gulp-sass'),
  BROWSERSYNC = require('browser-sync'),
  RSYNC = require('gulp-rsync');


// WATCH
GULP.task('watch', () => {
  GULP.watch('app/*.html', GULP.parallel('code'));
});

// CODE & RELOAD
GULP.task('rsync', () => {

});


// BROWSER-SYNC
GULP.task('browser-sync', () => {
  BROWSERSYNC({
    server: {
      baseDir: 'app',
    },
    notify: false,
  })
});

GULP.task('default', GULP.parallel('browser-sync'));


// function defaultTask(cb) {
//   cb();
// }
//
// exports.default = defaultTask;
