'use strict';

const CommandLineInterface = require('./interface');

const CLI = new CommandLineInterface();

CLI.load();

module.exports = CLI;
