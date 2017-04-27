'use strict';

const fs     = require('fs-extra');

class removeCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const options = this.sqz.cli.params.get().options;

      fs.removeSync(options.path);

      resolve();
    });
  }
}

module.exports = removeCMD;
