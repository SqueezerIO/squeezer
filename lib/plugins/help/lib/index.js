'use strict';

const Promise = require('bluebird');

class Help {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.sqz.cli.log.console(
        this.sqz.cli.help.get(this.sqz.cli.commands, this.sqz.cli.params.get().args[0])
      );

      resolve();
    });
  }
}
module.exports = Help;
