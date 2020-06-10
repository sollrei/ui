const { task, series } = require('gulp');


const clean = require('./tasks/clean');
const css = require('./tasks/css');
const js = require('./tasks/js');


task('clean', () => { return clean(); });

task('css', () => { return css(); });

task('js', () => { return js(); });


exports.build = series(
  ['clean'],
  ['css', 'js']
);
