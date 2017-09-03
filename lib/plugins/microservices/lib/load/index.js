'use strict';

const colors   = require('colors');
const _        = require('lodash');
const walkSync = require('walk-sync');

/**
 * Loads available microservices from the current project
 */
class loadMicroservices {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      this.load();
      this.validate();

      resolve();
    });
  }

  load() {
    const projectPath        = this.sqz.vars.project.path;
    const microservicesPaths = walkSync(`${projectPath}/microservices`, { globs : ['*/sqz.config.yml'] });

    _.forEach(microservicesPaths, (microservicePath) => {
      const microservice = this.sqz.yaml.parse(`${projectPath}/microservices/${microservicePath}`);

      microservice.identifier = this.sqz.utils.getIdentifier(microservice.name);

      /* add paths */
      microservice.path = `${this.sqz.vars.project.path}/microservices/${microservice.name}`;

      /* add env vars */
      this.sqz.vars.envCompiled = this.addEnvVars(microservice);

      /* validate microservice */
      const dir = microservicePath.split('/').slice(0, -1).join('/');

      if (dir !== microservice.name) {
        this.sqz.cli.log.error(`Microservice ${colors.blue.bold(microservice.name)} : ` +
          'Missing or invalid directory .\n' +
          'Directory name should be the same ' +
          'as the microservice name .');
      }

      this.sqz.vars.microservices[microservice.name] = microservice;
    });

    const microservicesLen = Object.keys(this.sqz.vars.microservices).length;

    if (microservicesLen === 0) {
      this.sqz.cli.log.error(
        'This project has no microservices to process'
      );
    }
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

  validate() {
    const microserviceNames = [];
    const functionNames     = [];
    const microserviceOpt   = this.sqz.cli.params.get().options.microservice || null;
    const functionOpt       = this.sqz.cli.params.get().options.function || null;

    if (microserviceOpt && !_.has(this.sqz.vars.microservices, microserviceOpt)) {
      this.sqz.cli.log.error(
        `There is no such ${colors.blue.bold(microserviceOpt)} microservice available!`
      );
    }

    const microservices = this.sqz.vars.microservices;

    _.forEach((microservices), (microservice) => {
      microservice.enabled = true;

      if (microserviceOpt && microserviceOpt !== microservice.name) {
        microservice.enabled = false;
      }

      if (_.includes(microserviceNames, microservice.name)) {
        this.sqz.cli.log.error(
          `Duplicate microservices names : ${colors.blue.bold(microservice.name)}`
        );
      } else {
        microserviceNames.push(microservice.name);
      }

      if (functionOpt) {
        microservice.enabled = false;
      }

      _.forEach(microservice.functions, (funcObj, functionName) => {
        if (functionOpt && functionOpt === functionName) {
          microservice.enabled = true;
        }

        if (_.includes(functionNames, functionName)) {
          this.sqz.cli.log.error(
            `Duplicate function names : ${colors.blue.bold(functionName)}`
          );
        } else {
          functionNames.push(functionName);
        }

        microservice.functions[functionName].identifier   =
          this.sqz.utils.getIdentifier(functionName);
        microservice.functions[functionName].name         = functionName;
        microservice.functions[functionName].microservice = microservice.name;
        microservice.package                              = `${this.sqz.vars.project.buildPath}/deploy/microservices/${microservice.identifier}.zip`

        this.sqz.vars.functions[functionName] = microservice.functions[functionName];

        const counters = {};
        _.forEach(funcObj.events, (val) => {
          const type  = Object.keys(val)[0];
          const event = val[type];

          if (!_.has(counters, type)) {
            counters[type] = 0;
          }

          counters[type] += 1;

          if (event.counter) {
            event.counter = counters[type];
          }
        });
      });

      this.sqz.vars.microservices[microservice.name] = microservice;
    });
  }
}

module.exports = loadMicroservices;
