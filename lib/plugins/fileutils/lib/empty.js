'use strict';

const fs     = require('fs-extra');

class emptyDirSyncCMD {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise((resolve) => {
      const options = this.sqz.cli.params.get().options;

      fs.emptyDirSync(options.dir);

      resolve();
    });
  }
}

module.exports = emptyDirSyncCMD;
