'use strict';

const Promise = require('bluebird');

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

      this.sqz.command.bulk(installCmds).then(() => {
        resolve();
      });
    });
  }
}

module.exports = InstallCMD;
