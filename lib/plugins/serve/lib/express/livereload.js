'use strict';

const livereload        = require('livereload');
const livereloadConnect = require('connect-livereload');
const path              = require('path');

/**
 * Class that serves a Squeezer project
 */
class Livereload {
  constructor(sqz) {
    this.sqz = sqz;
  }

  init(app) {
    const projectPath = this.sqz.vars.project.path;
    const conf        = this.sqz.yaml.parse(`${projectPath}/livereload.yml`, { projectPath : projectPath });
    const serverConf  = conf.server;
    const watchConf   = conf.watch.map(val => path.normalize(val));

    const server = livereload.createServer(serverConf);
    server.watch(watchConf);
    app.use(livereloadConnect({
      port   : 35729
    }));
  }
}

module.exports = Livereload;
