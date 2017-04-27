'use strict';

const Outputs = require('../../outputs');

/**
 * Class that manages the streaming event
 */
class awsCompileStreamEvent {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    this.lambdaLogicalId = lambdaFunction.logicalId;
    this.eventLogicalId  = `${this.lambdaLogicalId}EventSourceMapping${event.counter}`;
    const sourceSplit    = event.sourceArn.split('.');
    this.depStack        = sourceSplit[0];
    this.eventSourceArn  = sourceSplit[2];
    this.params          = {
      batchSize     : event.batchSize || 100,
      startPosition : event.startPosition || 'LATEST'
    };
    const outputs = new Outputs(this.sqz, this.microservice, this.template);

    this.template = outputs.addOutput(
      this.microservice.aws.stackName, this.depStack, this.eventSourceArn
    );

    this.addEventSource();

    return this.template;
  }

  addEventSource() {
    this.template.Resources[this.eventLogicalId] = {
      Type       : 'AWS::Lambda::EventSourceMapping',
      Properties : {
        BatchSize        : this.params.batchSize,
        EventSourceArn   : {
          Ref : this.eventSourceArn
        },
        FunctionName     : {
          'Fn::GetAtt' : [
            this.lambdaLogicalId,
            'Arn'
          ]
        },
        StartingPosition : this.params.startPosition,
        Enabled          : 'True'
      }
    };
  }
}

module.exports = awsCompileStreamEvent;
