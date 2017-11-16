'use strict';

const colors  = require('colors');
const Promise = require('bluebird');

/**
 * Class manages Projects config .
 */
class Config {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Configure the current setting
   */
  run() {
    return new Promise((resolve) => {
      const params = this.sqz.cli.params.get();

      this.sqz.cli.log.info(`Configuring "${colors.blue.bold(params.options.setting)}"`);

      this.sqz.config.set(params.options.setting, params.options.value);

      this.sqz.cli.log.info('Done !');

      resolve();
    });
  }
}

module.exports = Config;
