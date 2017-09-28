'use strict';

const Promise = require('bluebird');

/**
 * Class representing packages updating .
 */
class UpdateCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.projectUpdate().then(() => {
        this.sqz.cli.log.info('Updated !');
        resolve();
      });
    });
  }

  projectUpdate() {
    return new Promise((resolve) => {
      const project    = this.sqz.vars.project;
      const updateCmds = this.sqz.yaml.parse(
        `${project.path}/lib/hooks/commands/update/project.yml`,
        {
          project : this.sqz.vars.project
        }
      );

      this.sqz.command.bulk(updateCmds).then(() => {
        resolve();
      });
    });
  }
}

module.exports = UpdateCMD;
