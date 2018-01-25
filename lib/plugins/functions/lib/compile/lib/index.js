'use strict';

const path = require('path');
const _ = require('lodash');
const colors = require('colors');
const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const fs = require('fs');

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
  constructor(sqz, type, stage) {
    this.sqz = sqz;
    this.stage = stage;
    this.compileType = type;

    const projectPath = this.sqz.vars.project.path;

    this.checksumsFilePath = path.join(projectPath, '.build', this.compileType, 'checksums.json');

    this.options = this.sqz.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      this.sqz.checksums.compile(this.compileType, this.stage).then((checksumData) => {
        this.compileFunctions().then(() => {
          if (this.compileType === 'development') {
            this.sqz.checksums.data.save(this.compileType, checksumData).then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  }

  compileFunctions() {
    return new Promise((resolve) => {
      const functions = this.sqz.vars.functions;

      Promise.each(Object.keys(functions), (key) => {
        if ((functions[key].flagged && functions[key].changed) ||
          (functions[key].flagged && functions[key].force)) {
          return this.compileFunction(functions[key]);
        }
      }).then(() => {
        resolve();
      });
    });
  }

  compileFunction(functionObject) {
    return new Promise((resolve) => {
      const projectPath = path.normalize(this.sqz.vars.project.path);
      const projectRuntime = this.sqz.vars.project.runtime;
      const source = path.join(functionObject.path, 'src');
      const output = path.join(projectPath, '.build', this.compileType, 'functions', functionObject.identifier);

      fsExtra.ensureDirSync(output);

      let compileCmds = [];

      const options = {
        project: this.sqz.vars.project,
        func: functionObject,
        source: source,
        output: output
      };

      const functionHook = path.join(projectPath, 'lib', 'hooks', 'commands', 'compile', this.compileType, 'function.yml');

      compileCmds = _.concat(
        compileCmds,
        this.sqz.yaml.parse(functionHook, options)
      );

      if (this.compileType === 'cloud') {
        const treeData = JSON.parse(fs.readFileSync(path.join(projectPath, '.build', 'tree.json')));

        if (projectRuntime === 'nodejs') {
          const packagesData = {
            license : 'UNLICENSED',
            dependencies : {}
          };

          _.forEach(treeData.functions[functionObject.name].packages, (obj) => {
            packagesData.dependencies[obj.pkg] = obj.version;
          });

          fs.writeFileSync(path.join(output, 'package.json'), JSON.stringify(packagesData, null, 2));
        }

        const functionPackagesHook = path.join(projectPath, 'lib', 'hooks', 'commands', 'compile', this.compileType, 'package.yml');

        compileCmds = _.concat(
          compileCmds,
          this.sqz.yaml.parse(functionPackagesHook, options)
        );
      }

      if (!_.isEmpty(compileCmds)) {
        this.sqz.cli.log.info(`Compiling function "${colors.blue.bold(functionObject.name)}"`);
      }

      Promise.each(Object.keys(compileCmds), (key) => {
        const command = compileCmds[key];

        return this.sqz.command.run(command.description, command.bin, command.args || []);
      }).then(() => {
        // packaging mentioned assets
        if (functionObject.packaging) {
          this.sqz.cli.log.debug(`Adding packages to function ${colors.blue.bold(functionObject.name)}`);
          _.forEach(functionObject.packaging, (pkg) => {
            const src = path.join(functionObject.path, 'src', pkg);
            const dest = path.join(output, pkg);

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
}

module.exports = Compile;
