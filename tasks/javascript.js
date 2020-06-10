const { src, dest } = require('gulp');
const config = require('./config');
const through = require('through2');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const rename = require('gulp-rename');

module.exports = function (pt) {
  let _path = config.paths.js;

  if (typeof pt === 'string') {
    _path = pt;
  }

  return src(_path, { base: config.paths.base })
    .pipe(
      through.obj({ objectMode: true }, function (file, enc, callback) {
        if (file.isBuffer()) {
          browserify(file.path).transform(babelify, { presets: ['@babel/preset-env'] }).bundle((err, res) => {
            if (err) { console.log(err); }
              file.contents = res; // eslint-disable-line
            callback(null, file);
          });
        } else {
          callback(null, file);
        }
      })
    )
    // .pipe(
    //   babel({
    //     presets: ['@babel/preset-env']
    //   })
    // )
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(uglify())
    .pipe(dest(config.paths.dist));
};
