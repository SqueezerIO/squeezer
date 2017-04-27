'use strict';

const _ = require('lodash');

class Outputs {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  addOutput(sourceStack, depStack, output) {
    if (!_.has(this.sqz.vars.aws.cloudFormation.mainStack.Resources[sourceStack], 'DependsOn')) {
      this.sqz.vars.aws.cloudFormation.mainStack.Resources[sourceStack].DependsOn = [];
    }

    if (!_.includes(
        this.sqz.vars.aws.cloudFormation.mainStack.Resources[sourceStack].DependsOn,
        depStack)
    ) {
      this.sqz.vars.aws.cloudFormation.mainStack.Resources[sourceStack].DependsOn.push(depStack);
    }

    _.merge(this.sqz.vars.aws.cloudFormation.mainStack.Resources[sourceStack],
      {
        Properties : {
          Parameters : {
            [output] : {
              'Fn::GetAtt' : [depStack, `Outputs.${output}`]
            }
          }
        }
      }
    );

    if (this.microservice.aws.stackName !== depStack) {
      this.template.Parameters[output] = {
        Type : 'String'
      };
    } else {
      _.merge(
        this.sqz.vars.aws.cloudFormation[sourceStack],
        {
          Parameters : {
            [output] : {
              Type : 'String'
            }
          }
        }
      );
    }

    this.sqz.vars.aws.cloudFormation.mainStack.Outputs[output] = {
      Value : {
        'Fn::GetAtt' : [depStack, `Outputs.${output}`]
      }
    };

    return this.template;
  }
}

module.exports = Outputs;
