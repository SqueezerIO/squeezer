'use strict';

const yaml           = require('js-yaml');
const colors         = require('colors');
const fs             = require('fs');
const _              = require('lodash');
const templateString = require('templatestring');

/**
 * Class that manages YAML parsing
 */
class YAML {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Parse an YAML file
   *
   * @Return {Object} data - YAML data
   * @name this.sqz.yaml.parse
   */
  parse(file, input) {
    const vars = this.sqz.vars || {};

    let data;
    let fileData;
    let inputData;
    let fileObj;

    try {
      fileData = fs.readFileSync(file, 'utf8');
      fileObj  = yaml.safeLoad(fileData);

      inputData = _.assign({
        this : fileObj,
        vars : vars
      }, input);

      data     = yaml.safeLoad(templateString(fileData, inputData));
    } catch (e) {
      this.sqz.cli.log.error(`FILENAME : "${file}"\n\n${e}`);
    }

    return data;
  }
}

module.exports = YAML;
