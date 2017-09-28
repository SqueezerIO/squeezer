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
      const functionsLen = Object.keys(this.sqz.vars.functions).length;

      this.sqz.cli.log.info(
        `Project "${colors.blue.bold(this.sqz.vars.project.name)}" contains "${colors.blue.bold(functionsLen)}" ${functionsLen === 1 ? 'function' : 'functions'}`
      );

      resolve();
    });
  }
}

module.exports = ProjectInfo;
