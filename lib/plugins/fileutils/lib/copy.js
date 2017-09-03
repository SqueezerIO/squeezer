'use strict';

const fs = require('fs-extra');
const _  = require('lodash');

class CopyCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const options = this.sqz.cli.params.get().options;

      if (options.exclude) {
        const excludes = options.exclude.split(',').map(val => `${options.src}/${val}`);

        options.filter = (src) => {
          let ret = true;

          _.forEach(excludes, (exclude) => {
            if (src.indexOf(exclude) > -1) {
              ret = false;
            }
          });

          return ret;
        };
      }
      options.preserveTimestamps = true;
      fs.copySync(options.src, options.dest, options);

      resolve();
    });
  }
}

module.exports = CopyCMD;
