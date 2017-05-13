'use strict';

/**
 * inspired from serverless.com "logs" command
 */

const colors  = require('colors');
const Promise = require('bluebird');
const _       = require('lodash');
const AWS     = require('aws-sdk');
const moment  = require('moment');
const os      = require('os');

const cloudwatchlogs = new AWS.CloudWatchLogs();

/**
 * Class representing AWS Lambda cloudwatch logs
 */
class AWSLogs {
  constructor(sqz) {
    this.sqz                = sqz;
    this.options            = this.sqz.cli.params.get().options;
    this.functionIdentifier = _.upperFirst(_.camelCase(this.options.function));
    this.functionName       = `${this.sqz.vars.project.identifier}${this.functionIdentifier}Function-${this.sqz.vars.stage}`;
    this.logGroupName       = `/aws/lambda/${this.functionName}`;
    this.interval           = this.options.interval || 1000;
  }

  run() {
    this.getLogStreams().then((logStreamNames) => {
      this.displayLogs(logStreamNames);
    });
  }

  getLogStreams() {
    return new Promise((resolve) => {
      const params = {
        logGroupName : this.logGroupName,
        descending   : true,
        limit        : 50,
        orderBy      : 'LastEventTime'
      };

      cloudwatchlogs.describeLogStreams(params, (err, data) => {
        if (err) this.sqz.cli.log.error(err);

        const logStreamNames = _.chain(data.logStreams)
          .filter(stream => stream.logStreamName.includes('[$LATEST]'))
          .map('logStreamName')
          .value();

        resolve(logStreamNames);
      });
    });
  }

  displayLogs(logStreamNames) {
    const valDate = (splittedDate, msg) => {
      if (splittedDate.length < 3 || new Date(splittedDate[0]) === 'Invalid Date') {
        return msg;
      }
    };

    const formatLambdaLogEvent = (msgParam) => {
      let msg          = msgParam;
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS (Z)';

      if (msg.startsWith('REPORT')) {
        msg += os.EOL;
      }
      if (msg.startsWith('START') || msg.startsWith('END') || msg.startsWith('REPORT')) {
        return colors.yellow(msg);
      } else if (msg.trim().indexOf('Process exited before completing request') > -1) {
        return colors.red(msg);
      }

      const splitted = msg.split('\t');

      valDate(splitted, msg);

      const reqId = splitted[1];
      const time  = colors.green(moment(splitted[0]).format(dateFormat));
      const text  = msg.split(`${reqId}\t`)[1];

      return `${time}\t${colors.yellow(reqId)}\t\n${text}`;
    };

    const params = {
      logGroupName   : this.logGroupName,
      logStreamNames : logStreamNames
    };


    return cloudwatchlogs.filterLogEvents(params, (err, data) => {
      if (err) this.sqz.cli.log.error(err);

      if (data.events) {
        data.events.forEach((e) => {
          process.stdout.write(formatLambdaLogEvent(e.message));
        });
        this.sqz.cli.log.console('');
      }
    });
  }
}

module.exports = AWSLogs;
