'use strict';

const child   = require('child_process');
const Promise = require('bluebird');
const colors  = require('colors');
const path    = require('path');

/**
 * Class for running spawning commands
 */
class Command {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   *
   * @param bin
   * @param args
   */
  run(description, bin, args, noExit) {
    return new Promise((resolve, reject) => {
      const normalizedBin = path.normalize(bin);
      this.sqz.cli.log.info(`Executing command: ${colors.blue.bold(description)}`);
      process.stdout.write(`\n$ ${normalizedBin} ${args.join(' ')}\n`);

      process.stdout.write('\n');

      const exec = child.spawn(normalizedBin, args, {
        shell  : true,
        stderr : 'inherit',
        stdio  : 'inherit',
        stdin  : 'inherit'
      });

      exec.on('close', (code) => {
        if (code !== 0 && !noExit) {
          reject(`command exit code ${code}`);
        } else {
          process.stdout.write('\n');
          resolve(code);
        }
      });
    });
  }

  bulk(commands) {
    return new Promise((resolve) => {
      Promise.each(Object.keys(commands), (key) => {
        const command = commands[key];

        return this.run(command.description, command.bin, command.args || []);
      }).then(() => {
        resolve();
      });
    });
  }
}

module.exports = Command;
