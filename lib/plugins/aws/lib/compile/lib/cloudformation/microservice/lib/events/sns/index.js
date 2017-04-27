'use strict';

const Outputs = require('../../outputs');
const _       = require('lodash');

/**
 * Class that manages the SNS event
 */
class awsCompileSNSEvent {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    const topicSplit = event.topic.split('.');

    this.lambdaLogicalId = lambdaFunction.logicalId;
    this.lambdaArn       = `${lambdaFunction.logicalId}Arn`;
    this.sourceStack     = topicSplit[0];
    this.topic           = topicSplit[1];

    if (!_.has(this.sqz.vars.aws.cloudFormation, this.sourceStack)) {
      this.sqz.cli.log.error(
        `There is no any stack available with name ${this.sourceStack}`
      );
    }

    const outputs = new Outputs(this.sqz, this.microservice, this.template);

    this.template = outputs.addOutput(
      this.sourceStack, this.microservice.aws.stackName, this.lambdaArn
    );

    this.addlambdaArnOutput();
    this.addSubscription();
    this.addPermissions();

    return this.template;
  }

  addlambdaArnOutput() {
    this.template.Outputs[this.lambdaArn] = {
      Value : {
        'Fn::GetAtt' : [
          this.lambdaLogicalId,
          'Arn'
        ]
      }
    };
  }

  addSubscription() {
    _.merge(
      this.sqz.vars.aws.cloudFormation[this.sourceStack].Resources[this.topic],
      {
        Properties : {
          TopicName    : this.topicName,
          Subscription : [
            {
              Endpoint : {
                Ref : this.lambdaArn
              },
              Protocol : 'lambda'
            }
          ]
        }
      }
    );
  }

  /**
   * add Lambda SNS invocation permissions
   */
  addPermissions() {
    this.template.Resources[`${this.lambdaLogicalId}SNSPermissions`] = {
      Type       : 'AWS::Lambda::Permission',
      Properties : {
        FunctionName : {
          'Fn::GetAtt' : [
            this.lambdaLogicalId,
            'Arn'
          ]
        },
        Action       : 'lambda:InvokeFunction',
        Principal    : 'sns.amazonaws.com'
      }
    };
  }
}

module.exports = awsCompileSNSEvent;
