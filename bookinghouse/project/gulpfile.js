const GULP = require('gulp');
const SASS = require('gulp-sass');
const BROWSERSYNC = require('browser-sync');
const RSYNC = require('gulp-rsync');
const CONCAT = require('gulp-concat');
const AUTOPREFIXER = require('gulp-autoprefixer');
const CLEANCSS = require('gulp-clean-css');
const UGLIFY = require('gulp-uglify-es').default;
// const NEWER = require('gulp-newer');
// const RENAME = require('gulp-rename');
// const RESPONSIVE = require('gulp-responsive');
// const DEL = require('del');

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
      overrideBrowserslist: ['last 10 versions'],
    }))
    .pipe(CLEANCSS({
      level: { 1: { specialCommnets: 0 }}
    }))
    .pipe(GULP.dest('app/css'))
    .pipe(BROWSERSYNC.stream())
});

// SCRIPT
GULP.task('scripts', () => {
  return GULP.src([
    'app/js/_libs.js',
    'app/js/_custom.js',
  ])
    .pipe(CONCAT('script.min.js'))
    .pipe(UGLIFY())
    .pipe(GULP.dest('app/js'))
    .pipe(BROWSERSYNC.reload({ stream: true }))
});

// WATCH
GULP.task('watch', () => {
  GULP.watch('app/*.html', GULP.parallel('code'));
  GULP.watch('app/sass/**/*.sass', GULP.parallel('styles'));
  GULP.watch(['app/js/_custom.js', 'app/js/_libs.js'], GULP.parallel('scripts'));
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

// // IMG
// let quality = 95;
//
// // Produce @1x images
// GULP.task('img-responsive-1x', async function () {
//   return GULP.src('app/img/_src/**/*.{png,jpg,jpeg,webp, raw}')
//     .pipe(NEWER('app/img/@1x'))
//     .pipe(RESPONSIVE({
//       '**/*': { width: '50%', quality: quality }
//     })).on('error', function (e) { console.log(e) })
//     .pipe(RENAME(function (path) { // ERROR
//       path.extname = path.extname.replace('jpeg', 'jpg')
//     }))
//     .pipe(GULP.dest('app/img/@1x'))
// });
//
// // Produce @2x images
// GULP.task('img-responsive-2x', async function () {
//   return GULP.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
//     .pipe(NEWER('app/img/@2x'))
//     .pipe(RESPONSIVE({
//       '**/*': { width: '100%', quality: quality }
//     })).on('error', function (e) { console.log(e) })
//     .pipe(RENAME(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
//     .pipe(GULP.dest('app/img/@2x'))
// });
//
// GULP.task('img', GULP.series('img-responsive-1x', 'img-responsive-2x', bsReload));
//
// GULP.task('cleanimg', () => {
//   return DEL(['app/img/@*'], { force: true })
// });
//
// function bsReload(done) {
//   BROWSERSYNC.reload();
//   done();
// }

GULP.task('default', GULP.parallel('styles', 'scripts', 'browser-sync', 'watch'));
