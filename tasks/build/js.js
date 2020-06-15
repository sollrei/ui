const { src, dest } = require('gulp');
const config = require('../config');
var rollup = require('gulp-better-rollup');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

module.exports = function () {
  return src(config.paths.js)
    .pipe(rollup({}, 'umd'))
    .pipe(
      babel({
        presets: ['@babel/preset-env']
      })
    )
    .pipe(uglify())
    .pipe(dest(config.paths.dist));
};
