const sqz = require('../bin/Squeezer');

sqz.init();

const walkSync = require('walk-sync');

describe('Squeezer CLI unit tests', () => {
  const paths = walkSync('./lib', { globs : ['**/tests/*.js'], ignore : ['plugins/templates'] });
  paths.forEach(filename => require(`../lib/${filename}`)(sqz)); // eslint-disable-line global-require, max-len

  before((done) => {
    done();
  });

  after((done) => {
    done();
  });
});
