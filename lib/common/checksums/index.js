'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const dirsum   = require('./dirsum');

/**
 * Class that manages some Squeezer utilities
 */
class Checksums {
  constructor(sqz) {
    this.sqz = sqz;
  }

  check(path, ignore) {
    return new Promise((resolve, reject) => {
      dirsum(
        path,
        (err, checksum) => {
          if (err) reject(err);
          resolve(checksum);
        },
        (readPath) => {
          if (_.includes(ignore, readPath)
            || !_.isEmpty(_.filter(ignore, val => readPath.match(new RegExp(`^${val}`))))) {
            return true;
          }
          return false;
        });
    });
  }
}

module.exports = Checksums;
