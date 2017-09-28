'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const paperwork = require('precinct').paperwork;
const walkSync = require('walk-sync');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Class that manages some Squeezer utilities
 */
class Checksums {
  constructor(sqz) {
    this.sqz = sqz;
    this.ignorePaths = ['*/node_modules/**'];
  }

  check(srcPath) {
    return new Promise((resolve) => {
      // get available paths
      let paths = walkSync(srcPath, {
        directories: false,
        ignore: this.ignorePaths
      }).map(val => path.join(srcPath, val));
      // get files dependencies
      _.forEach(paths, (val) => {
        paths = _.union(paths, this.getFileDeps(val));
      });


      this.md5Files(paths).then((checksum) => {
        resolve(checksum);
      });
    });
  }

  md5Files(files) {
    return new Promise((resolve) => {
      const checksums = [];
      Promise.each(files, (file) => {
        return this.md5File(file).then((checksum) => {
          checksums.push(checksum);
        });
      }).then(() => {
        const finalChecksum = crypto.createHash('md5').update(checksums.join('')).digest('hex');
        resolve(finalChecksum);
      });
    });
  }

  /**
   * Get md5 checksum for a specific file
   * @param {*} filename
   */
  md5File(filename) {
    return new Promise((resolve, reject) => {
      const output = crypto.createHash('md5');
      const input = fs.createReadStream(filename);

      input.on('error', (err) => {
        return reject(err);
      });

      output.once('readable', () => {
        resolve(output.read().toString('hex'));
      });

      input.pipe(output);
    });
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
      const deps = paperwork(checkFile)
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

module.exports = Checksums;
