'use strict';

const path      = require('path');
const _         = require('lodash');
const colors    = require('colors');
const Promise   = require('bluebird');
const Assets    = require('./assets');
const fsExtra   = require('fs-extra');
const fs        = require('fs');
const Checksums = require('./checksums');

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

    this.compileType = type;
    this.assets      = new Assets(this.sqz, this.compileType);
    this.options     = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      const checksums = new Checksums(this.sqz, this.compileType);
      this.assets.compileMainAssets().then(() => {
        this.compileMicroservices().then(() => {
          if (this.compileType === 'cloud') {
            checksums.run().then(() => {
              this.assets.cacheBuster();
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  }

  compileMicroservices() {
    return new Promise((resolve) => {
      const microservices = this.sqz.vars.microservices;

      Promise.each(Object.keys(microservices), (key) => {
        this.addInclusions(microservices[key]);
        if (microservices[key].enabled) {
          return this.compileMicroservice(microservices[key]);
        }
      }).then(() => {
        resolve();
      });
    });
  }

  compileMicroservice(microservice) {
    return new Promise((resolve) => {
      const projectPath = path.normalize(this.sqz.vars.project.path);
      const source      = `${microservice.path}/src`;
      const output      = `${projectPath}/.build/${this.compileType}/microservices/${microservice.identifier}`;

      let compileCmds = [];

      const options = {
        project      : this.sqz.vars.project,
        microservice : microservice,
        source       : source,
        output       : output
      };

      // clean build directory
      fsExtra.removeSync(output);

      compileCmds = _.concat(
        compileCmds,
        this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/microservice.yml`, options)
      );

      if (!_.isEmpty(compileCmds)) {
        this.sqz.cli.log.info(`Compiling microservice ${colors.blue.bold(microservice.name)}`);
      }

      Promise.each(Object.keys(compileCmds), (key) => {
        const command = compileCmds[key];

        return this.sqz.command.run(command.description, command.bin, command.args || []);
      }).then(() => {
        // packaging mentioned assets
        if (microservice.packaging) {
          this.sqz.cli.log.debug(`Adding packages to microservice ${colors.blue.bold(microservice.name)}`);
          if (this.compileType === 'cloud') {
            fsExtra.removeSync(`${output}/inclusions`);
            fsExtra.removeSync(`${output}/web/assets`);
          }

          _.forEach(microservice.packaging, (pkg) => {
            const src  = `${microservice.path}/src/${pkg}`;
            const dest = `${projectPath}/.build/${this.compileType}/microservices/${microservice.identifier}/${pkg}`;
            if (!fs.existsSync(src)) {
              this.sqz.cli.log.error(`${colors.blue(pkg)} path selected for packaging can't be found at ${colors.blue(src)}`);
            }

            if (!fs.existsSync(dest)) {
              if (this.compileType === 'cloud') {
                fsExtra.copySync(src, dest);
              } else {
                fsExtra.ensureSymlinkSync(src, dest);
              }
            }
          });
        }

        // compiles web assets
        this.assets.compileAssets(microservice).then(() => {
          resolve();
        });
      });
    });
  }

  /**
   * add inclusions to the .build src/ directory
   *
   * @param microservice
   */
  addInclusions(microservice) {
    this.sqz.cli.log.debug(
      `Adding file inclusions for the microservice ${colors.blue.bold(microservice.name)} !`
    );
    // fsExtra.emptyDirSync(`${microservice.path}/src/inclusions`);
    _.forEach(microservice.inclusions, (inclusion) => {
      fsExtra.ensureSymlinkSync(
        `${this.sqz.vars.project.path}/${inclusion.src}`
        , `${microservice.path}/src/inclusions/${inclusion.dest}`
      );
    });
  }
}

module.exports = Compile;
