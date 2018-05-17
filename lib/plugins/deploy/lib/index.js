'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const path = require('path');
const colors = require('colors');
const Provider = require('squeezer-provider-node');
const fs = require('fs');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const projectBuildPath = this.sqz.vars.project.buildPath;
      const projectPath = this.sqz.vars.project.path;
      const mainVarsPath = path.join(projectPath, '.build', '.vars.json');
      const vars = JSON.parse(fs.readFileSync(mainVarsPath, 'utf8'));

      fsExtra.ensureDirSync(path.join(projectBuildPath, 'deploy', 'functions'));

      this.sqz.checksums.compile('cloud', vars.stage).then((checksumData) => {
        this.deployFunctions(vars).then(() => {
          this.sqz.checksums.data.save('cloud', checksumData).then(() => {
            resolve();
          });
        });
      });
    });
  }

  deployFunctions(vars) {
    return new Promise((resolve, reject) => {
      const provider = new Provider(vars).init();

      const cli = this.sqz.cli;

      const functions = this.sqz.functions.get();

      this.sqz.provider = provider;

      const functionsLen = _.keys(functions).length;

      if (functionsLen > 0) {
        cli.log.info(
          `"${colors.blue.bold(functionsLen)}" ${functionsLen === 1 ?
            'function' : 'functions'} added for the deployment process`
        );
      }

      if (functionsLen === 0) {
        cli.log.info('No available functions to deploy');
        process.exit(0);
      }

      cli.log.info('Compiling functions');
      cli.loader.start();
      provider.functions.compile(functions).then(() => {
        cli.loader.stop();
        cli.log.info('Packaging functions');
        cli.loader.start();
        provider.functions.package(functions).then(() => {
          cli.loader.stop();
          cli.log.info('Uploading functions');
          cli.loader.start();
          provider.functions.upload(functions).then(() => {
            cli.loader.stop();
            cli.log.info('Deploying functions');
            cli.loader.start();
            provider.functions.deploy(functions).then(() => {
              cli.loader.stop();
              cli.log.info('Deployment succeeded !');

              provider.utils.getAppBaseUrl().then((appBaseUrl) => {
                provider.utils.getStorageBaseUrl().then((storageBaseUrl) => {
                  const validateURL = (val) => {
                    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
                    return urlregex.test(val);
                  };

                  if (!validateURL(appBaseUrl)) {
                    reject('Can\'t retrieve the app base url');
                  }

                  if (!validateURL(storageBaseUrl)) {
                    reject('Can\'t retrieve the storage base url');
                  }

                  cli.log.info(`App base URL : "${colors.blue.bold(appBaseUrl)}"`);
                  cli.log.info(`Storage base URL : "${colors.blue.bold(storageBaseUrl)}"`);

                  resolve();
                });
              });
            });
          });
        });
      });
    });
  }

  // validateFunctions() {
  //   const projectBuildPath = this.sqz.vars.project.buildPath;
  //   const options = this.sqz.cli.params.get().options;

  //   const functions = this.sqz.functions.get();
  //   const deployFunctions = [];

  //   fsExtra.ensureDirSync(path.join(projectBuildPath, 'deploy', 'functions'));

  //   _.forEach(functions, (functionObject, key) => {
  //     const identifier = functionObject.identifier;
  //     const previousChecksum = this.sqz.vars.currentChecksums.functions[identifier];
  //     const currentChecksum = this.sqz.vars.previousChecksums.functions[identifier];
  //     if (!_.has(options, 'force')) {
  //       if (previousChecksum !== currentChecksum && functionObject.flagged) {
  //         deployFunctions.push(functionObject);
  //         this.sqz.vars.functions[key].deploy = true;
  //       }
  //     }

  //     if (!previousChecksum && !currentChecksum && functionObject.flagged) {
  //       this.sqz.vars.functions[key].deploy = true;
  //     }

  //     if (_.has(options, 'force') && functionObject.flagged) {
  //       this.sqz.vars.functions[key].deploy = true;
  //     }
  //   });

  //   return deployFunctions;
  // }
}

module.exports = Deploy;
