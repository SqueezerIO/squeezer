#!/usr/bin/env node

/* eslint global-require: 0 */
/* eslint no-console: 0 */

'use strict';

const Err = require('../lib/common/cli/error');
const pkg = require('../package.json');

const err = new Err();

const displayError = (error) => {
  console.log(err.get(error, true));
  process.exit(1);
};

process.on('uncaughtException', e => displayError(e));
process.on('unhandledRejection', e => displayError(e));

try {
  const sqz = require('./Squeezer');

  sqz.init();

  const CLI            = require('./cli');
  const updateNotifier = require('update-notifier');

  updateNotifier({ pkg }).notify();

  CLI.run();
} catch (e) {
  displayError(e);
}
