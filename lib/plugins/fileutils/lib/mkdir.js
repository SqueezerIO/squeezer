'use strict';

const fs     = require('fs-extra');

class mkdirCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const options = this.sqz.cli.params.get().options;

      fs.ensureDir(options.dir);

      resolve();
    });
  }
}

module.exports = mkdirCMD;
