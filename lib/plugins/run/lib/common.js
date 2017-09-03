'use strict';

const _       = require('lodash');
const Promise = require('bluebird');
const colors  = require('colors');
const fs      = require('fs');

/**
 * Run class libs
 */
class RunLib {
  constructor(sqz) {
    this.sqz = sqz;
  }

  loadEnvVars() {
    return new Promise((resolve) => {
      const envFile = `${this.sqz.vars.project.buildPath}/env.json`;
      if (!fs.existsSync(envFile)) {
        this.sqz.cli.log.error(`Please compile the project: ${colors.blue('sqz compile')}`);
      }
      const envData = JSON.parse(fs.readFileSync(envFile));
      _.forEach(envData, (val, key) => {
        process.env[key] = val;
      });
      resolve();
    });
  }

  findFunction(name) {
    let data = null;

    _.forEach(this.sqz.vars.microservices, (microservice) => {
      _.forEach(microservice.functions, (funcVal, funcName) => {
        if (funcName === name) {
          data = {};
          _.assign(data, {
            microservice : microservice,
            func         : funcVal
          });
        }
      });
    });

    if (!data) {
      this.sqz.cli.log.error(
        `There is no any function with the name ${colors.blue.bold(name)} available`
      );
    }

    return data;
  }
}

module.exports = RunLib;
