const path = require('path');
const defaultConfigurations = require('../config/.template-lintrc');

function getConfigPath(argv) {
  const configOptions = {};

  if (argv.config) {
    Object.assign(configOptions, {
      configPath: path.join(process.cwd(), argv.config),
    });
  } else {
    Object.assign(configOptions, {
      config: defaultConfigurations,
    });
  }

  return configOptions;
}

module.exports = getConfigPath;
