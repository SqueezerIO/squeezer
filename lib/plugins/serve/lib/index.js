'use strict';

const Promise  = require('bluebird');
const Express = require('./express');

/**
 * Class that serves a Squeezer project
 */
class Serve {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Serve the current project
   */
  run() {
    return new Promise((resolve) => {
      const express = new Express(this.sqz);
      express.run().then(() => {
        resolve();
      });
    });
  }
}

module.exports = Serve;
