'use strict';

const _       = require('lodash');
const Promise = require('bluebird');
const fs      = require('fs');
const fsExtra = require('fs-extra');
const path    = require('path');
const colors  = require('colors');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.validate();
      
      
      const functions = _.pickBy(this.sqz.functions.get(), ['deploy'], (val, key) => {
        console.log(val)
      });
      const functionsLen = _.keys(functions).length;

      if (functionsLen > 0) {
        this.sqz.cli.log.info(
          `"${colors.white(functionsLen)}" ${functionsLen === 1 ?
            'function' : 'functions'} added to deployment process`
        );
      }

      console.log(functions);
      resolve();
    });
  }

  validate() {
    const projectBuildPath = this.sqz.vars.project.buildPath;
    const options          = this.sqz.cli.params.get().options;

    fsExtra.ensureDirSync(path.join(projectBuildPath, 'deploy', 'functions'));
    _.forEach(this.sqz.vars.functions, (functionObject, key) => {
      console.log(`aa ${functionObject}`)
      const identifier = functionObject.identifier;
      if (!_.has(options, 'force')) {
        if (this.sqz.vars.currentChecksums.functions[identifier]
          !== this.sqz.vars.previousChecksums.functions[identifier] && functionObject.flagged) {
          this.sqz.vars.functions[key].deploy = true;
        }
      } else if (functionObject.flagged) {
        this.sqz.vars.functions[key].deploy = true;
      }
  
    });
    console.log(this.sqz.vars.functions)
  }

  // compile(functionObject) {
  //   return new Promise((resolve) => {
  //     const projectBuildPath = this.sqz.vars.project.buildPath;
  //     const target           = `${projectBuildPath}/cloud/functions/${functionObject.identifier}`;

  //     if (!fs.existsSync(target)) {
  //       this.sqz.cli.log.error(`Function "${functionObject.name}" is not compiled !`);
  //     }

  //     const packageFile = functionObject.packageFile;
  //     const packagePath = functionObject.packagePath;
  //     this.sqz.cli.log.info(`Creating package "${colors.white(packageFile)}"`);
  //     this.sqz.cli.loader.start();
  //     this.sqz.archive.zipDir(target, path.join(packagePath, packageFile)).then(() => {
  //       this.sqz.cli.loader.stop();
  //       resolve();
  //     });
  //   });
  // }
}

module.exports = Deploy;
