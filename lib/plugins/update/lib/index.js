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
      this.projectInstall().then(() => {
        this.microservicesInstall().then(() => {
          resolve();
        });
      });
    });
  }

  projectInstall() {
    return new Promise((resolve) => {
      const project = this.sqz.vars.project;
      const installCmds = this.sqz.yaml.parse(
        `${project.path}/lib/hooks/commands/update/project.yml`,
        {
          project : this.sqz.vars.project
        }
      );

      Promise.each(Object.keys(installCmds), (key) => {
        const command = installCmds[key];

        return this.sqz.command.run(command.description, command.bin, command.args || []);
      }).then(() => {
        resolve();
      });
    });
  }

  microservicesInstall() {
    return new Promise((resolve) => {
      const microservices = this.sqz.vars.microservices;

      Promise.each(Object.keys(microservices), (key) => {
        return this.microserviceInstall(microservices[key]);
      }).then(() => {
        resolve();
      });
    });
  }

  microserviceInstall(microservice) {
    return new Promise((resolve) => {
      const projectPath = this.sqz.vars.project.path;
      const installCmds = this.sqz.yaml.parse(
        `${projectPath}/lib/hooks/commands/update/microservice.yml`,
        {
          microservice : microservice
        }
      );

      Promise.each(Object.keys(installCmds), (key) => {
        const command = installCmds[key];

        return this.sqz.command.run(command.description, command.bin, command.args || []);
      }).then(() => {
        resolve();
      });
    });
  }
}

module.exports = UpdateCMD;
