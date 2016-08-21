'use strict';

const Command = require('cmnd').Command,
      colors  = require('colors/safe'),
      si      = require('systeminformation');

class VersionCommand extends Command {

  constructor () {

    super('version');

  }

  help () {

    return {
      description : colors.green.bold('Shows information your currently globally installed Squeezer CLI version')
    };

  }

  run (params, callback) {

    let version = require('../../package.json').version;

    console.log(colors.green.bold('* Squeezer CLI version: ') + version);
    console.log(colors.green.bold('* Node version: ') + process.version);

    si.osInfo((info) => {
      console.log(colors.green.bold('* Operating system: ') + `${info.distro} ${info.release}`);

      callback(null);
    });
  }

}

module.exports = VersionCommand;