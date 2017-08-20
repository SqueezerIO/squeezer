'use strict';

const fs      = require('fs');
const colors  = require('colors');

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
      this.sqz.cli.log.info(`Current available templates:\n${colors.blue.bold(templates.join(' '))}`);
    });
  }
}

module.exports = ListTemplates;
