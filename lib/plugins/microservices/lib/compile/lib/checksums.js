'use strict';

const _        = require('lodash');
const Promise  = require('bluebird');
const walkSync = require('walk-sync');
const fs       = require('fs');

/**
 * Add checksums for microservices
 */
class compileChecksums {
  constructor(sqz, compileType) {
    this.sqz         = sqz;
    this.compileType = compileType;

    const checksumsSkeleton         = {
      assets        : {},
      microservices : {}
    };
    this.sqz.vars.currentChecksums  = _.merge({}, checksumsSkeleton);
    this.sqz.vars.previousChecksums = _.merge({}, checksumsSkeleton);
  }

  run() {
    return new Promise((resolve) => {
      this.assets().then(() => {
        this.microservices().then(() => {
          this.writeChecksumsFile();
          resolve();
        });
      });
    });
  }

  assets() {
    return new Promise((resolve) => {
      const projectPath  = this.sqz.vars.project.path;
      const assetsPath   = `${projectPath}/.build/${this.compileType}/assets`;
      let checksumsPaths = [];

      this.sqz.cli.log.debug('Calculating assets checksums');

      if (this.sqz.vars.project.type === 'web') {
        checksumsPaths = walkSync(assetsPath, { directories : false });
      }

      Promise.each(checksumsPaths, (checksumPath) => {
        const checkPath = `${assetsPath}/${checksumPath}`;

        return this.sqz.checksums.check(checkPath).then((checksum) => {
          this.sqz.vars.currentChecksums.assets[checksumPath] = checksum;
        });
      }).then(() => {
        resolve();
      });
    });
  }

  microservices() {
    return new Promise((resolve) => {
      const microservices = this.sqz.vars.microservices;

      this.sqz.cli.log.debug('Calculating microservices checksums');

      Promise.each(Object.keys(microservices), (key) => {
        const microservice = microservices[key];
        const checkPath    = `${this.sqz.vars.project.buildPath}/${this.compileType}/microservices/${microservice.identifier}`;

        return this.sqz.checksums.check(checkPath).then((checksum) => {
          this.sqz.vars.currentChecksums.microservices[microservice.identifier] = checksum;
        });
      }).then(() => {
        resolve();
      });
    });
  }

  writeChecksumsFile() {
    const projectPath = this.sqz.vars.project.path;
    const filePath    = `${projectPath}/.build/${this.compileType}/checksums.json`;
    const jsonData    = JSON.stringify(this.sqz.vars.currentChecksums, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
  }
}

module.exports = compileChecksums;
