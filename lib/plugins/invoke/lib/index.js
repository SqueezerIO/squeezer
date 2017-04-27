'use strict';

const AWSInvoke = require('../../aws/lib/invoke');
const fs        = require('fs');

/**
 * Command that invokes a function directly on the cloud
 */
class AWSInvokeCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise(() => {
      const options  = this.sqz.cli.params.get().options;
      const functionName = options.function;
      let eventInput = {};

      if (options.path) {
        eventInput = JSON.parse(fs.readFileSync(options.path, 'utf8'));
      } else if (options.json) {
        eventInput = JSON.parse(JSON.stringify(options.json));
      }

      if (this.sqz.vars.project.cloud.name === 'aws') {
        const awsInvoke = new AWSInvoke(this.sqz);
        awsInvoke.run(functionName, eventInput);
      }
    });
  }
}

module.exports = AWSInvokeCMD;
