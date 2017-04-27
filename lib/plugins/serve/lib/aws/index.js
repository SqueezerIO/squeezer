/* eslint global-require: 0 */

'use strict';

const _               = require('lodash');
const ApiGatewayEvent = require('./lib/event');
const RunCommon       = require('../../../run/lib')
const fs              = require('fs');
const colors          = require('colors');
const child           = require('child_process');

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

    const responseFile = `${this.sqz.vars.project.buildPath}/development/response`;
    const runCmd       = this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/run/execute.function.yml`, {
      projectPath : projectPath,
      target      : target,
      handler     : data.func.handler,
      event       : JSON.stringify(apiGatewayEventData)
    })[0];

    runCommon.loadEnv(data.microservice).then(() => {
      const exec = child.spawn(runCmd.bin, runCmd.args, {
        shell  : true,
        stderr : 'inherit'
      });

      exec.stderr.on('data', (errData) => {
        process.stderr.write(errData);
      });

      exec.on('close', (code) => {
        if (code === 0) {
          // this.sqz.command.run(runCmd.description, runCmd.bin, runCmd.args, true).then(() => {
          if (projectType === 'api') {
            const parsedRes = JSON.parse(fs.readFileSync(responseFile, 'utf8'));
            if (_.has(parsedRes, 'body')) {
              parsedRes.body = JSON.parse(parsedRes.body);
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(parsedRes);
          } else if (projectType === 'web') {
            const response = fs.readFileSync(responseFile, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.send(response);
          }
          // }).catch((e) => {
          //   this.sqz.cli.log.console(e);
          // });
        }
      });
    });
  }
}

module.exports = Express;
