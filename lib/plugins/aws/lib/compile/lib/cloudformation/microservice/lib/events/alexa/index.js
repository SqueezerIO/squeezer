'use strict';

/**
 * Class that manages the iot event
 */
class awsCompileAlekaSkillEvent {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    this.lambdaLogicalId   = lambdaFunction.logicalId;

    if (event.enabled) {
      this.addPermissions();
    }

    return this.template;
  }

  addPermissions() {
    this.template.Resources[`${this.lambdaLogicalId}AlexaSkillsPermission`] = {
      Type       : 'AWS::Lambda::Permission',
      Properties : {
        FunctionName : {
          'Fn::GetAtt' : [
            this.lambdaLogicalId,
            'Arn'
          ]
        },
        Action       : 'lambda:InvokeFunction',
        Principal    : 'alexa-appkit.amazon.com'
      }
    };
  }
}

module.exports = awsCompileAlekaSkillEvent;
