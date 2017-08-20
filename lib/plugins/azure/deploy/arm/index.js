'use strict';

const _                        = require('lodash');
const Promise                  = require('bluebird');
const colors                   = require('colors');
const Base                     = require('../../compile/lib/arm/main/base');
const msRestAzure              = require('ms-rest-azure');
const ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;

/**
 * Class representing microservice's Azure ARM deployments
 */
class DeployArm {
  constructor(sqz, microservice) {
    this.sqz               = sqz;
    this.microservice      = microservice;
    this.resourceGroupName = `${this.sqz.vars.azure.credentials.user}-${this.sqz.vars.project.identifier}-${this.sqz.vars.stage}-rg`;
    this.deploymentName    = `${this.sqz.vars.project.identifier}-${this.sqz.vars.stage}-deployment`;
  }

  init() {
    return new Promise((resolve, reject) => {
      const groupParameters   = { location : this.sqz.vars.azure.credentials.location, tags : {} };
      const resourceGroupName = this.resourceGroupName;
      const deploymentName    = this.deploymentName;
      const clientId          = this.sqz.vars.azure.credentials.user;
      const secret            = this.sqz.vars.azure.credentials.pass;
      const domain            = this.sqz.vars.azure.credentials.tenant;
      const subscriptionId    = this.sqz.vars.azure.credentials.subscriptionId;

      msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain, (loginErr, credentials) => {
          if (loginErr) reject(loginErr);

          const resourceClient = new ResourceManagementClient(credentials, subscriptionId);

          const initialDeployment = () => {
            return new Promise((dplResolve, dplReject) => {
              this.sqz.cli.log.info(`Creating Azure resource group ${colors.blue(resourceGroupName)} ...`);
              resourceClient.resourceGroups
                .createOrUpdate(resourceGroupName, groupParameters, (crGroupErr, crGroupRes) => {
                  if (crGroupErr) dplReject(crGroupErr);

                  if (crGroupRes.properties.provisioningState !== 'Succeeded') {
                    dplReject('Cannot create the Azure Resource Group');
                  }

                  const base     = new Base(this.sqz);
                  const template = base.compile();

                  _.assign(template, base.addDeploymentStorageAccount());

                  const dplParams = {
                    properties : {
                      parameters : {},
                      template   : template,
                      mode       : 'Incremental'
                    }
                  };

                  this.sqz.cli.log.info('Deploying Azure initial resources...');

                  this.sqz.cli.loader.start();

                  resourceClient.deployments
                    .createOrUpdate(resourceGroupName, deploymentName, dplParams,
                      (dplErr, dplRes) => {
                        if (dplErr) dplReject(dplErr);

                        this.sqz.cli.loader.stop();
                        this.processOutput(dplRes);

                        dplResolve();
                      });
                });
            });
          };

          const checkProgress = (data) => {
            return new Promise((progressResolve) => {
              if (data && data.properties.provisioningState === 'Running') {
                this.sqz.cli.log.info('Another ARM deployment is in progress , waiting to finish ...');
                this.sqz.cli.loader.start();
                const interval = setInterval(() => {
                  resourceClient.deployments
                    .get(resourceGroupName, deploymentName, (dplExistsErr, dplExistsRes) => {
                      if (dplExistsRes && dplExistsRes.properties.provisioningState === 'Succeeded') {
                        clearInterval(interval);
                        this.sqz.cli.loader.stop();
                        progressResolve();
                      }
                    });
                }, 5000);
              } else {
                progressResolve();
              }
            });
          };

          resourceClient.deployments
            .get(resourceGroupName, deploymentName, (dplExistsErr, dplExistsRes) => {
              checkProgress(dplExistsRes).then(() => {
                if (dplExistsErr && dplExistsErr.statusCode === 404) {
                  initialDeployment().then(() => {
                    resolve();
                  });
                } else {
                  this.processOutput(dplExistsRes);
                  resolve();
                }
              });
            });
        });
    });
  }

  update() {
    return new Promise((resolve, reject) => {
      this.sqz.cli.log.info('Updating CloudFormation stack...');

      const templateUrl = `https://s3.amazonaws.com/${this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket}` +
        `/${this.sqz.vars.stage}/cloudformation/mainStack-template.json`;

      const params = {
        StackName    : this.mainStackName,
        Capabilities : [
          'CAPABILITY_IAM'
        ],
        Parameters   : [],
        TemplateURL  : templateUrl,
        Tags         : [
          {
            Key   : 'STAGE',
            Value : this.sqz.vars.stage
          }
        ]
      };

      client.updateStack(params, (error) => {
        if (error && error.message === 'No updates are to be performed.') {
          resolve();
        } else if (error) {
          reject(error);
        } else {
          this.progress('UPDATE').then(() => {
            resolve();
          });
        }
      });
    });
  }

  processOutput(data) {
    if (_.has(data.properties, 'outputs')) {
      _.forEach(data.properties.outputs, (obj, key) => {
        this.sqz.vars.azure.armOutputs[key] = obj.value;
        if (obj.value === 'ApiGatewayRestApiBaseUrl') {
          this.sqz.cli.log.info(`App Base URL : ${colors.blue.bold(output.OutputValue)}`);
        }
      });
    }
  }
}

module.exports = DeployArm;
