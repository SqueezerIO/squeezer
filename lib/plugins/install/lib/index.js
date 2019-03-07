'use strict';

const Promise = require('bluebird');
const request = require('request');

/**
 * Class representing packages installation .
 */
class InstallCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.projectInstall().then(() => {
        this.sqz.cli.log.info('Installed !');
        resolve();
      });
    });
  }

  projectInstall() {
    return new Promise((resolve) => {
      const project = this.sqz.vars.project;
      const installCmds = this.sqz.yaml.parse(
        `${project.path}/lib/hooks/commands/install/project.yml`,
        {
          project: this.sqz.vars.project,
          sudo: process.platform === 'win32' ? '' : 'sudo'
        }
      );

      this.sendVars().then(() => {
        this.sqz.command.bulk(installCmds).then(() => {
          resolve();
        });
      });
    });
  }

  sendVars() {
    return new Promise((resolve, reject) => {
      if (this.sqz.vars.platform) {
        request.post({
          url: this.sqz.vars.hostHttpUrl,
          method: 'POST',
          json: {
            type: 'vars',
            data: this.sqz.vars
          }
        }, (err) => {
          if (err) reject(err);

          return resolve();
        });
      } else {
        return resolve();
      }
    });
  }
}

module.exports = InstallCMD;
