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
    const options = this.sqz.cli.params.get().options;
    const stage = options.stage;
    const functionName = options.function;
    const provider = new Provider({
      stage: stage,
      name: this.sqz.vars.project.name,
      path: this.sqz.vars.project.path,
      identifier: this.sqz.vars.project.identifier,
      config: this.sqz.config.data
    }).init();
    const functionObject = this.sqz.vars.functions[functionName];
    let eventInputData = {};

    return new Promise((resolve) => {
      if (options.path) {
        eventInputData = JSON.parse(fs.readFileSync(options.path, 'utf8'));
      } else if (options.json) {
        eventInputData = JSON.parse(JSON.stringify(options.json));
      }

      this.sqz.cli.log.info(`Invoke function "${colors.blue.bold(functionName)}"`);
      provider.functions.invoke(functionObject, eventInputData).then(() => {
        resolve();
      });
    });
  }
}

module.exports = Invoke;
