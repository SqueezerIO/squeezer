'use strict';

const _      = require('lodash');
const path   = require('path');
const fs     = require('fs');

/**
 * Loads available functions from the current project
 */
class loadFunctions {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.sqz.vars.functions = {};

      this.load();

      resolve();
    });
  }

  load() {
    const projectPath = this.sqz.vars.project.path;
    const functionOpt = this.sqz.cli.params.get().options.function || null;

    const walkService = (service) => {
      const servicePath = path.join(projectPath, 'services', service);

      fs.readdirSync(servicePath).forEach((functionDir) => {
        const functionPath = path.join(servicePath, functionDir);
        this.sqz.functions.add(functionPath, service);
      });
    };

    const servicesPath = path.join(projectPath, 'services');
    fs.readdirSync(servicesPath).forEach((service) => {
      walkService(service);
    });

    if (functionOpt && !_.has(this.sqz.vars.functions, functionOpt)) {
      this.sqz.cli.log.error(`There is no any function "${functionOpt}" available`);
    }

    if (_.isEmpty(this.sqz.vars.functions)) {
      this.sqz.cli.log.error(
        'This project has no functions to process'
      );
    }
  }
}

module.exports = loadFunctions;
