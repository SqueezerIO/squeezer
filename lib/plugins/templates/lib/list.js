'use strict';

const fs      = require('fs');
const appRoot = require('app-root-path');
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
      const templates = fs.readdirSync(`${appRoot}/lib/plugins/templates/lib/samples`);
      this.sqz.cli.log.info(`Current available templates:\n${colors.blue.bold(templates.join(', '))}`);
    });
  }
}

module.exports = ListTemplates;
