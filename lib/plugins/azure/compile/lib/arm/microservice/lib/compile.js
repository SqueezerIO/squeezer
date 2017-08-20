'use strict';

const _      = require('lodash');
const Base   = require('../../main/base');
const AzureFunction = require('./azureFunction');

const httpEvent        = require('./events/http');

const events = {
  http        : httpEvent
};

/**
 * Class that manages ARM template compiling
 */
class AzureTemplateCompile {
  constructor(sqz, microservice) {
    this.sqz = sqz;

    const checksum = this.sqz.vars.currentChecksums
      .microservices[microservice.identifier];

    this.sqz.vars.microservices[microservice.name].azure = {
      templateName : `${microservice.identifier}Arm`,
      storage        : {
        key : `${this.sqz.vars.stage}/microservices/${microservice.identifier}/${checksum}`
      }
    };

    this.microservice = this.sqz.vars.microservices[microservice.name];

    const base    = new Base(sqz, microservice);
    this.template = base.compile();

    const templateIdentifier = this.microservice.azure.templateName;

    // includes microservice's nested stack into the main template
    if (!_.has(this.sqz.vars.aws.cloudFormation.mainStack.Resources, stackIdentifier)) {
      this.sqz.vars.aws.cloudFormation.mainStack.Resources[stackIdentifier] = {
        Type       : 'AWS::CloudFormation::Stack',
        Properties : {
          TemplateURL      : `https://s3.amazonaws.com/${this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket}/` +
          `${this.sqz.vars.stage}/cloudformation/` +
          `${this.microservice.identifier}Stack-template.json`,
          TimeoutInMinutes : 10,
          Parameters       : {
            ApiGatewayRestApiId    : {
              'Fn::GetAtt' : ['ApiGatewayStack', 'Outputs.ApiGatewayRestApiId']
            },
            IamRoleLambdaExecution : {
              'Fn::GetAtt' : ['iamStack', 'Outputs.IamRoleLambdaExecution']
            }
          }
        },
        DependsOn  : ['iamStack', 'ApiGatewayStack']
      };
      if (this.sqz.vars.project.type === 'web') {
        this.sqz.vars.aws.cloudFormation.mainStack.Resources[stackIdentifier].DependsOn.push(
          'cloudFrontStack'
        );
      }
    }
  }

  /**
   * Get current template
   */
  get() {
    return this.template;
  }

  /**
   * Compile all functions & events
   */
  functions() {
    this.microservice.azure.counters = {};

    _.forEach(this.microservice.functions, (azureFunction, functionName) => {
      if (this.sqz.validate.stage(azureFunction.stages)) {
        azureFunction.logicalId = `${this.sqz.vars.project.identifier}${azureFunction.identifier}Function`;

        this.compileAzureFunction(azureFunction, functionName);

        _.forEach(azureFunction.events, (val) => {
          const type  = Object.keys(val)[0];
          const event = val[type];

          const EventClass = new events[type](this.sqz, this.microservice, this.template);
          EventClass.compile(event, azureFunction);
        });
      }
    });

    // this.addS3Upload();
  }

  /**
   * compile azure function
   * @param azureFunction
   */
  compileAzureFunction(func, type, functionName) {
    const azureFunction  = new AzureFunction(this.sqz, this.microservice, this.template);
    this.template = azureFunction.compile(func, type, functionName);
  }

  /**
   * add microservice to the s3 uploads stack
   */
  addS3Upload() {
    if (this.microservice.deploy) {
      this.sqz.vars.aws.s3Uploads.push({
        path  : `${this.sqz.vars.project.buildPath}/deploy/microservices`,
        name  : `${this.microservice.identifier}.zip`,
        s3Key : `${this.microservice.aws.s3.key}/${this.microservice.identifier}.zip`
      });
    }

    this.sqz.vars.aws.s3Uploads.push({
      path  : `${this.sqz.vars.project.buildPath}/deploy/cloudformation`,
      name  : `${this.microservice.identifier}Stack-template.json`,
      s3Key : `${this.sqz.vars.stage}/cloudformation/` +
      `${this.microservice.identifier}Stack-template.json`
    });
  }
}

module.exports = AzureTemplateCompile;
