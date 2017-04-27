'use strict';

const _       = require('lodash');
const Promise = require('bluebird');
const AWS     = require('aws-sdk');
const colors  = require('colors');
const Base    = require('../../compile/lib/cloudformation/main/base');

const client = new AWS.CloudFormation();

/**
 * Class representing microservice's AWS S3 bucket upload
 */
class DeployStack {
  constructor(sqz, microservice) {
    this.sqz           = sqz;
    this.microservice  = microservice;
    this.mainStackName = `${this.sqz.vars.project.identifier}-${this.sqz.vars.stage}`;
  }

  create() {
    return new Promise((resolve, reject) => {
      client.describeStacks({ StackName : this.mainStackName }, (error, res) => {
        const waitTypes = {
          CREATE_IN_PROGRESS : 'stackCreateComplete',
          UPDATE_IN_PROGRESS : 'stackUpdateComplete',
          DELETE_IN_PROGRESS : 'stackDeleteComplete'
        };

        let stackStatus;

        if (res) {
          stackStatus = res.Stacks[0].StackStatus;

          res.Stacks[0].Outputs.forEach((output) => {
            this.sqz.vars.aws.cfOutputs[output.OutputKey] = output.OutputValue;
          });
        }

        if (error && error.message === `Stack with id ${this.mainStackName} does not exist`) {
          const base = new Base();

          this.sqz.cli.log.info('Creating CloudFormation stack...');

          const template = base.compile(`${this.sqz.vars.project.name} - CloudFormation main`);
          _.assign(template, base.addS3DeploymentBucket());

          const params = {
            StackName    : this.mainStackName,
            OnFailure    : 'ROLLBACK',
            Capabilities : [
              'CAPABILITY_IAM'
            ],
            Parameters   : [],
            TemplateBody : JSON.stringify(template, null, 2),
            Tags         : [
              {
                Key   : 'STAGE',
                Value : this.sqz.vars.stage
              }
            ]
          };

          client.createStack(params, (err) => {
            if (err) {
              reject(err);
            }
            this.progress('CREATE').then(() => {
              resolve();
            });
          });
        } else if (_.includes(_.keys(waitTypes), stackStatus)) {
          const waitVal = waitTypes[stackStatus];
          this.sqz.cli.log.info('Another CloudFormation deployment is in progress , waiting to finish ...');
          this.sqz.cli.loader.start();
          client.waitFor(waitVal, { StackName : this.mainStackName }, () => {
            this.sqz.cli.loader.stop();
            resolve();
          });
        } else if (error) {
          reject(error);
        } else {
          resolve();
        }
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

  progress(type) {
    return new Promise((resolve, reject) => {
      const startTime = new Date();
      const self      = this;
      const timeout   = 2400; // seconds

      const waitTypes = {
        EXIST  : 'stackExists',
        CREATE : 'stackCreateComplete',
        UPDATE : 'stackUpdateComplete',
        DELETE : 'stackDeleteComplete'
      };

      const interval = setInterval(() => {
        const currentTimer = Math.round((new Date() - startTime) / 1000);

        if (currentTimer >= timeout) {
          reject(
            `Cloudformation ${colors.blue.bold(type)} stack timeout !`
          );
        }
      });

      this.sqz.cli.loader.start();

      client.waitFor(waitTypes[type], { StackName : this.mainStackName }, (err, data) => {
        if (err && err.code === 'ResourceNotReady') {
          client.describeStackEvents({ StackName : this.mainStackName }, (error, output) => {
            output.StackEvents.forEach((stackEvent) => {
              if (stackEvent.ResourceStatus.indexOf('FAILED') > -1) {
                self.sqz.cli.log.error(
                  'CloudFormation Error:\n\n' +
                  `RESOURCE : ${colors.blue.bold(stackEvent.LogicalResourceId)}\n` +
                  `${stackEvent.ResourceStatus} : ${stackEvent.ResourceStatusReason}`
                );
              }
            });
          });
        } else if (err) {
          reject(err);
        } else {
          clearInterval(interval);
          this.sqz.cli.loader.stop();
          this.processOutput(data);
          resolve();
        }
      });
    });
  }

  processOutput(data) {
    if (_.has(data, 'Stacks')) {
      data.Stacks.forEach((stack) => {
        stack.Outputs.forEach((output) => {
          this.sqz.vars.aws.cfOutputs[output.OutputKey] = output.OutputValue;
          if (output.OutputKey === 'ApiGatewayRestApiBaseUrl') {
            this.sqz.cli.log.info(`App Base URL : ${colors.blue.bold(output.OutputValue)}`);
          }
        });
      });
    }
  }
}

module.exports = DeployStack;
