'use strict';

const _ = require('lodash');

/**
 * Class that manages some Squeezer utilities
 */
class Utilities {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Get an identifier for a specific value
   *
   * @param value
   * @returns {string}
   */
  getIdentifier(value) {
    return _.upperFirst(_.camelCase(value));
  }
}

module.exports = Utilities;
