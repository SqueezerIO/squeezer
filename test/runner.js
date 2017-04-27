'use strict';

const sqz = require('../cli/Squeezer');

sqz.init();

const CommandLineInterface = require('../cli/interface');

const CLI                  = new CommandLineInterface();

const walkSync             = require('walk-sync');

describe('Squeezer CLI Test Suite', () => {
  /* mock CLI commands */
  CLI.load(__dirname, './lib/commands');
  CLI.run(['', '--msg', 'hello']);

  const paths = walkSync('./lib', { globs : ['**/tests/*.js'] });
  paths.forEach(filename => require(`../lib/${filename}`)(sqz)); // eslint-disable-line global-require, max-len

  before((done) => {
    done();
  });

  after((done) => {
    done();
  });
});
