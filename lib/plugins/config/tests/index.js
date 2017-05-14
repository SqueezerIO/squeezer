'use strict';

const expect = require('chai').expect;

module.exports = (sqz) => {
  describe('sqz.tasks.config.list()', () => {
    it('should be an object', () => {
      expect(sqz.tasks.config.list()).to.be.an('object');
    });
  });

  describe('sqz.tasks.config.set()', () => {
    it('should set a key', () => {
      sqz.tasks.config.set('testSetting', 'hello');
    });
  });

  describe('sqz.tasks.config.get()', () => {
    it('should get a value', () => {
      expect(sqz.tasks.config.get('testSetting')).to.equal('hello');
    });
  });

  describe('sqz.tasks.config.remove()', () => {
    it('should remove a key', () => {
      sqz.tasks.config.remove('testSetting');
      expect(sqz.tasks.config.get('testSetting')).to.not.equal('hello');
    });
  });
};
