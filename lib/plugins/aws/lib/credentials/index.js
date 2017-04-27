'use strict';

const AWS        = require('aws-sdk');
const colors     = require('colors');
const homeConfig = require('home-config');
const Promise    = require('bluebird');
const crypto = require('crypto');

/**
 * Load aws credentials
 */
class AWSRunLib {
  constructor(sqz) {
    this.sqz = sqz;
  }

  load() {
    return new Promise((resolve) => {
      const awsProfile = this.sqz.config.get('aws_profile');
      const cfg        = homeConfig.load('.aws/config');
      const configData = cfg.getAll()[`profile ${awsProfile}`] || {};

      if (!awsProfile) {
        this.sqz.cli.log.error(
          'No AWS profile configured for this project : \n\n' +
          `${colors.blue.bold('sqz config --setting aws_profile --value YOUR-AWS-PROFILE')} `
        );
      }

      if (!configData) {
        this.sqz.cli.log.error(
          `No AWS profile ${awsProfile} configured : \n\n` +
          `${colors.blue.bold(`aws configure --profile ${awsProfile}`)} `
        );
      }

      this.sqz.vars.aws        = {};
      this.sqz.vars.aws.region = configData.region || 'us-east-1';
      this.sqz.vars.aws.profile = awsProfile || null;

      AWS.config.credentials =
        new AWS.SharedIniFileCredentials({ profile : awsProfile });
      AWS.config.update({ region : this.sqz.vars.aws.region });

      this.sqz.vars.project.deploymentIdentifier =
        `${crypto.createHash('md5').update(AWS.config.credentials.accessKeyId).digest('hex')}` +
        `-${this.sqz.vars.stage}`;

      this.sqz.vars.aws.cloudFormation = {};
      this.sqz.vars.aws.cfOutputs = {};
      this.sqz.vars.aws.s3Uploads      = [];

      resolve();
    });
  }
}

module.exports = AWSRunLib;
