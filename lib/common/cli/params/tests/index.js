'use strict';

const expect = require('chai').expect;

module.exports = (sqz) => {
  describe('sqz.common.cli.params.list()', () => {
    it('should be an object', () => {
      expect(sqz.cli.params.get()).to.be.an('object');
    });
  });
};
