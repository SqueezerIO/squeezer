'use strict';

const _ = require('lodash');

/**
 * Class that manages the main API Gateway CloudFormation stack
 */
class awsCompileApiGateway {
  constructor(sqz, microservice) {
    this.sqz                    = sqz;
    this.microservice           = microservice;
    this.microserviceIdentifier = `${_.upperFirst(_.camelCase(this.microservice.name))}Stack`;
    this.apiGatewayName         = `APIG-${this.sqz.vars.project.identifier}-${this.sqz.vars.stage}`;
    this.init();
  }

  init() {
    // initiate template stub
    if (!_.has(this.sqz.vars.aws.cloudFormation, 'ApiGatewayStack')) {
      this.sqz.vars.aws.cloudFormation.ApiGatewayStack = {
        AWSTemplateFormatVersion : '2010-09-09',
        Description              : 'API Gateway stack',
        Parameters               : {
          ApiGatewayRestApiName : {
            Type        : 'String',
            Default     : this.apiGatewayName,
            Description : 'API Gateway name'
          }
        },
        Resources                : {
          ApiGatewayRestApi : {
            Type       : 'AWS::ApiGateway::RestApi',
            Properties : {
              Description : 'API Gateway REST',
              Name        : {
                Ref : 'ApiGatewayRestApiName'
              }
            }
          }
        },
        Outputs                  : {
          ApiGatewayRestApiId      : {
            Value : {
              Ref : 'ApiGatewayRestApi'
            }
          },
          ApiGatewayRootResourceId : {
            Value : {
              'Fn::GetAtt' : ['ApiGatewayRestApi', 'RootResourceId']
            }
          },
          ApiGatewayRestApiBaseUrl : {
            Value : {
              'Fn::Join' : [
                '',
                [
                  'https://',
                  {
                    Ref : 'ApiGatewayRestApi'
                  },
                  `.execute-api.${this.sqz.vars.aws.region}.amazonaws.com/${this.sqz.vars.stage}`
                ]
              ]
            }
          }
        }
      };

      // add Api Gateway API name parameter to the main stack
      this.sqz.vars.aws.cloudFormation.mainStack.Parameters.ApiGatewayRestApiName = {
        Type        : 'String',
        Default     : this.apiGatewayName,
        Description : `${this.sqz.vars.project.name} API Gateway name`
      };

      // add nested CloudFormation API Gateway s3 template
      this.sqz.vars.aws.cloudFormation.mainStack.Resources.ApiGatewayStack = {
        Type       : 'AWS::CloudFormation::Stack',
        Properties : {
          TemplateURL      : `https://s3.amazonaws.com/${this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket}` +
          `/${this.sqz.vars.stage}/cloudformation/ApiGatewayStack-template.json`,
          TimeoutInMinutes : 10,
          Parameters       : {
            ApiGatewayRestApiName : {
              Ref : 'ApiGatewayRestApiName'
            }
          }
        },
        DependsOn  : ['iamStack']
      };

      // add API URL output in order to grab the URL base endpoint on CF deployment
      this.sqz.vars.aws.cloudFormation.mainStack.Outputs.ApiGatewayRestApiBaseUrl = {
        Value : {
          'Fn::GetAtt' : ['ApiGatewayStack', 'Outputs.ApiGatewayRestApiBaseUrl']
        }
      };

      // add API deployment stack
      this.sqz.vars.aws.cloudFormation.mainStack.Resources.ApiGatewayDeploymentStack = {
        Type       : 'AWS::CloudFormation::Stack',
        Properties : {
          TemplateURL      : `https://s3.amazonaws.com/${this.sqz.vars.aws.cfOutputs.SqueezerDeploymentBucket}` +
          `/${this.sqz.vars.stage}/cloudformation/ApiGatewayDeploymentStack-template.json`,
          TimeoutInMinutes : 10,
          Parameters       : {
            ApiGatewayRestApiId : {
              'Fn::GetAtt' : ['ApiGatewayStack', 'Outputs.ApiGatewayRestApiId']
            }
          }
        },
        DependsOn  : ['iamStack']
      };

      this.sqz.vars.aws.cloudFormation.ApiGatewayDeploymentStack = {
        AWSTemplateFormatVersion : '2010-09-09',
        Description              : 'API Gateway Deployment stack',
        Parameters               : {
          ApiGatewayRestApiId : {
            Type : 'String'
          }
        },
        Resources                : {}
      };

      this.sqz.vars.aws.cloudFormation.ApiGatewayDeploymentStack.Resources[`ApiGatewayDeployment${Date.now()}`] = {
        Type       : 'AWS::ApiGateway::Deployment',
        Properties : {
          RestApiId : {
            Ref : 'ApiGatewayRestApiId'
          },
          StageName : this.sqz.vars.stage
        }
      };
    }

    // add current microservice stack to the ApiGatewayDeploymentStack dependencies
    if (!_.includes(
        this.sqz.vars.aws.cloudFormation.mainStack.Resources.ApiGatewayDeploymentStack.DependsOn,
        this.microserviceIdentifier)
    ) {
      this.sqz.vars.aws.cloudFormation.mainStack.Resources.ApiGatewayDeploymentStack
        .DependsOn.push(this.microserviceIdentifier);
    }
  }

  getResourceIdentifier(path, index) {
    const pathParts = path.split('/').slice(1).slice(0, index + 1).join('/');

    return `ApiGatewayResource${_.upperFirst(_.camelCase(pathParts))}`;
  }

  addPathParts(event) {
    const pathParts = event.path.split('/').slice(1);

    _.forEach(pathParts, (value, key) => {
      const resourceId       = this.getResourceIdentifier(event.path, key);
      const parentResourceId = this.getResourceIdentifier(event.path, key - 1);

      if (event.path !== '/') {
        this.sqz.vars.aws.cloudFormation.ApiGatewayStack.Resources[resourceId] = {
          Type       : 'AWS::ApiGateway::Resource',
          Properties : {
            PathPart  : value,
            RestApiId : {
              Ref : 'ApiGatewayRestApi'
            }
          }
        };

        if (key === 0) {
          this.sqz.vars.aws.cloudFormation.ApiGatewayStack
            .Resources[resourceId].Properties.ParentId = {
              'Fn::GetAtt' : [
                'ApiGatewayRestApi',
                'RootResourceId'
              ]
            };
        } else if (key > 0) {
          this.sqz.vars.aws.cloudFormation.ApiGatewayStack
            .Resources[resourceId].Properties.ParentId = {
              Ref : parentResourceId
            };
        }

        if (key === (pathParts.length - 1)) {
          this.sqz.vars.aws.cloudFormation.mainStack.Resources[this.microserviceIdentifier]
            .Properties.Parameters[resourceId] = {
              'Fn::GetAtt' : ['ApiGatewayStack', `Outputs.${resourceId}`]
            };
        }

        this.sqz.vars.aws.cloudFormation.ApiGatewayStack.Outputs[resourceId] = {
          Value : {
            Ref : resourceId
          }
        };
      }
    });
  }
}

module.exports = awsCompileApiGateway;
