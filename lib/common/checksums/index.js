'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Class that manages some Squeezer utilities
 */
class Checksums {
  constructor(sqz) {
    this.sqz = sqz;
  }

  check(functionName) {
    return new Promise((resolve) => {
      const paths = this.sqz.vars.functions[functionName].dependencies.files;

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
}

module.exports = Checksums;
