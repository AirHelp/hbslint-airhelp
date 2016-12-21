#!/usr/bin/env node

let exitCode = 0;

// import packages
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const walkSync = require('walk-sync');
const Linter = require('ember-template-lint');
const getConfigPath = require('../helpers/get-config-path');

const { argv } = yargs;
const { log } = console;

// configuration
const isVerbose = argv.verbose || argv.v;
const root = path.dirname(require.main.filename);

// prepare linter service
const config = {};
Object.assign(config, getConfigPath(argv));
const linter = new Linter(config);

// prepare lookup
const lintDirectories = argv._;

const templates = lintDirectories.reduce((templates, directory) => {
  const dirTemplates = walkSync(directory)
    .filter(file => path.extname(file) === '.hbs')
    .map(file => path.join(directory, file));

  templates.push(...dirTemplates);

  return templates;
}, []);

// define statistics
let errorsCount = 0;
let errorFilesCount = 0;

// process linting
templates.forEach(file => {
  const fullPath = path.join(root, file);
  const contents = fs.readFileSync(file, { encoding: 'utf8' });
  const errors = linter.verify({
    source: contents,
  });

  if (errors.length) {
    errorsCount += errors.length;
    errorFilesCount++;

    if (isVerbose) {
      log(`\n${fullPath}`);

      errors.forEach(error => {
        const { line, column, rule, message } = error;

        const printStatistics = [
          chalk.grey(`${line}:${column}`),
          chalk.yellow('warning'),
          message,
          chalk.grey(`${rule}`),
        ];

        log(
          ' ',
          printStatistics.join(' ')
        );
      });
    }
  }
});

if (errorFilesCount) {
  log('\n', chalk.yellow(`-> ${errorsCount} problems (${errorsCount} warnings)`));

  // TODO change this to exitCode 1 after we fix most of bugs
  exitCode = 0;
} else {
  log(chalk.green('No warnings found'));
}

process.on('exit', () => {
  process.exit(exitCode);
});
