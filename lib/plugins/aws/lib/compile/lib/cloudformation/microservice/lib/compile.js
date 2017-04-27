'use strict';

const _      = require('lodash');
const Base   = require('../../main/base');
const Lambda = require('./lambda');

const httpEvent        = require('./events/apiGateway');
const s3Event          = require('./events/s3');
const scheduleEvent    = require('./events/schedule');
const streamEvent      = require('./events/stream');
const snsEvent         = require('./events/sns');
const iotEvent         = require('./events/iot');
const alexaSkillsEvent = require('./events/alexa');

const events = {
  http        : httpEvent,
  s3          : s3Event,
  schedule    : scheduleEvent,
  stream      : streamEvent,
  sns         : snsEvent,
  iot         : iotEvent,
  alexaSkills : alexaSkillsEvent
};

/**
 * Class that manages Cloud Stack template compiling
 */
class AWSTemplateCompile {
  constructor(sqz, microservice) {
    this.sqz = sqz;

    const checksum = this.sqz.vars.currentChecksums
      .microservices[microservice.identifier];

    this.sqz.vars.microservices[microservice.name].aws = {
      stackName : `${microservice.identifier}Stack`,
      s3        : {
        key : `${this.sqz.vars.stage}/microservices/${microservice.identifier}/${checksum}`
      }
    };

    this.microservice = this.sqz.vars.microservices[microservice.name];

    const base    = new Base(sqz, microservice);
    this.template = base.compile(
      `${this.microservice.name} microservice stack`
    );

    const stackIdentifier = this.microservice.aws.stackName;

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
    this.microservice.aws.counters = {};

    _.forEach(this.microservice.functions, (lambdaFunction, functionName) => {
      if (this.sqz.validate.stage(lambdaFunction.stages)) {
        lambdaFunction.logicalId = `${this.sqz.vars.project.identifier}${lambdaFunction.identifier}Function`;

        this.lambda(lambdaFunction, functionName);

        _.forEach(lambdaFunction.events, (val) => {
          const type  = Object.keys(val)[0];
          const event = val[type];

          const EventClass = new events[type](this.sqz, this.microservice, this.template);
          EventClass.compile(event, lambdaFunction);
        });
      }
    });

    this.addS3Upload();
  }

  /**
   * compile lambda function
   * @param lambdaFunction
   */
  lambda(lambdaFunction, type, functionName) {
    const lambda  = new Lambda(this.sqz, this.microservice, this.template);
    this.template = lambda.compile(lambdaFunction, type, functionName);
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

module.exports = AWSTemplateCompile;
