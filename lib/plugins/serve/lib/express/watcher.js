'use strict';

const path      = require('path');
const _         = require('lodash');
const paperwork = require('precinct').paperwork;
const chokidar  = require('chokidar');
const Promise   = require('bluebird');
const fs        = require('fs');
const walkSync  = require('walk-sync');

/**
 * Class that serves a Squeezer project
 */
class Watcher {
  constructor(sqz) {
    this.sqz          = sqz;
    this.projectType  = this.sqz.vars.project.type;
    const projectPath = this.sqz.vars.project.path;
    this.globs        = this.sqz.yaml.parse(`${projectPath}/watcher.yml`, { projectPath : projectPath }).globs;
  }

  /**
   * initialize the file watcher
   */
  init() {
    const globs      = _.union(this.globs.include, this.globs.ignore.map(val => `!${val}`));
    const watcher    = chokidar.watch(globs, { persistent : true });
    let watcherReady = false;

    watcher
      .on('error', error => this.sqz.cli.log.error(error))
      .on('ready', () => (watcherReady = true))
      .on('all', (event, src) => {
        // console.log(event, src);
        // if (watcherReady && _.includes(['add', 'change'], event)) {
        if (watcherReady) {
          this.compile(src);
        }
      });
  }

  compile(src) {
    const tree = this.buildCompileTree();
    _.forEach(tree, (obj) => {
      if (obj.srcPath === src) {
        const compileCmds = this.sqz.yaml.parse(obj.compilePath, obj.options);
        Promise.each(Object.keys(compileCmds), (key) => {
          const command = compileCmds[key];
          return this.sqz.command.run(command.description, command.bin, command.args || [], true);
        });
      }
    });
  }

  buildCompileTree() {
    const tree        = [];
    const projectPath = this.sqz.vars.project.path;

    const addPath = (srcPath, compilePath, options) => {
      let pathExists = false;
      _.forEach(tree, (obj) => {
        if (obj.srcPath === srcPath) pathExists = true;
      });
      if (!pathExists) {
        tree.push({
          srcPath     : srcPath,
          compilePath : compilePath,
          options     : options
        });
      }
    };

    let srcPaths;
    let options;

    // add main assets
    if (this.projectType === 'web') {
      options = {
        projectPath       : path.normalize(projectPath),
        webpackBin        : `${projectPath}/node_modules/.bin/webpack`,
        webpackConfigPath : `${projectPath}/lib/webpack`,
        source            : path.normalize(`${projectPath}/web/assets`),
        target            : path.normalize(`${projectPath}/.build/development/assets/main`),
        staticSource      : `${projectPath}/web/assets/static`,
        staticTarget      : `${projectPath}/.build/development/assets/main/static`
      };

      srcPaths = _.union(
        this.getFileDeps(`${projectPath}/web/assets/js/main.js`),
        walkSync(`${projectPath}/web/assets/js`, { directories : false })
          .map(val => `${projectPath}/web/assets/js/${val}`)
      );
      _.forEach(srcPaths, (src) => {
        addPath(src, `${projectPath}/lib/hooks/commands/compile/development/main.js.assets.yml`, options);
      });


      srcPaths = _.union(
        this.getFileDeps(`${projectPath}/web/assets/sass/main.scss`),
        walkSync(`${projectPath}/web/assets/sass`, { directories : false })
          .map(val => `${projectPath}/web/assets/sass/${val}`)
      );
      _.forEach(srcPaths, (src) => {
        addPath(src, `${projectPath}/lib/hooks/commands/compile/development/sass.assets.yml`, options);
      });

      srcPaths = walkSync(`${projectPath}/web/assets/static`, { directories : false });
      _.forEach(srcPaths, (src) => {
        addPath(`${projectPath}/web/assets/static/${src}`, `${projectPath}/lib/hooks/commands/compile/development/static.assets.yml`, options);
      });
    }

    // add microservices sources and assets
    const microservices = this.sqz.vars.microservices;
    _.forEach(microservices, (microservice) => {
      options = {
        projectPath       : path.normalize(projectPath),
        webpackBin        : `${projectPath}/node_modules/.bin/webpack`,
        webpackConfigPath : `${projectPath}/lib/webpack`,
        source            : path.normalize(`${microservice.path}/src/web/assets`),
        target            : `${projectPath}/.build/development/assets/microservices/${microservice.identifier}`,
        staticSource      : `${microservice.path}/src/web/assets/static`,
        staticTarget      : `${projectPath}/.build/development/assets/microservices/${microservice.identifier}/static`
      };

      // add assets
      if (this.projectType === 'web') {
        srcPaths = _.union(
          this.getFileDeps(`${microservice.path}/src/web/assets/js/main.js`),
          walkSync(`${microservice.path}/src/web/assets/js`, { directories : false })
            .map(val => `${microservice.path}/src/web/assets/js/${val}`)
        );
        _.forEach(srcPaths, (src) => {
          addPath(src, `${projectPath}/lib/hooks/commands/compile/development/js.assets.yml`, options);
        });

        srcPaths = _.union(
          this.getFileDeps(`${microservice.path}/src/web/assets/sass/main.scss`),
          walkSync(`${microservice.path}/src/web/assets/sass`, { directories : false })
            .map(val => `${microservice.path}/src/web/assets/${val}`)
        );
        _.forEach(srcPaths, (src) => {
          addPath(src, `${projectPath}/lib/hooks/commands/compile/development/sass.assets.yml`, options);
        });

        srcPaths = walkSync(`${microservice.path}/src/web/assets/static`, { directories : false });
        _.forEach(srcPaths, (src) => {
          addPath(`${microservice.path}/src/web/assets/static/${src}`, `${projectPath}/lib/hooks/commands/compile/development/static.assets.yml`, options);
        });
      }

      // add microservice's sources
      options = {
        project      : this.sqz.vars.project,
        microservice : microservice,
        source       : `${microservice.path}/src`,
        output       : `${projectPath}/.build/development/microservices/${microservice.identifier}`
      };

      srcPaths = walkSync(`${microservice.path}/src`, {
        globs       : ['**/*'],
        ignore      : _.concat(this.globs.ignore, '**/web/assets/*'),
        directories : false
      }).map(val => `${microservice.path}/src/${val}`);
      _.forEach(srcPaths, (src) => {
        addPath(src, `${projectPath}/lib/hooks/commands/compile/development/microservice.yml`, options);
      });
    });

    return tree;
  }

  /**
   * Get deep file inclusions for a specific file
   *
   * @param file
   * @returns {Array}
   */
  getFileDeps(file) {
    const allDeps = [];
    allDeps.push(path.resolve(file));

    const check = (checkFile) => {
      const filePath = path.parse(checkFile);
      const deps     = paperwork(checkFile)
        .filter(val => val.match(/^[.\\|..\\]/))
        .map(val => path.resolve(`${filePath.dir}`, `${val}${filePath.ext}`));

      deps.forEach((dep) => {
        if (!_.includes(allDeps, dep) && fs.existsSync(dep)) {
          allDeps.push(dep);
          check(dep);
        }
      });
    };
    check(file);

    return allDeps;
  }
}

module.exports = Watcher;
