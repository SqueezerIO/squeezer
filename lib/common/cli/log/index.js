'use strict';

const colors = require('colors');
const _      = require('lodash');

/**
 * Class that represents CLI logging.
 */
class Log {
  constructor(sqz) {
    this.sqz = sqz;
    this.logIdentifier = 'squeezer';
    // this.spacer = (text) => text.replace(/^/gm, ' '.repeat(3));
  }

  /**
   * Display's a CLI debug message
   * @param {string} msg - debug message
   * @name this.sqz.cli.log.debug
   */
  debug(msg) {
    const params = this.sqz.cli.params.get();

    if (_.has(params.options, 'debug')) {
      this.console(`${colors.magenta.bold(`[${this.logIdentifier}] `)}${msg}`);
    }
  }

  /**
   * Display's a CLI warning message
   * @param {string} msg - warning message
   * @name this.sqz.cli.log.warn
   */
  warn(msg) {
    this.console(`${colors.red.bold(`[${this.logIdentifier}] `)}${msg}`);
  }

  /**
   * Display's a CLI information message
   * @param {string} msg - information message
   * @name this.sqz.cli.log.info
   */
  info(msg) {
    this.console(`${colors.yellow.bold(`[${this.logIdentifier}] `)}${msg}`);
  }

  /**
   * Display's a CLI error message ( and exists the CLI with terminal code 1 )
   * @param {string} msg - error message
   * @name this.sqz.cli.log.error
   */
  error(msg) {
    this.console(this.sqz.cli.error.get(colors.yellow(msg)));
    process.exit(1);
  }

  /**
   * Use the same NodeJS console.log feature
   * @param {string} msg - information message
   * @name this.sqz.cli.log.console
   */
  console(msg) {
    console.log(msg); // eslint-disable-line no-console
  }
}

module.exports = Log;
