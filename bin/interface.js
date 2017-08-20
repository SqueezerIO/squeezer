/**
 * CLI manager
 */

const sqz      = require('./Squeezer');
const fs       = require('fs');
const colors   = require('colors/safe');
const _        = require('lodash');
const walkSync = require('walk-sync');

const settings = require('../package.json');
const bin      = Object.keys(settings.bin)[0];

/* eslint no-param-reassign: 0, no-shadow: 0, prefer-template : 0 */

module.exports = (() => {
  'use strict';

  class CommandLineInterface {
    constructor() {
      this.args     = sqz.cli.params.get();
      this.commands = {};
    }

    load() {
      const frameworkCmdsPaths = walkSync(`${__dirname}/../`, { globs : ['lib/plugins/*/index.js'] })
        .map(val => (`../${val}`));

      let pluginsCmdsPaths = [];

      if (sqz.vars.project.isValid && sqz.vars.project.plugins
        && sqz.vars.project.plugins.length > 0) {
        _.forEach(sqz.vars.project.plugins, (val) => {
          const pluginPath = `${sqz.vars.project.path}/${val.path}/${val.name}/index.js`;
          if (fs.existsSync(pluginPath)) {
            pluginsCmdsPaths.push(pluginPath);
          }
        });
      }

      const paths = _.concat(frameworkCmdsPaths, pluginsCmdsPaths);

      _.forEach(paths, (path) => {
        this.add(require(path), path); // eslint-disable-line global-require
      });
    }

    add(CommandConstructor, path) {
      const command = new CommandConstructor(sqz);

      if (!_.has(command, 'commands')) {
        sqz.cli.log.error(`No available command constructor found in ${colors.blue.bold(path)}`);
      }

      command.commands.forEach((cmdObj) => {
        const cmd = cmdObj.arg.join(':');

        if (_.has(this.commands, cmd)) {
          if (_.has(cmdObj, 'lifecycle')) {
            this.commands[cmd].lifecycle = _.concat(this.commands[cmd].lifecycle, cmdObj.lifecycle);
          }
          if (_.has(cmdObj, 'options')) {
            _.assign(this.commands[cmd].options, cmdObj.options);
          }
        } else {
          this.commands[cmd] = cmdObj;
        }
      });
    }

    get() {
      return this.commands;
    }

    format(names) {
      return names.join(':');
    }

    validate(cmdData) {
      const args = this.args;

      if (!cmdData) return args;

      const helpCmdMsg = colors.yellow(`\n\n$ ${bin} ${colors.blue.bold('help')} ${args.names.join(':')}`);

      const check = (value, key) => {
        if (value.required === true) {
          if (!_.has(args.options, key) && !_.has(args.flags, value.flag)) {
            sqz.cli.log.error(`Missing option ${colors.green(`--${key}`)}  ${helpCmdMsg}`);
          } else if (!args.options[key] && !args.flags[value.flag]) {
            sqz.cli.log.error(`Missing option ${colors.green(`--${key}`)} ` +
              `${colors.red('value')} ${helpCmdMsg}`);
          }
        } else if (!args.options[key] && value.defaultValue !== null) {
          args.options[key] = value.defaultValue;
        }
      };

      _.forEach(cmdData.options, (value, key) => {
        if (_.has(args.flags, value.flag)) {
          sqz.cli.params.setOption(key, args.flags[value.flag]);
        }
        if (value.boolean && args.options[key]) {
          args.options[key] = JSON.parse(args.options[key]);
        }
        if (_.has(value, 'validate')) {
          if (!value.validate.fn(args.options[key])) {
            sqz.cli.log.error(`${colors.blue.bold(`--${key}`)} : ${value.validate.error}`);
          }
        }
        check(value, key);
      });
    }

    index(args, logo) {
      if (args.names.length === 0) {
        const msg =
                `${logo}\n` +
                `* Lists all commands ${colors.green('`sqz list`')}.\n` +
                `* Get help for a command ${colors.green('`sqz help [command]`')}.\n` +
                `* Add ${colors.green('--debug')} to any command for debugging\n` +
                `* Squeezer framework documentation: ${colors.cyan('docs.squeezer.io')}\n`;

        sqz.cli.log.console(msg.replace(/^/gm, ' '.repeat(1)));

        process.exit(0);
      }
    }

    run() {
      const args       = this.args;
      const command    = this.commands[args.names.join(':')];
      const hintCmd    = args.names[0] === 'help' ? args.args[0] : args.names.join(':');
      const cliVersion = `${colors.yellow(`CLI v${settings.version}`)}`;

      /**
       * ascii art generated with the help of :
       * http://patorjk.com/software/taag/#p=display&f=Rectangles&t=Type%20Something%20
       */
      let logo = '';
      logo     = `${logo}                                         _\n`;
      logo     = `${logo} ___ ___ _ _ ___ ___ ___ ___ ___        |_|___\n`;
      logo     = `${logo}|_ -| . | | | -_| -_|- _| -_|  _|   _   | | . |\n`;
      logo     = `${logo}|___|_  |___|___|___|___|___|_|    |_|  |_|___|\n`;
      logo     = `${logo}      |_|                             ${cliVersion}\n`;

      let errorMsg            = `Command "${colors.green(hintCmd)}" not found  ... \n`;
      const availableHelpCmds = [];

      this.index(args, logo);

      if (args.names[0] === 'help' && args.args.length === 0) {
        sqz.cli.log.error(
          'Missing help command argument , please use ' +
          `${colors.blue.bold(`\`${bin} help [command]\``)}` +
          `\n\n... or ${colors.blue.bold(`\`${bin} list\``)} to get all available commands\n`
        );
      }

      if (!this.commands[hintCmd] || !command) {
        Object.keys(this.commands).map((cmd) => {
          if (cmd.indexOf(hintCmd) >= 0) {
            availableHelpCmds.push(cmd);
          }
          return availableHelpCmds;
        });

        if (availableHelpCmds.length > 0) {
          errorMsg += colors.green('\nDid you mean one of these commands?\n\n');
          errorMsg += `${' '.repeat(3)}${colors.blue.bold(availableHelpCmds.join(`\n${' '.repeat(3)}`))}`;
        }

        sqz.cli.log.error(errorMsg);
      }

      this.validate(command);
      sqz.cli.commands = this.commands;

      sqz.lifecycle.run(command.lifecycle);
    }
  }

  return CommandLineInterface;
})();
