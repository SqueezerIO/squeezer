'use strict';

const BlueBird = require('bluebird');
const walkSync = require('walk-sync');
const Colors = require('colors');
const lodash = require('lodash');

/**
 * Class that manages some Squeezer utilities
 */
class Utilities {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Returns Bluebird A+ class promises instance http://bluebirdjs.com/docs/getting-started.html
   *
   * @Return {Object} bluebird -  bluebird promises
   * @name this.sqz.utils.bluebird
   */
  bluebird() {
    return BlueBird;
  }

  /**
   * Returns walk-sync instance https://www.npmjs.com/package/walk-sync
   *
   * @Return {Object} walksync -  walk directories synchronously
   * @name this.sqz.utils.walkSync
   */
  walksync() {
    return walkSync;
  }

  /**
   * Returns terminal colors instance https://www.npmjs.com/package/colors
   *
   * @Return {Object} colors -  walk directories synchronously
   * @name this.sqz.utils.colors
   */
  colors() {
    return Colors;
  }

  /**
   * Returns lodash instance https://lodash.com/
   *
   * @Return {Object} lodash -  lodash tool
   * @name this.sqz.utils.lodash
   */
  lodash() {
    return lodash;
  }
}

module.exports = Utilities;
