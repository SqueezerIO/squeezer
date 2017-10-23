'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const crypto = require('crypto');
const request = require('request');
const _       = require('lodash');

/**
 * Class that manages some Squeezer utilities
 */
class Checksums {
  constructor(sqz) {
    this.sqz = sqz;
  }

  check(functionName) {
    return new Promise((resolve) => {
      const paths = this.sqz.vars.functions[functionName].dependencies.files;

      this.md5Files(paths).then((checksum) => {
        resolve(checksum);
      });
    });
  }

  md5Files(files) {
    return new Promise((resolve) => {
      const checksums = [];
      Promise.each(files, (file) => {
        return this.md5File(file).then((checksum) => {
          checksums.push(checksum);
        });
      }).then(() => {
        const finalChecksum = crypto.createHash('md5').update(checksums.join('')).digest('hex');
        resolve(finalChecksum);
      });
    });
  }

  md5File(filename) {
    return new Promise((resolve, reject) => {
      const output = crypto.createHash('md5');
      const input = fs.createReadStream(filename);

      input.on('error', (err) => {
        return reject(err);
      });

      output.once('readable', () => {
        resolve(output.read().toString('hex'));
      });

      input.pipe(output);
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      const key                           = this.sqz.vars.project.key;
      const deploymentIdentifier          = this.sqz.vars.project.deploymentIdentifier;
      const apiBaseUrl                    = this.sqz.vars.apiBaseUrl;
      const getProjectDeploymentsEndpoint = `${apiBaseUrl}/rest/v1/projects/${key}/deployments`;

      this.sqz.cli.log.debug('Grabbing current deployment checksums');
      const checksumFile = `${this.sqz.vars.project.buildPath}/cloud/checksums.json`;

      if (fs.existsSync(checksumFile)) {
        this.sqz.vars.currentChecksums  = JSON.parse(fs.readFileSync(checksumFile, 'utf8'));
      }

      this.sqz.cli.log.info('Grabbing previous deployment checksums');

      if (key) {
        request.get(getProjectDeploymentsEndpoint, { json : true }, (error, response, body) => {
          if (!error && response.statusCode === 200 && body.message === 'success') {
            const deployment = _.find(
              body.data, (val => (val.identifier === deploymentIdentifier))
            );

            if (deployment) {
              this.sqz.vars.previousChecksums = deployment.checksums;
            }

            resolve(body);
          } else if (body && body.message) {
            reject(body.message);
          } else if (error) {
            reject(error);
          } else {
            reject('Cannot get the checksums for current deployment');
          }
        });
      } else {
        this.sqz.cli.log.warn('By using an empty Squeezer deployment key you can\'t take the full advantage of using smart tests, builds & deployments , all the functions will be deployed even the ones where code din\'t changed from the previous deployment');
        resolve();
      }
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      const deploymentIdentifier          = this.sqz.vars.project.deploymentIdentifier;
      const key                           = this.sqz.vars.project.key;
      const apiBaseUrl                    = this.sqz.vars.apiBaseUrl;
      const postProjectDeploymentEndpoint = `${apiBaseUrl}/rest/v1/projects/${key}/deployments`;

      this.sqz.cli.log.info('Saving checksums for the current deployment');
      if (key) {
        request.post(
          postProjectDeploymentEndpoint,
          {
            json : {
              identifier : deploymentIdentifier,
              checksums  : _.merge(
                this.sqz.vars.previousChecksums, this.sqz.vars.currentChecksums
              )
            }
          },
          (error, response, body) => {
            if (!error && response.statusCode === 200 && body.message === 'success') {
              resolve(body);
            } else if (body && body.message) {
              reject(body.message);
            } else if (error) {
              reject(error);
            } else {
              reject('Cannot save the checksums for current deployment');
            }
          });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Checksums;
