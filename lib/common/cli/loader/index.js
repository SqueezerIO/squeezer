'use strict';

/**
 * Class that represents CLI loader.
 */
class Loader {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Loader start
   * @name this.sqz.cli.loader.start
   */
  start() {
    this.loaderInterval = setInterval(() => {
      process.stdout.write('.');
    }, 3000, true);
  }

  /**
   * Loader stop
   * @name this.sqz.cli.loader.stop
   */
  stop() {
    if (process.stdout.clearLine) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }
    clearInterval(this.loaderInterval);
  }
}

module.exports = Loader;
