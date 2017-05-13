'use strict';

const colors  = require('colors');

/**
 * Class representing project information .
 */
class ProjectInfo {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Project info
   */
  run() {
    return new Promise((resolve) => {
      const microservicesLen = Object.keys(this.sqz.vars.microservices).length;

      this.sqz.cli.log.info(
        `${colors.blue.bold(this.sqz.vars.project.name)} contains ${colors.blue.bold(microservicesLen)} ${microservicesLen === 1 ? 'microservice' : 'microservices'}`
      );

      resolve();
    });
  }
}

module.exports = ProjectInfo;
