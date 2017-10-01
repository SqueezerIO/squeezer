'use strict';

const Promise = require('bluebird');
const request = require('request');
const _       = require('lodash');
const fs      = require('fs');

/**
 * Class that represents deployment
 */
class Checksums {
  constructor(sqz) {
    this.sqz = sqz;
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

      this.sqz.vars.previousChecksums = {
        assets        : {},
        functions : {}
      };

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
