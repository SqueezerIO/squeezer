'use strict';

const settings = require('../../../package.json');

/**
 * Class which builds an Object for returning local version information  .
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
   * Returns framework version information
   *
   * @Return {Object}
   * @name this.sqz.version.get
   */
  get() {
    return this.versionData;
  }

  /**
   * Returns framework  markdown version information
   *
   * @Return {String}
   * @name this.sqz.version.msg
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
