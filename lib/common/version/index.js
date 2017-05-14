'use strict';

const appRoot  = require('app-root-path');

const settings = require(`${appRoot}/package.json`);

/**
 * Class which builds an Object for returning local version information  .
 * @name sqz.tasks.version
 */
class Version {
  constructor(sqz) {
    this.sqz = sqz;

    this.versionData = {
      squeezerCliVersion : `v${settings.version}`,
      nodeVersion        : process.version,
      osPlatform         : process.platform
    };
  }

  /**
   * Return current version information
   *
   * @returns {Object}
   */
  get() {
    return this.versionData;
  }

  /**
   * Return markdown formatted version message
   *
   * @returns {Object}
   */
  msg() {
    const msg =
            `* Squeezer CLI version: ${this.versionData.squeezerCliVersion}\n` +
            `* Node version: ${this.versionData.nodeVersion}\n` +
            `* OS platform: ${this.versionData.osPlatform}`;

    return msg;
  }
}

module.exports = Version;
