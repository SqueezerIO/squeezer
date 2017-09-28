'use strict';

const _       = require('lodash');
const Promise = require('bluebird');
const colors  = require('colors');

/**
 * Run class libs
 */
class RunLib {
  constructor(sqz) {
    this.sqz = sqz;
  }

  loadEnvVars() {
    return new Promise((resolve) => {
      _.forEach(this.sqz.vars.compiledEnv, (val, key) => {
        process.env[key] = val;
      });
      resolve();
    });
  }

  findFunction(name) {
    const functions = this.sqz.vars.functions;
    let data = null;

    _.forEach(functions, (functionObject) => {
      if (functionObject.name === name) {
        data = {
          func : functions[name]
        };
      }
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
