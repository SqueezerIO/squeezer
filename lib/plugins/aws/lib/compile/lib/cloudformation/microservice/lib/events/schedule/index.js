'use strict';

/**
 * Class that manages the schedule event
 */
class awsCompileScheduleEvent {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    this.scheduleLogicalId = `${lambdaFunction.identifier}EventsRule${event.counter}`;
    this.counter           = event.counter;
    this.lambdaLogicalId   = lambdaFunction.logicalId;
    this.scheduleValue     = event.value;

    this.addRule();
    this.addPermissions();

    return this.template;
  }

  addRule() {
    this.template.Resources[`${this.scheduleLogicalId}`] = {
      Type       : 'AWS::Events::Rule',
      Properties : {
        ScheduleExpression : this.scheduleValue,
        State              : 'ENABLED',
        Targets            : [
          {
            Arn : {
              'Fn::GetAtt' : [
                this.lambdaLogicalId,
                'Arn'
              ]
            },
            Id  : this.scheduleLogicalId
          }
        ]
      }
    };
  }

  addPermissions() {
    this.template.Resources[`${this.lambdaLogicalId}EventsRule${this.counter}`] = {
      Type       : 'AWS::Lambda::Permission',
      Properties : {
        FunctionName : {
          'Fn::GetAtt' : [
            this.lambdaLogicalId,
            'Arn'
          ]
        },
        Action       : 'lambda:InvokeFunction',
        Principal    : 'events.amazonaws.com',
        SourceArn    : {
          'Fn::GetAtt' : [
            this.scheduleLogicalId,
            'Arn'
          ]
        }
      }
    };
  }
}

module.exports = awsCompileScheduleEvent;
