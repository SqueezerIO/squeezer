'use strict';

const path    = require('path');
const _       = require('lodash');
const Promise = require('bluebird');
const fs      = require('fs');
const colors  = require('colors');
/**
 * Class representing microservices compiling for local execution
 */
class Compile {
  /**
   * Constructor
   *
   * @param sqz main object
   * @param type - compiling type - can be "run" or "deploy"
   */
  constructor(sqz, type) {
    this.sqz = sqz;

    this.compileType       = type;
    this.options           = this.sqz.cli.params.get().options;
    this.bustFiles         = [];
    this.currentChecksums  = this.sqz.vars.currentChecksums;
    this.previousChecksums = this.sqz.vars.previousChecksums;
    this.projectType       = this.sqz.vars.project.type;
  }

  /**
   * Compile the main app assets
   * @returns {*}
   */
  compileMainAssets() {
    return new Promise((resolve) => {
      if (this.projectType === 'web') {
        const projectPath = path.normalize(this.sqz.vars.project.path);

        let compileCmds = [];

        const options = {
          projectPath       : path.normalize(projectPath),
          webpackBin        : `${projectPath}/node_modules/.bin/webpack`,
          webpackConfigPath : `${projectPath}/lib/webpack`,
          source            : path.normalize(`${projectPath}/web/assets`),
          target            : path.normalize(`${projectPath}/.build/${this.compileType}/assets/main`),
          staticSource      : `${projectPath}/web/assets/static`,
          staticTarget      : `${projectPath}/.build/${this.compileType}/assets/main/static`
        };

        if (this.compileType === 'cloud') {
          this.bustFiles = _.union(this.bustFiles, [
            `${options.target}/css/main.css`,
            `${options.target}/js/main.js`
          ]);
        }

        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/main.js.assets.yml`, options)
        );

        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/sass.assets.yml`, options)
        );
        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/static.assets.yml`, options)
        );

        this.sqz.command.bulk(compileCmds).then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Compile assets for a specific microservice
   * @param microservice
   * @returns {*}
   */
  compileAssets(microservice) {
    return new Promise((resolve) => {
      if (this.projectType === 'web') {
        const projectPath = path.normalize(this.sqz.vars.project.path);

        let compileCmds = [];

        const options = {
          projectPath  : projectPath,
          webpackBin   : `${projectPath}/node_modules/.bin/webpack`,
          source       : path.normalize(`${microservice.path}/src/web/assets`),
          target       : `${projectPath}/.build/${this.compileType}/assets/microservices/${microservice.identifier}`,
          staticSource : `${microservice.path}/src/web/assets/static`,
          staticTarget : `${projectPath}/.build/${this.compileType}/assets/microservices/${microservice.identifier}/static`
        };

        this.bustFiles = _.union(this.bustFiles, [
          `${options.target}/css/main.css`,
          `${options.target}/js/main.js`
        ]);

        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/js.assets.yml`, options)
        );

        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/sass.assets.yml`, options)
        );
        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/static.assets.yml`, options)
        );
        this.sqz.command.bulk(compileCmds).then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Add CSS checksums for the static assets to refresh cache when file changes
   * @param cssFile
   * @param currentChecksums
   */
  cacheBuster() {
    if (this.sqz.vars.project.type === 'web') {
      this.sqz.cli.log.info('Cache busting assets');
      const bust = (file) => {
        const checksums = this.sqz.vars.currentChecksums.assets;
        this.sqz.cli.log.debug(`Cache busting URLs on ${colors.blue.bold(file)}`);
        let fileData = fs.readFileSync(file, 'utf8');
        _.forEach(checksums, (checksum, assetPath) => {
          // const checksum        = checksums[assetPath];
          const cleanAssetPath  = assetPath.replace(/^main\//, '').replace(/^microservices\/.*?\/(.*?)$/, '$1');
          const parsedAssetPath = path.parse(cleanAssetPath);
          const finalAssetPath  = `${parsedAssetPath.dir}/${parsedAssetPath.name}-${checksum}${parsedAssetPath.ext}`;
          fileData              = fileData.replace(cleanAssetPath, finalAssetPath);
        });
        fs.writeFileSync(file, fileData);
      };

      _.forEach(this.bustFiles, (file) => {
        bust(file);
      });
    }
  }

  /**
   * Return both previous and current checksums for a current path
   * @param checksumPath
   * @param previous
   * @param current
   * @returns {{previous: *, current: *}}
   */
  getPathChecksum(checksumPath, previous, current) {
    let previousChecksum = null;
    let currentChecksum  = null;

    if (previous && _.has(previous.paths, checksumPath)) {
      previousChecksum = previous.paths[checksumPath];
    }

    if (current && _.has(current.paths, checksumPath)) {
      currentChecksum = current.paths[checksumPath];
    }

    return {
      previous : previousChecksum,
      current  : currentChecksum
    };
  }
}

module.exports = Compile;
