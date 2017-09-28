'use strict';

const fs      = require('fs');

/**
 * List templates
 */
class ListTemplates {
  constructor(sqz) {
    this.sqz = sqz;
  }

  run() {
    return new Promise(() => {
      const templates = fs.readdirSync(`${__dirname}/../lib/samples`);
      this.sqz.cli.log.info(`Current available templates:\n"${templates.join(' ')}"`);
    });
  }
}

module.exports = ListTemplates;
