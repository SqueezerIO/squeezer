'use strict';

const AwsLogs = require('../../aws/lib/logs');

/**
 * Output the logs of a deployed function
 */
class Logs {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise(() => {
      if (this.sqz.vars.project.cloud.name === 'aws') {
        const awsLogs = new AwsLogs(this.sqz);
        awsLogs.run();
      }
    });
  }
}

module.exports = Logs;
