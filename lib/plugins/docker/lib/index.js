'use strict';

const Promise     = require('bluebird');
const _           = require('lodash');
const DocketUtils = require('./utils');

class Docker {
  constructor(sqz) {
    this.sqz   = sqz;
    this.utils = new DocketUtils(this.sqz);
  }

  init() {
    return new Promise((resolve) => {
      this.sqz.cli.log.info('Initializing Docker');
      this.sqz.cli.loader.start();
      this.sqz.command.localRun('docker', ['images']).then((res) => {
        this.pullImage(res).then(() => {
          this.runContainer().then(() => {
            this.sqz.cli.loader.stop();
            resolve();
          });
        });
      }).catch(() => {
        this.sqz.cli.log.error('Docker is not installed or is not running properly');
      });
    });
  }

  pullImage(output) {
    return new Promise((resolve) => {
      const imagesOutput = this.utils.parseOutput(output);
      const repo         = this.sqz.vars.docker.repository;
      const image        = _.find(imagesOutput, { REPOSITORY : repo });

      if (image) {
        resolve();
      } else {
        this.sqz.command.localRun('docker', ['pull', repo]).then(() => {
          resolve();
        });
      }
    });
  }

  runContainer() {
    return new Promise((resolve) => {
      this.sqz.command.localRun('docker', ['ps', '-a']).then((res) => {
        const containersOutput  = this.utils.parseOutput(res);
        const repo              = this.sqz.vars.docker.repository;
        const projectLocalPath  = this.sqz.vars.project.localPath;
        const projectDockerPath = this.sqz.vars.project.dockerPath;
        const container         = this.sqz.vars.docker.container;
        const containerData     = _.find(containersOutput, { NAMES : container });

        const runArgs = ['run', '--volume-driver=nfs', '-it', '-d', '-v', `${projectLocalPath}:${projectDockerPath}`, '--name', container, repo];

        if (!containerData) {
          this.sqz.command.localRun('docker', runArgs).then(() => {
            resolve();
          });
        } else if (containerData && !containerData.STATUS.match(/^Up /i)) {
          this.sqz.command.localRun('docker', ['start', container]).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }
}
module.exports = Docker;
