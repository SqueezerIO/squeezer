'use strict';

const colors   = require('colors');

/**
 * Class which builds an Object for returning local version information  .
 * @name sqz.tasks.version
 */
class Version {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Display's cli version information to the console
   */
  run() {
    return new Promise((resolve) => {
      this.sqz.cli.log.console(
        colors.green.bold(this.sqz.version.msg().replace(/^/gm, ' '.repeat(1), '\n'), '\n')
      );
      resolve();
    });
  }
}

module.exports = Version;
