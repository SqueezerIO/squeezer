'use strict';

const _                = require('lodash');
const Promise          = require('bluebird');
const CompileFunctions = require('../../functions/lib/compile');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(sqz) {
    this.sqz     = sqz;
    this.options = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      const compileFunctions = new CompileFunctions(this.sqz);
      let compileType        = 'development' || this.options.cloud;
      if (_.has(this.options, 'cloud')) {
        compileType = 'cloud';
      }

      compileFunctions.compile(compileType).then(() => {
        this.sqz.cli.log.info('Compiled !');
        resolve();
      });
    });
  }
}

module.exports = Deploy;
