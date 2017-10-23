'use strict';

const yaml           = require('js-yaml');
const yamlinc = require('yaml-include');
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

    const loadOptions = {
      schema: yamlinc.YAML_INCLUDE_SCHEMA
    };

    try {
      fileData = fs.readFileSync(file, 'utf8');
      fileObj  = yaml.safeLoad(fileData, loadOptions);

      inputData = _.assign({
        this : fileObj,
        vars : vars,
        env : process.env
      }, input);

      data     = yaml.safeLoad(templateString(fileData, inputData), loadOptions);
    } catch (e) {
      this.sqz.cli.log.error(`FILENAME : "${file}"\n\n${e}`);
    }

    return data;
  }
}

module.exports = YAML;
