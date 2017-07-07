'use strict';

const _                   = require('lodash');
const ApiGatewayMainStack = require('../../../../main/apiGateway');
const Outputs             = require('../../outputs');

/**
 * Class that manages the API Gateway event
 */
class awsCompileApiGateway {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(event, lambdaFunction) {
    const apiGatewayMainStack = new ApiGatewayMainStack(this.sqz, this.microservice);

    event.identifier      = `${_.upperFirst(event.method)}` +
      `${_.upperFirst(_.camelCase(event.path))}`;
    event.corsIdentifier  = 'Options' +
      `${_.upperFirst(_.camelCase(event.path))}`;
    event.shortIdentifier = `${_.upperFirst(_.camelCase(event.path))}`;

    apiGatewayMainStack.addPathParts(event, lambdaFunction);

    this.addMethod(event, lambdaFunction);
    this.addPermission(lambdaFunction);

    return this.template;
  }


  addMethod(event, lambdaFunction) {
    const apiGatewayMainStack = new ApiGatewayMainStack(this.sqz, this.microservice);
    const pathParts           = event.path.split('/').slice(1);
    const pathPartsLen        = pathParts.length;
    let resourceParentId;

    if (event.path === '/') {
      resourceParentId = 'ApiGatewayRootResourceId';

      const outputs = new Outputs(this.sqz, this.microservice, this.template);

      this.template = outputs.addOutput(
        this.microservice.aws.stackName, 'ApiGatewayStack', resourceParentId
      );
    } else {
      resourceParentId = apiGatewayMainStack.getResourceIdentifier(event.path, pathPartsLen - 1);
    }

    // console.log(event.identifier);
    // console.log(event);
    // console.log(this.sqz.vars.env);
    // process.exit(0);

    this.template.Resources[`${event.identifier}Method`] = {
      Type       : 'AWS::ApiGateway::Method',
      Properties : {
        AuthorizationType : 'NONE',
        HttpMethod        : event.method.toUpperCase(),
        Integration       : {
          IntegrationHttpMethod : 'POST',
          Type                  : 'AWS_PROXY',
          Uri                   : {
            'Fn::Join' : [
              '',
              [
                'arn:aws:apigateway:',
                {
                  Ref : 'AWS::Region'
                },
                ':lambda:path/2015-03-31/functions/',
                {
                  'Fn::GetAtt' : [
                    lambdaFunction.logicalId,
                    'Arn'
                  ]
                },
                '/invocations'
              ]
            ]
          }
        },
        ResourceId        : {
          Ref : resourceParentId
        },
        RestApiId         : {
          Ref : 'ApiGatewayRestApiId'
        }
      }
    };

    if (this.sqz.vars.env.CORS) {
      this.template.Resources[`${event.corsIdentifier}Method`] = {
        Type       : 'AWS::ApiGateway::Method',
        Properties : {
          AuthorizationType    : 'NONE',
          HttpMethod           : 'OPTIONS',
          Integration          : {
            Type : 'MOCK',
            IntegrationResponses : [
              {
                ResponseParameters : {
                  'method.response.header.Access-Control-Allow-Origin'  : "'*'",
                  'method.response.header.Access-Control-Allow-Headers' : "'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'",
                  'method.response.header.Access-Control-Allow-Methods' : "'*'"
                },
                ResponseTemplates  : {
                  'application/json' : ''
                },
                StatusCode         : 200
              }
            ],
            PassthroughBehavior  : 'WHEN_NO_TEMPLATES',
            RequestTemplates     : {
              'application/json' : '{"statusCode": 200}'
            }
          },
          // Responses         : {
          //   default : {
          //     statusCode : 200,
          //     headers    : {
          //       'Access-Control-Allow-Headers' : '*',
          //       'Access-Control-Allow-Methods' : '*',
          //       'Access-Control-Allow-Origin'  : '*'
          //     }
          //   }
          // },

          MethodResponses      : [{
            StatusCode         : 200,
            ResponseModels     : {
              'application/json' : 'Empty'
            },
            ResponseParameters : {
              'method.response.header.Access-Control-Allow-Headers' : true,
              'method.response.header.Access-Control-Allow-Methods' : true,
              'method.response.header.Access-Control-Allow-Origin'  : true
            }
          }],
          ResourceId           : {
            Ref : resourceParentId
          },
          RestApiId            : {
            Ref : 'ApiGatewayRestApiId'
          }
        }
      };
    }

    this.template.Parameters.ApiGatewayRestApiId = {
      Type : 'String'
    };

    this.template.Parameters[resourceParentId] = {
      Type : 'String'
    };
  }

  addPermission(lambdaFunction) {
    this.template.Resources[`${lambdaFunction.identifier}FunctionApiGatewayPermission`] = {
      Type       : 'AWS::Lambda::Permission',
      Properties : {
        FunctionName : {
          'Fn::GetAtt' : [
            lambdaFunction.logicalId,
            'Arn'
          ]
        },
        Action       : 'lambda:InvokeFunction',
        Principal    : 'apigateway.amazonaws.com'
      }
    };
  }
}

module.exports = awsCompileApiGateway;
