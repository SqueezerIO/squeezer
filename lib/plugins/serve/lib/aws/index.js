/* eslint global-require: 0 */

'use strict';

const _               = require('lodash');
const ApiGatewayEvent = require('./lib/event');
const RunCommon       = require('../../../run/lib');
const fs              = require('fs');

/**
 * Class that build the AWS API gateway context
 */
class Express {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Transform Express request and response to the API Gateway input
   *
   * @param req - Express HTTP request
   * @param res - Express HTTP response
   * @param data - event data
   */
  run(req, res, data) {
    const apiGatewayEvent     = new ApiGatewayEvent(this.sqz, req, data);
    const runCommon           = new RunCommon(this.sqz);
    const projectType         = this.sqz.vars.project.type;
    const projectPath         = this.sqz.vars.project.path;
    const apiGatewayEventData = JSON.stringify(apiGatewayEvent.build());
    const target              = `${projectPath}/.build/development/microservices/${data.microservice.identifier}`;

    const responseFile   = `${this.sqz.vars.project.buildPath}/development/response.json`;
    const eventInputFile = `${data.microservice.path}/event.input.json`;
    const runCmd         = this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/run/execute.function.yml`, {
      projectPath    : projectPath,
      target         : target,
      handler        : data.func.handler,
      eventInputFile : eventInputFile
    })[0];

    fs.writeFileSync(eventInputFile, apiGatewayEventData, 'utf8');

    runCommon.loadEnv(data.microservice).then(() => {
      this.sqz.command.run(runCmd.description, runCmd.bin, runCmd.args, true).then((code) => {
        if (code === 0) {
          const parsedRes = JSON.parse(fs.readFileSync(responseFile, 'utf8'));
          if (_.has(parsedRes, 'body') && projectType === 'api') {
            parsedRes.body = JSON.parse(parsedRes.body);
          }
          _.forEach(parsedRes.headers, (val, key) => {
            res.setHeader(key, val);
          });
          res.status(parsedRes.statusCode).send(parsedRes.body);
        } else {
          res.status(400).end();
        }
      });
    });
  }
}

module.exports = Express;
