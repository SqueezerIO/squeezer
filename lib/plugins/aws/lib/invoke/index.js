'use strict';

/**
 * inspired from serverless.com "logs" command
 */

const Promise   = require('bluebird');
const _         = require('lodash');
const AWS       = require('aws-sdk');
const moment    = require('moment');
const colors    = require('colors');

const lambdaClient = new AWS.Lambda();

/**
 * Class representing AWS Lambda cloudwatch logs
 */
class AWSInvoke {
  constructor(sqz) {
    this.sqz                = sqz;
    this.options            = this.sqz.cli.params.get().options;
    this.functionIdentifier = _.upperFirst(_.camelCase(this.options.function));
    this.functionName       = `${this.sqz.vars.project.identifier}${this.functionIdentifier}Function-${this.sqz.vars.stage}`;
  }

  run(functionName, eventInput) {
    this.sqz.cli.log.info(
      `Invoking function ${colors.blue.bold(functionName)} on the AWS Lambda Cloud environment`
    );

    this.invoke(eventInput).then((res) => {
      this.log(res);
    });
  }

  invoke(eventInput) {
    return new Promise((resolve) => {
      const params = {
        FunctionName   : this.functionName,
        InvocationType : 'RequestResponse',
        LogType        : 'Tail',
        Payload        : new Buffer(JSON.stringify(eventInput))
      };

      lambdaClient.invoke(params, (err, data) => {
        if (err) this.sqz.cli.log.error(err);

        resolve(data);
      });
    });
  }

  log(reply) {
    const color = !reply.FunctionError ? 'white' : 'red';
    if (reply.Payload) {
      const response = JSON.parse(reply.Payload);

      this.sqz.cli.log.console(colors[color](JSON.stringify(response, null, 4)));
    }

    const validateLine = (msg) => {
      if (msg.startsWith('START') || msg.startsWith('END') || msg.startsWith('REPORT')) {
        return colors.yellow(msg);
      }  if (msg.trim() === 'Process exited before completing request') {
        return colors.red(msg);
      }
    };

    const formatLog = (msg) => {
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS (Z)';

      const splitted = msg.split('\t');

      if (splitted.length < 3 || new Date(splitted[0]) === 'Invalid Date') {
        return msg;
      }
      const reqId = splitted[1];
      const time  = colors.green(moment(splitted[0]).format(dateFormat));
      const text  = msg.split(`${reqId}\t`)[1];

      return `${time}\t${colors.yellow(reqId)}\t${text}`;
    };

    if (reply.LogResult) {
      this.sqz.cli.log.console(colors
        .gray('--------------------------------------------------------------------'));
      const logResult = new Buffer(reply.LogResult, 'base64').toString();
      logResult.split('\n').forEach(
        line => this.sqz.cli.log.console(validateLine(line) || formatLog(line))
      );
    }
  }
}

module.exports = AWSInvoke;
