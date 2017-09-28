'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const ChecksumsApi = require('../../../../deploy/lib/checksums');

/**
 * Add checksums for functions
 */
class compileChecksums {
  constructor(sqz, compileType) {
    this.sqz = sqz;
    this.compileType = compileType;
  }

  run() {
    return new Promise((resolve) => {
      this.initChecksums().then(() => {
        this.functionsChecksums().then(() => {
          resolve();
        });
      });
    });
  }

  initChecksums() {
    return new Promise((resolve) => {
      const projectPath = this.sqz.vars.project.path;
      this.checksumsFilePath = `${projectPath}/.build/${this.compileType}/checksums.json`;

      const checksumsSkeleton = {
        assets: {},
        functions: {}
      };

      const checksumsApi = new ChecksumsApi(this.sqz);

      this.sqz.vars.currentChecksums = _.merge({}, checksumsSkeleton);

      if (this.compileType === 'cloud') {
        checksumsApi.get().then(() => {
          resolve();
        });
      } else if (this.compileType === 'development' && fs.existsSync(this.checksumsFilePath)) {
        this.sqz.vars.previousChecksums = JSON.parse(fs.readFileSync(this.checksumsFilePath, 'utf8'));
        resolve();
      } else {
        this.sqz.vars.previousChecksums = _.merge({}, checksumsSkeleton);
        resolve();
      }
    });
  }

  functionsChecksums() {
    return new Promise((resolve) => {
      const functions = this.sqz.vars.functions;

      this.sqz.cli.log.debug('Calculating functions checksums');

      Promise.each(Object.keys(functions), (key) => {
        const functionObject = functions[key];

        return this.sqz.checksums.check(functionObject.path).then((checksum) => {
          this.sqz.vars.currentChecksums.functions[functionObject.identifier] = checksum;
        });
      }).then(() => {
        resolve();
      });
    });
  }
}

module.exports = compileChecksums;
