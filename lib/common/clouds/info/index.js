  'use strict';

/**
 * Class representing Squeezer  microservices clouds information
 */
class Settings {
  constructor(sqz) {
    this.sqz = sqz;

    this.info = {
      aws: {
        title    : 'Amazon Web Services',
        languages: {
          nodejs: {
            versions: [
              '4.3'
            ],
            default : '4.3'
          }
        }
      }
    }
  }

  /**
   * Returns clouds information data
   * @returns {Object}
   * @name sqz.clouds.info.get()
   */
  get() {
    return this.info;
  }
}

module.exports = Settings;
