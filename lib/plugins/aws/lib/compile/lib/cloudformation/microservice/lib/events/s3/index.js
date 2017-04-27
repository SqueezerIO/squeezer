'use strict';

const _      = require('lodash');
const colors = require('colors');

/**
 * Class that manages the s3 event
 */
class awsCompileS3Event {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    const currStack       = this.microservice.aws.stackName;
    const xplBucket       = event.bucket.split('.');
    const lambdaLogicalId = lambdaFunction.logicalId;
    const lambdaArn       = `${lambdaLogicalId}Arn`;
    const depStack        = xplBucket[0];
    const s3Bucket        = xplBucket[1];

    if (!_.has(this.sqz.vars.aws.cloudFormation, depStack)) {
      this.sqz.cli.log.error(
        `There is no any stack available with name ${depStack}`
      );
    }

    const depStackResource = this.sqz.vars.aws.cloudFormation.mainStack.Resources[depStack];
    const depStackData     = this.sqz.vars.aws.cloudFormation[depStack];

    if (!_.has(depStackData.Resources, s3Bucket)) {
      this.sqz.cli.log.error(
        `There is no bucket ${colors.blue.bold(s3Bucket)} available in stack ${colors.blue.bold(depStack)}`
      );
    }

    this.addLambdaArnOutput(lambdaArn, lambdaLogicalId);
    this.addCurrStackDeps(depStackResource, currStack, depStack, lambdaArn);
    this.addS3Permissions(lambdaLogicalId);

    /* add Lambda Arn parameter into the S3 bucket parent stack*/
    if (!_.has(depStackData, 'Parameters')) {
      depStackData.Parameters = {};
    }
    depStackData.Parameters[lambdaArn] = {
      Type : 'String'
    };

    /* add Lambda Notification Configurations */
    if (!_.has(depStackData, 'Properties')) {
      depStackData.Resources[s3Bucket].Properties = {};
    }
    const notificationConf = {
      Event    : event.event,
      Function : {
        Ref : lambdaArn
      }
    };

    if (_.has(event, 'filter')) {
      notificationConf.Filter = event.filter;
    }

    _.merge(
      depStackData.Resources[s3Bucket].Properties,
      {
        NotificationConfiguration : {
          LambdaConfigurations : [
            notificationConf
          ]
        }
      }
    );

    _.merge(this.sqz.vars.aws.cloudFormation[depStack], depStackData);

    return this.template;
  }

  /**
   * add current Lambda function Arn to output
   *
   * @param lambdaArn
   * @param lambdaLogicalId
   */
  addLambdaArnOutput(lambdaArn, lambdaLogicalId) {
    this.template.Outputs[lambdaArn] = {
      Value : {
        'Fn::GetAtt' : [
          lambdaLogicalId,
          'Arn'
        ]
      }
    };
  }

  /**
   * add current microservice stack dependency to the s3 stack
   * @param depStackResource
   * @param currStack
   * @param depStack
   * @param lambdaArn
   */
  addCurrStackDeps(depStackResource, currStack, depStack, lambdaArn) {
    if (!_.has(depStackResource, 'DependsOn')) {
      depStackResource.DependsOn = [];
    }
    if (!_.has(depStackResource.Properties, 'Parameters')) {
      depStackResource.Properties.Parameters = {};
    }
    depStackResource.Properties.Parameters[lambdaArn] = {
      'Fn::GetAtt' : [currStack, `Outputs.${lambdaArn}`]
    };

    if (!_.includes(
        depStackResource.DependsOn,
        currStack)
    ) {
      depStackResource.DependsOn.push(currStack);
    }
    _.merge(this.sqz.vars.aws.cloudFormation.mainStack.Resources[depStack], depStackResource);
  }

  /**
   * add Lambda S3 invocation permissions
   * @param lambdaLogicalId
   */
  addS3Permissions(lambdaLogicalId) {
    this.template.Resources[`${lambdaLogicalId}S3Permissions`] = {
      Type       : 'AWS::Lambda::Permission',
      Properties : {
        FunctionName : {
          'Fn::GetAtt' : [
            lambdaLogicalId,
            'Arn'
          ]
        },
        Action       : 'lambda:InvokeFunction',
        Principal    : 's3.amazonaws.com'
      }
    };
  }
}

module.exports = awsCompileS3Event;
