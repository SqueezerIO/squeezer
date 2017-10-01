'use strict';

const path = require('path');
const _ = require('lodash');
const colors = require('colors');
const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const fs = require('fs');
const Checksums = require('./checksums');
const Packages = require('./packages');

/**
 * Class representing functions compiling
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

    const projectPath = this.sqz.vars.project.path;
    this.checksumsFilePath = `${projectPath}/.build/${this.compileType}/checksums.json`;

    this.options = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      const checksums = new Checksums(this.sqz, this.compileType);
      checksums.run().then(() => {
        this.compileFunctions().then(() => {
          this.writeChecksumsFile();
          resolve();
        });
      });
    });
  }

  compileFunctions() {
    return new Promise((resolve) => {
      const functions = this.sqz.vars.functions;
      const options = this.sqz.cli.params.get().options;

      Promise.each(Object.keys(functions), (key) => {
        const functionObject = functions[key];
        const functionIdentifier = functionObject.identifier;
        let force = false;

        if (_.has(options, 'force') && !_.has(options, 'function')) {
          force = true;
        } else if (_.has(options, 'force')
          && _.has(options, 'function') && options.function === functionObject.name) {
          force = true;
        }

        if ((functions[key].flagged &&
          (this.sqz.vars.previousChecksums.functions[functionIdentifier] !==
            this.sqz.vars.currentChecksums.functions[functionIdentifier])) || force) {
          return this.compileFunction(functions[key]);
        }
      }).then(() => {
        resolve();
      });
    });
  }

  compileFunction(functionObject) {
    const packages = new Packages(this.sqz, this.compileType);

    return new Promise((resolve) => {
      const projectPath = path.normalize(this.sqz.vars.project.path);
      const source = `${functionObject.path}/src`;
      const output = `${projectPath}/.build/${this.compileType}/functions/${functionObject.identifier}`;

      let compileCmds = [];

      const options = {
        project: this.sqz.vars.project,
        func: functionObject,
        source: source,
        output: output
      };

      compileCmds = _.concat(
        compileCmds,
        this.sqz.yaml.parse(`${projectPath}/lib/hooks/commands/compile/${this.compileType}/function.yml`, options)
      );

      compileCmds = _.concat(compileCmds, packages.add(options));

      if (!_.isEmpty(compileCmds)) {
        this.sqz.cli.log.info(`Compiling function "${colors.white(functionObject.name)}"`);
      }

      Promise.each(Object.keys(compileCmds), (key) => {
        const command = compileCmds[key];

        return this.sqz.command.run(command.description, command.bin, command.args || []);
      }).then(() => {
        // packaging mentioned assets
        if (functionObject.packaging) {
          this.sqz.cli.log.debug(`Adding packages to function ${colors.blue.bold(functionObject.name)}`);
          _.forEach(functionObject.packaging, (pkg) => {
            const src = `${functionObject.path}/src/${pkg}`;
            const dest = `${projectPath}/.build/${this.compileType}/functions/${functionObject.identifier}/${pkg}`;

            if (fs.existsSync(src) && !fs.existsSync(dest)) {
              if (this.compileType === 'cloud') {
                fsExtra.copySync(src, dest);
              } else {
                fsExtra.ensureSymlinkSync(src, dest);
              }
            }
          });
        }

        resolve();
      });
    });
  }

  writeChecksumsFile() {
    const jsonData = JSON.stringify(this.sqz.vars.currentChecksums, null, 2);
    fs.writeFileSync(this.checksumsFilePath, jsonData, 'utf8');
  }
}

module.exports = Compile;
