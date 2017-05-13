'use strict';

const expect = require('chai').expect;

module.exports = (sqz) => {
  describe('sqz.common.cli.params.list()', () => {
    it('should be an object', () => {
      expect(sqz.common.cli.params.get()).to.be.an('object');
    });

    it('should deep contain something', () => {
      expect(sqz.common.cli.params.get().options).to.deep.equal({ msg : ['hello'] });
    });
  });
};
