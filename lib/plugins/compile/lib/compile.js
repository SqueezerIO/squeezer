'use strict';

const _       = require('lodash');
const Promise = require('bluebird');
const CompileMicroservices = require('../../microservices/lib/compile');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(sqz) {
    this.sqz = sqz;
    this.options           = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      const compileMicroservices = new CompileMicroservices(this.sqz);
      let compileType = 'development' || this.options.production;
      if (_.has(this.options, 'production')) {
        compileType = 'production';
      }

      compileMicroservices.compile(compileType).then(() => {
        this.sqz.cli.log.info('Compiled !');
        resolve();
      });
    });
  }
}

module.exports = Deploy;
