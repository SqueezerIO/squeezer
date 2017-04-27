'use strict';

/**
 * Class that manages CloudFormation IAM Role resource
 */
class awsIAMRole {
  constructor(sqz, template) {
    this.sqz = sqz;
    this.template = template;
  }

  compile() {
    this.template.Resources.IamRoleLambdaExecution = {
      Type       : 'AWS::IAM::Role',
      Properties : {
        AssumeRolePolicyDocument : {
          Version   : '2012-10-17',
          Statement : [
            {
              Effect    : 'Allow',
              Principal : {
                Service : [
                  'lambda.amazonaws.com'
                ]
              },
              Action    : [
                'sts:AssumeRole'
              ]
            }
          ]
        },
        Path                     : '/'
      }
    };

    this.template.Outputs.IamRoleLambdaExecution = {
      Description : 'Lambda function details',
      Value: {
        'Fn::GetAtt': [
          'IamRoleLambdaExecution',
          'Arn'
        ]
      }
    };

    return this.template;
  }
}

module.exports = awsIAMRole;
