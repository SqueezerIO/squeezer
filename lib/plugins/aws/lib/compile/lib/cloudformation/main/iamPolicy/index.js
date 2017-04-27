'use strict';

/**
 * Class that manages CloudFormation IAM Policy resource
 */
class awsIAMPolicy {
  constructor(sqz, template) {
    this.sqz      = sqz;
    this.template = template;
  }

  compile() {
    const policyName = `${this.sqz.vars.project.identifier}-${this.sqz.vars.stage}`;

    this.template.Resources.IamPolicyLambdaExecution = {
      Type       : 'AWS::IAM::Policy',
      Properties : {
        PolicyName     : policyName,
        PolicyDocument : {
          Version   : '2012-10-17',
          Statement : [
            {
              Effect   : 'Allow',
              Action   : ['*'],
              Resource : '*'
            }
          ]
        },
        Roles          : [
          {
            Ref : 'IamRoleLambdaExecution'
          }
        ]
      }
    };

    return this.template;
  }
}

module.exports = awsIAMPolicy;
