'use strict';

const expect = require('chai').expect;

module.exports = (sqz) => {
  describe('sqz.tasks.config.set()', () => {
    it('should set a key', () => {
      sqz.config.set('testSetting', 'hello');
    });
  });

  describe('sqz.tasks.config.get()', () => {
    it('should get a value', () => {
      expect(sqz.config.get('testSetting')).to.equal('hello');
    });
  });
};
