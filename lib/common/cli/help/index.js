'use strict';

const colors  = require('colors');

const _       = require('lodash');

const bin     = Object.keys(require('../../../../package.json').bin)[0];

/**
 * Class which builds the help message  .
 */
class Help {
  /**
   * @param {Object} sqz - Squeezer CLI instance
   */
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Return current version information
   * @returns {Object}
   * @name this.sqz.cli.help.get
   */
  get(commands, param) {
    const cmd        = commands[param];
    const spacer     = ' '.repeat(1);
    const spacerSub  = ' '.repeat(4);
    const desc       = cmd.description || cmd.summary;
    let msg          = '';
    let maxOptionLen = 0;

    msg += `${spacer}${colors.yellow('\n Usage: ')}\n\n`;
    msg += `${spacerSub}$ ${bin} ${param} ${cmd.options ? '[options]' : ''}\n\n`;

    msg += `${spacer}${colors.yellow('Description:')}\n\n`;
    msg += `${desc.replace(/^/gm, spacerSub)}\n\n`;

    if (cmd.options || cmd.flags) {
      msg += `${spacer}${colors.yellow('Options:')}\n\n`;

      _.forEach(cmd.options, (value, key) => {
        let keyLen = key.length;
        if (value.flag) {
          keyLen += 6;
        }
        if (keyLen > maxOptionLen) maxOptionLen = keyLen;
      });

      const fullSpacer = ' '.repeat((maxOptionLen) + 5);
      let leftSpacer   = '';

      _.forEach(cmd.options, (value, key) => {
        const optionDisplay = `--${key}` +
          `${value.flag ? ` / -${value.flag} ` : ''}`;

        leftSpacer = ' '.repeat((maxOptionLen - optionDisplay.length) + 3);

        msg += `${spacerSub}${colors.green(optionDisplay)}`;
        msg += `${leftSpacer}${value.title} ${value.required ? '(required)' : '(optional)'}`;
        msg += `${value.defaultValue ? colors.blue.bold(` "${value.defaultValue}"`) : ''}\n`;
        msg += `${value.value ? `${' '.repeat(4)}value` : ''}`;
        msg += `${value.description ? `\n${value.description.replace(/^/gm, fullSpacer)}\n` : ''} `;
        msg += '\n';
      });
    }

    if (cmd.examples && cmd.examples.length > 0) {
      msg += `\n${spacer}${colors.yellow('Examples:')}\n\n`;

      _.forEach(cmd.examples, (example) => {
        msg += `${spacerSub}$ ${bin} ${param} ${example}\n`;
      });
    }

    return msg;
  }
}

module.exports = Help;
