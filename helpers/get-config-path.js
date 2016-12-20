'use strict';

var defaultConfigurations = require('../config/.template-lintrc');

module.exports = function(argv) {
  if (argv.config) {
    // TODO: allow using custom config file
  } else {
    return {
      config: defaultConfigurations,
    };
  }
};
