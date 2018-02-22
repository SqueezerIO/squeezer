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
    process.stdout.write('.');
    this.loaderInterval = setInterval(() => {
      process.stdout.write('.');
    }, 3000, true);
  }

  /**
   * Loader stop
   * @name this.sqz.cli.loader.stop
   */
  stop() {
    // if (process.stdout.clearLine) {
    //   process.stdout.clearLine();
    //   process.stdout.cursorTo(0);
    // }
    process.stdout.write('\n');
    clearInterval(this.loaderInterval);
  }
}

module.exports = Loader;
