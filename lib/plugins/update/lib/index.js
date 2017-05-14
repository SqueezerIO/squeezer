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
        this.microservicesUpdate().then(() => {
          resolve();
        });
      });
    });
  }

  projectUpdate() {
    return new Promise((resolve) => {
      const project = this.sqz.vars.project;
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

  microservicesUpdate() {
    return new Promise((resolve) => {
      const microservices = this.sqz.vars.microservices;

      Promise.each(Object.keys(microservices), (key) => {
        return this.microserviceUpdate(microservices[key]);
      }).then(() => {
        resolve();
      });
    });
  }

  microserviceUpdate(microservice) {
    return new Promise((resolve) => {
      const projectPath = this.sqz.vars.project.path;
      const updateCmds = this.sqz.yaml.parse(
        `${projectPath}/lib/hooks/commands/update/microservice.yml`,
        {
          microservice : microservice
        }
      );

      this.sqz.command.bulk(updateCmds).then(() => {
        resolve();
      });
    });
  }
}

module.exports = UpdateCMD;
