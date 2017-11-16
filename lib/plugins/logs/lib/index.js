'use strict';

const Promise = require('bluebird');
const colors = require('colors');
const Provider = require('squeezer-provider-node');
const fs = require('fs');

class Invoke {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    const options      = this.sqz.cli.params.get().options;
    const functionName = options.function;
    const stage = options.stage;
    const provider = new Provider({
      name: this.sqz.vars.project.name,
      identifier : this.sqz.vars.project.identifier,
      path: this.sqz.vars.project.path,
      stage : stage,
      config : this.sqz.config.data
    }).init();
    const functionObject = this.sqz.vars.functions[functionName];
    let eventInput     = {};

    return new Promise((resolve) => {
      if (options.path) {
        eventInput = JSON.parse(fs.readFileSync(options.path, 'utf8'));
      } else if (options.json) {
        eventInput = JSON.parse(JSON.stringify(options.json));
      }

      this.sqz.cli.log.info(`Retrieving logs for function "${colors.blue.bold(functionName)}"`);
      provider.functions.logs(functionObject, eventInput).then(() => {
        resolve();
      });
    });
  }
}

module.exports = Invoke;
