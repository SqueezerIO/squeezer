'use strict';

const fs     = require('fs-extra');

class MoveCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve, reject) => {
      const options = this.sqz.cli.params.get().options;

      fs.move(options.source, options.target, (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  }
}

module.exports = MoveCMD;
