const expect = require('chai').expect;

describe('hello world web app', () => {
  browser.url('/');

  it('should be a specific page title', () => {
    const pageTitle = browser.getTitle();
    expect(pageTitle).to.be.equal('Hello World !!!');
  });

  it('should be 4 material buttons rendered with React', () => {
    const buttonsCount = browser.element('#buttons').getText().split('\n').length;
    expect(buttonsCount).to.be.equal(4);
  });
});
