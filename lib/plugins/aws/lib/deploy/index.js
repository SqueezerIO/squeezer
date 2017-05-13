'use strict';

const Promise        = require('bluebird');
const colors         = require('colors');
const Upload         = require('./upload');
const CloudFormation = require('./cloudformation');

/**
 * Class representing deployment orchestration for Amazon Web Services
 */
class DeployAWS {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Deploys all microservices
   */
  run() {
    return new Promise((resolve) => {
      const self = this;

      const cloudFormationDeploy = new CloudFormation(this.sqz);
      const microservices        = this.sqz.variables.getMicroservices();
      const upload = new Upload(this.sqz);

      self.sqz.cli.log.info('Uploading assets to the S3 bucket ');
      upload.run().then(() => {
        self.sqz.cli.log.info('Removing S3 old microservices packages !');
        Promise.each(Object.keys(microservices), (key) => {
          return upload.cleanBucket(microservices[key]);
        }).then(() => {
          self.sqz.cli.log.info('Microservices packages uploaded !');
          cloudFormationDeploy.update().then(() => {
            this.sqz.cli.log.info('CloudFormation stacks successfully deployed !');
            resolve();
          });
        });
      });
    });
  }

  /**
   * Deploys a single microservice
   *
   * @param {string} name - microservice name
   */
  upload(microservice) {
    return new Promise((resolve) => {
      const upload = new Upload(this.sqz, microservice);

      this.sqz.cli.log.info(`Uploading microservice ${colors.blue.bold(microservice.name)} package`);

      upload.run().then(() => {
        this.sqz.cli.log.info(`Uploaded microservice ${colors.blue.bold(microservice.name)} package`);
        resolve();
      });
    });
  }
}

module.exports = DeployAWS;
