#!/usr/bin/env node

'use strict';

const CLI            = require('./cli'),
      updateNotifier = require('update-notifier'),
      pkg            = require('../package.json');

updateNotifier({pkg}).notify();

CLI.run(process.argv.slice(2));
