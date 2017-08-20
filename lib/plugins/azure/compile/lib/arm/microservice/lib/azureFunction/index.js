'use strict';

const _       = require('lodash');
const Outputs = require('../outputs');

/**
 * Class that manages API Gateway CloudFormation resources
 */
class AWSLambda {
  constructor(sqz, microservice, template) {
    this.sqz          = sqz;
    this.microservice = microservice;
    this.template     = template;
  }

  compile(lambdaFunction, functionName) {
    const runtime   = this.sqz.vars.project.runtime;
    const variables = this.variables();

    if (this.sqz.vars.project.type === 'web') {
      const cloudFrontDomain = this.sqz.vars.aws.cfOutputs.CloudFrontDomain;

      variables.MAIN_ASSETS_URL  = `https://${cloudFrontDomain}/assets/main`;
      variables.ASSETS_URL       = `https://${cloudFrontDomain}/assets/microservices/` +
        `${this.microservice.identifier}`;
      variables.ASSETS_CHECKSUMS = new Buffer(JSON.stringify(this.sqz.vars.currentChecksums)).toString('base64');
    }

    //this.template.Resources[lambdaFunction.logicalId] = {

    this.template.resources.push = {
      apiVersion : '2015-08-01',
      name       : lambdaFunction.logicalId,
      type       : 'functions',
      dependsOn  : [
        "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]"
      ],
      properties : {
        config : {
          bindings : [
          ]
        },
        files  : {
          'run.csx' : "using System.Net;\r\n\r\n public static HttpResponseMessage Run(HttpRequestMessage req, TraceWriter log)\r\n\r\n {\r\n\r\n     return req.CreateResponse(HttpStatusCode.OK, \"Hello from MyFunction\");\r\n\r\n }"
        }
      }
    };


    return this.template;
  }

  variables() {
    const integrateOutput = (depStack, output) => {
      const currStack = this.microservice.aws.stackName;

      const outputs = new Outputs(this.sqz, this.microservice, this.template);

      this.template = outputs.addOutput(currStack, depStack, output);
    };

    const parseOutputs = (val) => {
      if (val && (typeof val === 'string') && val.match(/.*\.Outputs\..*/)) {
        const xplOutputs = val.split('.');

        const values = {
          stack  : xplOutputs[0],
          output : xplOutputs[2]
        };

        integrateOutput(values.stack, values.output);

        return values;
      }

      return null;
    };

    const extractOutputs = (vars) => {
      const variables = {};

      _.forEach(vars, (val, key) => {
        if (typeof (val) === 'object' && key === this.sqz.vars.stage) {
          _.forEach(val, (val2, key2) => {
            const outputs = parseOutputs(val2);
            if (outputs) {
              variables[key2] = {
                Ref : outputs.output
              };
            }
          });
        } else if (typeof (val) === 'string') {
          const outputs = parseOutputs(val);
          if (outputs) {
            variables[key] = {
              Ref : outputs.output
            };
          }
        }
      });

      return variables;
    };

    const vars = _.merge(
      this.microservice.envCompiled,
      extractOutputs(this.sqz.vars.project.env),
      extractOutputs(this.microservice.env)
    );

    return vars;
  }
}

module.exports = AWSLambda;
