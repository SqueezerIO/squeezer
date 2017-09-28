'use strict';

/**
 * Class representing project orchestration .
 */
class Project {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Validate the project
   */
  run() {
    return new Promise((resolve) => {
      this.sqz.cli.log.debug('Checking if the current directory it\'s a valid Squeezer project');

      if (!this.sqz.vars.project.isValid) {
        this.sqz.cli.log.error('This is not a valid Squeezer project directory');
      }

      // this.sqz.validate.platform();

      resolve();
    });
  }
}

module.exports = Project;
