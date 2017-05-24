'use strict';

const expect = require('chai').expect;

module.exports = (sqz) => {
  describe('sqz.common.cli.error.get()', () => {
    it('should contain something', () => {
      expect(sqz.cli.error.get('DISPLAY THIS')).to.contain('DISPLAY THIS');
    });
  });
};
