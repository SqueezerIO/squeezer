'use strict';

const colors  = require('colors');
const Promise = require('bluebird');
const crypto  = require('crypto');
const _       = require('lodash');

/**
 * Load aws credentials
 */
class AzureCredentials {
  constructor(sqz) {
    this.sqz = sqz;
  }

  load() {
    return new Promise((resolve) => {
      const user           = this.sqz.config.get('azure_username');
      const pass           = this.sqz.config.get('azure_password');
      const tenant         = this.sqz.config.get('azure_tenant');
      const location       = this.sqz.config.get('azure_location');
      const subscriptionId = this.sqz.config.get('azure_subscription_id');

      if (_.isEmpty(user) || _.isEmpty(pass)
        || _.isEmpty(tenant) || _.isEmpty(location) || _.isEmpty(subscriptionId)) {
        this.sqz.cli.log.error(
          'Credentials error , please check : \n\n' +
          `${colors.blue.bold('https://docs.squeezer.io/clouds/azure/credentials.html')} `
        );
      }

      this.sqz.vars.azure = {
        apiVersion     : '2014-04-01',
        credentials    : {
          user           : user,
          pass           : pass,
          tenant         : tenant,
          location       : location,
          subscriptionId : subscriptionId
        },
        arm            : {},
        armOutputs     : {},
        storageUploads : {}
      };

      this.sqz.vars.project.deploymentIdentifier =
        `${crypto.createHash('md5').update(user).digest('hex')}` +
        `-${this.sqz.vars.stage}`;

      resolve();

      // this.sqz.vars.aws.cloudFormation = {};
      // this.sqz.vars.aws.cfOutputs      = {};
      // this.sqz.vars.aws.s3Uploads      = [];

      // msRestAzure.loginWithServicePrincipalSecret(user, pass, tenant, (err, credentials) => {
      //   if (err) reject(err);
      //   this.sqz.vars.azure.credentials = credentials;
      //   resolve();
      // });
    });
  }
}

module.exports = AzureCredentials;
