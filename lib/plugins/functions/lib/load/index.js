'use strict';

const _      = require('lodash');
const path   = require('path');
const fs     = require('fs');

/**
 * Loads available functions from the current project
 */
class loadfunctions {
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

    /* grab functions from a service */
    const walkService = (service) => {
      const servicePath = path.join(projectPath, 'services', service);

      fs.readdirSync(servicePath).forEach((functionName) => {
        const configFilePath = path.join(servicePath, functionName, 'squeezer.yml');
        const functionObject = this.sqz.yaml.parse(configFilePath);

        functionObject.name        = functionName;
        functionObject.handler     = 'handler';
        functionObject.identifier  = this.sqz.utils.getIdentifier(functionObject.name);
        functionObject.service     = service;
        functionObject.path        = path.join(servicePath, functionName);
        functionObject.packagePath = path.join(this.sqz.vars.project.buildPath, 'deploy', 'functions');
        functionObject.packageFile = `${functionObject.identifier}.zip`;
        functionObject.flagged     = true;

        if (functionOpt && functionName !== functionOpt) {
          functionObject.flagged = false;
        }

        if (_.has(this.sqz.vars.functions, functionName)) {
          this.sqz.cli.log.error(`There is a duplicated function with name "${functionName}"`);
        }

        this.sqz.vars.functions[functionObject.name] = functionObject;
      });
    };

    /* list available services */
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

    this.sqz.vars.compiledEnv = this.addEnvVars();
  }

  addEnvVars() {
    const extractVars = (vars) => {
      const variables = {};

      _.forEach(vars, (val, key) => {
        if (typeof (val) === 'object' && key === this.sqz.vars.stage) {
          _.forEach(val, (val2, key2) => {
            variables[key2] = val2;
          });
        } else if (typeof (val) === 'string') {
          variables[key] = val;
        }
      });

      return variables;
    };

    const vars = extractVars(this.sqz.vars.project.env);

    return vars;
  }
}

module.exports = loadfunctions;
