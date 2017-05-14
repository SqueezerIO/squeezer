'use strict';

const _                   = require('lodash');
const ApiGatewayMainStack = require('../../../../main/apiGateway');
const Outputs = require('../../outputs');

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
