'use strict';

const colors  = require('colors');
const _       = require('lodash');
const Promise = require('bluebird');
const fs      = require('fs');
const fsExtra = require('fs-extra');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const microservices    = this.sqz.variables.getMicroservices();
      const microservicesLen = _.keys(microservices).length;

      if (microservicesLen === 0) {
        this.sqz.cli.log.warn('No available microservices to deploy');
        process.exit(0);
      }

      this.sqz.cli.log.info(
        `Deploying ${colors.blue.bold(microservicesLen)} available ${microservicesLen === 1 ?
          'microservice' : 'microservices'}`
      );

      this.validate();

      this.compileAll().then(() => {
        resolve();
      });
    });
  }

  compileAll() {
    return new Promise((resolve) => {
      const microservices = this.sqz.vars.microservices;
      const deployKeys    = _.keys(microservices).filter(val => microservices[val].deploy === true);

      Promise.each(deployKeys, (key) => {
        return this.compile(microservices[key]);
      }).then(() => {
        resolve();
      });
    });
  }

  validate() {
    const projectBuildPath = this.sqz.vars.project.buildPath;
    fsExtra.ensureDirSync(`${projectBuildPath}/deploy/microservices`);
    _.forEach(this.sqz.vars.microservices, (microservice, key) => {
      const identifier = microservice.identifier;
      if (this.sqz.vars.currentChecksums.microservices[identifier]
        !== this.sqz.vars.previousChecksums.microservices[identifier]) {
        this.sqz.vars.microservices[key].deploy = true;
      }
    });
  }

  compile(microservice) {
    return new Promise((resolve) => {
      const projectBuildPath = this.sqz.vars.project.buildPath;
      const target = `${projectBuildPath}/cloud/microservices/${microservice.identifier}`;

      if (!fs.existsSync(target)) {
        this.sqz.cli.log.error(`Microservice ${colors.blue.bold(microservice.name)} is not compiled !`);
      }

      const zipArchive = `${microservice.identifier}.zip`;

      this.sqz.cli.log.info(`Creating archive ${colors.blue.bold(zipArchive)}`);
      this.sqz.cli.loader.start();
      this.sqz.archive.zipDir(target, `${projectBuildPath}/deploy/microservices/${zipArchive}`).then(() => {
        this.sqz.cli.loader.stop();
        resolve();
      });
    });
  }
}

module.exports = Deploy;
