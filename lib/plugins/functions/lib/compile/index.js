'use strict';

const Promise      = require('bluebird');
const Compile = require('./lib');

/**
 * Class representing compiling initializing
 */
class Run {
  constructor(sqz) {
    this.sqz     = sqz;
  }

  compile(type) {
    return new Promise((resolve) => {
      const compile = new Compile(this.sqz, type);
      compile.run().then(() => {
        resolve();
      });
    });
  }
}

module.exports = Run;
