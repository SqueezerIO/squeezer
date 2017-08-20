'use strict';

const Version = require('../../../../lib/common/version');

const colors  = require('colors');
const _       = require('lodash');

/**
 * Class that manage errors of all types.
 */
class Error {
  /**
   * Returns formatted error message
   * @param {string} error - error message
   * @param {boolean} noSqzError - true for system error
   * @returns {String}
   *
   * @name this.sqz.error
   */
  get(errorParam, noSqzError) {
    let error = errorParam;

    if (_.has(error, 'stack') && noSqzError) error = error.stack;

    const versionInfo = new Version();
    let msg           = colors.red.bold('\n\nSQUEEZER ERROR:');

    if (noSqzError) {
      msg += `\n\n${error}\n\n`;
    } else {
      msg += `\n\n${error}\n\n`;
    }

    if (noSqzError) {
      msg += `${colors.yellow.bold(versionInfo.msg())}\n\n`;
      msg += `Please add ${colors.green('--debug')} to any command for more CLI details\n\n`;
    }

    msg +=
      `### Docs: ${colors.cyan('docs.squeezer.io')}\n` +
      `### Bugs: ${colors.cyan('github.com/SqueezerIO/squeezer/issues')}`;

    if (noSqzError) {
      msg += `${colors.red('\n\n### If you feel that this error it\'s ' +
        'a bug please report it . Thank you !')}`;
    }

    msg += '\n';

    return msg;
  }
}

module.exports = Error;
