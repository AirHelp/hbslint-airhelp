#!/usr/bin/env node

"use strict";

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
let config = {};
Object.assign(config, getConfigPath(argv));
const linter = new Linter(config);

// prepare lookup
const lintDirectories = argv['_'];

const dirsToTemplates = lintDirectories.map((directory) => {
  return walkSync(directory)
    .filter(function(file) {
      return path.extname(file) === '.hbs';
    })
    .map(function(file) {
      return path.join(directory, file);
    });
});

const templates = [].concat.apply([], dirsToTemplates);

// define statistics
const filesCount = templates.length;
let errorFilesCount = 0;

// process linting
templates.forEach(function(file) {
  const fullPath = path.join(root, file);
  const contents = fs.readFileSync(file, { encoding: 'utf8' });
  const errors = linter.verify({
    source: contents,
  });

  if (errors.length) {
    errorFilesCount++;

    if (isVerbose) {
      log(`\n${fullPath}`);

      errors.forEach(error => {
        const { line, column, rule, message } = error;

        // TODO use join here
        log(
          ' ',
          chalk.grey(`${line}:${column}`),
          ' ',
          chalk.yellow('warning'),
          ' ',
          message,
          ' ',
          chalk.grey(`${rule}`)
        );
      });
    }
  }
});

if (errorFilesCount) {
  log('\n', chalk.yellow(`-> ${errorFilesCount} problems (${errorFilesCount} warnings)`));

  // TODO change this to exitCode 1 after we fix most of bugs
  exitCode = 0;
} else {
  log(chalk.green('No warnings found'));
}

process.on("exit", function() {
  process.exit(exitCode);
});
