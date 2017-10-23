'use strict';

const _ = require('lodash');
const request = require('request');
const paperwork = require('precinct').paperwork;
const walkSync = require('walk-sync');
const path = require('path');
const fs = require('fs');

/**
 * Class that manages some Squeezer utilities
 */
class Utilities {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Get an identifier for a specific value
   *
   * @param value
   * @returns {string}
   */
  getIdentifier(value) {
    return _.upperFirst(_.camelCase(value));
  }

  /**
   * Retrieves a Squeezer deployment key
   * @returns {Promise}
   */
  getDeploymentKey() {
    return new Promise((resolve, reject) => {
      const projectPath = this.sqz.vars.project.path;
      const projectName = this.sqz.vars.project.name;
      const apiBaseUrl = this.sqz.vars.apiBaseUrl;
      const postProjectEndpoint = `${apiBaseUrl}/rest/v1/projects`;
      const squeezerConfig = this.sqz.yaml.parse(`${projectPath}/squeezer.yml`);

      this.sqz.cli.log.debug(
        `Retrieve a deployment key for project ${projectName}`
      );

      request.post(
        postProjectEndpoint,
        {
          json: {
            name: projectName,
            type: squeezerConfig.type
          }
        },
        (error, res, body) => {
          if (!error && res.statusCode === 200 && body.message === 'success') {
            resolve(body.data.key);
          } else if (body && body.message) {
            reject(body.message);
          } else if (error) {
            reject(error);
          } else {
            reject('Cannot retrieve a deployment key');
          }
        }
      );
    });
  }

  /**
 * Get dependencies tree for a path
 *
 * @param {*} srcPath - source path
 * @returns {Array}
 */
  getFunctionDeps(functionName) {
    const functionObject = this.sqz.vars.functions[functionName];
    const srcPath = functionObject.path;
    let files = walkSync(srcPath, {
      directories: false
    }).map(val => path.join(srcPath, val));
    this.sqz.vars.functions[functionName].dependencies = {
      packages: {},
      files : []
    };

    // get dependencies
    _.forEach(files, (val) => {
      const fileDeps = this.getFileDeps(val, functionName);
      files = _.union(files, fileDeps);
    });

    this.sqz.vars.functions[functionName].dependencies.files = files;
  }

  /**
   * Get deep file inclusions for a specific file
   *
   * @param file
   * @returns {Array}
   */
  getFileDeps(file, functionName) {
    const allDeps = [];
    allDeps.push(path.resolve(file));

    const checkPaths = (paths) => {
      let retPath = null;
      _.forEach(paths, (checkPath) => {
        const normalizedPath = path.resolve(checkPath);
        if (fs.existsSync(normalizedPath)) {
          retPath = normalizedPath;
        }
      });

      return retPath;
    };

    const check = (checkFile) => {
      const filePath = path.parse(checkFile);
      const paperWork = paperwork(checkFile);
      const deps = paperWork
        .filter(val => val.match(/^[.\\|..\\]/))
        .map((val) => {
          const pathPermutations = [];

          pathPermutations.push(path.join(filePath.dir, val, filePath.ext));

          if (filePath.ext === '.js') {
            pathPermutations.push(path.join(filePath.dir, val, 'index.js'));
          } else if (filePath.ext === '.jsx') {
            pathPermutations.push(path.join(filePath.dir, val, 'index.jsx'));
          }

          return checkPaths(pathPermutations);
        })
        .filter(val => (val !== null));

      this.parsePackages(
        checkFile,
        paperWork,
        functionName
      );

      deps.forEach((dep) => {
        if (!_.includes(allDeps, dep)) {
          allDeps.push(dep);
          check(dep);
        }
      });
    };
    check(file);

    return allDeps;
  }

  parsePackages(file, res, functionName) {
    const fileType = path.extname(file);

    // parsing nodejs packages
    if (fileType === '.js') {
      const pkgs = res.filter(val => !val.match(/^[.\\|..\\]/));

      if (pkgs.length > 0) {
        const packagesFile = path.join(this.sqz.vars.project.path, 'package.json');
        if (fs.existsSync(packagesFile)) {
          const packagesJSON = JSON.parse(fs.readFileSync(packagesFile));
          const packagesData = _.merge(
            packagesJSON.dependencies,
            packagesJSON.devDependencies,
            packagesJSON.peerDependencies,
            packagesJSON.optionalDependencies
          );

          _.forEach(pkgs, (pkg) => {
            if (_.has(packagesData, pkg)) {
              this.sqz.vars.functions[functionName].dependencies.packages[pkg] = packagesData[pkg];
            }
          });
        }
      }
    }
  }
}

module.exports = Utilities;
