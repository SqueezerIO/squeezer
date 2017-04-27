'use strict';

const fs      = require('fs');
const fsExtra = require('fs-extra');

class CopyCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const options = this.sqz.cli.params.get().options;

      if (!fs.existsSync(options.target)) {
        fsExtra.ensureSymlinkSync(options.source, options.target);
      }

      resolve();
    });
  }
}

module.exports = CopyCMD;
