const { src, dest } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const config = require('./config');
const cleanCss = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

module.exports = function (pt) {
  let _path = config.paths.css;

  if (typeof pt === 'string') {
    _path = pt;
  }

  return src(_path, { base: config.paths.base })
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer('last 2 versions'))
  // .pipe(gulpIf(!isDev, cleanCss()))
    .pipe(cleanCss())
    .pipe(dest(config.paths.dist));
  // .pipe(gulpIf(isDev, browserSync.stream()));
};
