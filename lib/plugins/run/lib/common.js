'use strict';

const _       = require('lodash');
const colors  = require('colors');

/**
 * Class that assists command running
 */
class RunCommonLib {
  constructor(sqz) {
    this.sqz = sqz;
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

module.exports = RunCommonLib;
