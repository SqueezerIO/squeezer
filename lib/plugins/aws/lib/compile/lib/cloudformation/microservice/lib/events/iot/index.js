'use strict';

/**
 * Class that manages the iot event
 */
class awsCompileIotEvent {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    this.scheduleLogicalId = `${lambdaFunction.identifier}IotTopicRule${event.counter}`;
    this.sql               = event.sql;
    this.lambdaLogicalId   = lambdaFunction.logicalId;

    this.addRule();
    this.addPermissions();

    return this.template;
  }

  addRule() {
    this.template.Resources[this.scheduleLogicalId] = {
      Type       : 'AWS::IoT::TopicRule',
      Properties : {
        TopicRulePayload : {
          RuleDisabled : false,
          Sql          : this.sql,
          Actions      : [
            {
              Lambda : {
                FunctionArn : {
                  'Fn::GetAtt' : [
                    this.lambdaLogicalId,
                    'Arn'
                  ]
                }
              }
            }
          ]
        }
      }
    };
  }

  addPermissions() {
    this.template.Resources[`${this.lambdaLogicalId}IotPermissions`] = {
      Type       : 'AWS::Lambda::Permission',
      Properties : {
        FunctionName : {
          'Fn::GetAtt' : [
            this.lambdaLogicalId,
            'Arn'
          ]
        },
        Action       : 'lambda:InvokeFunction',
        Principal    : 'iot.amazonaws.com'
      }
    };
  }
}

module.exports = awsCompileIotEvent;
