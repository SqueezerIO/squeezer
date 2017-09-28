'use strict';

const Promise = require('bluebird');
const path    = require('path');
const fs      = require('fs');

class InitPlugin {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    const configPath = path.join(this.sqz.vars.project.path, 'squeezer.yml');
    return new Promise((resolve) => {
      let projectData = fs.readFileSync(configPath, 'utf8');
      this.sqz.cli.log.info('Adding a new deployment key to your project');

      this.sqz.utils.getDeploymentKey().then((key) => {
        projectData = projectData.replace(/key:.*/, `key: ${key}`);
        fs.writeFileSync(configPath, projectData);
        this.sqz.cli.log.info('Done !');
        resolve();
      });
    });
  }
}

module.exports = InitPlugin;
