'use strict';

const colors  = require('colors');
const Promise = require('bluebird');
const _       = require('lodash');

class Help {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.sqz.cli.log.console(this.sqz.cli.help.get(this.sqz.cli.commands, this.sqz.cli.params.get().args[0]));

      resolve();
    });
  }
}
module.exports = Help;
