const del = require('del');
const config = require('./config');

module.exports = function () {
  return del([config.paths.clean]);
};
