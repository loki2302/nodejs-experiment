describe('app', function() {
  it('should work', function() {
    browser.get('/');
    expect(browser.getTitle()).toEqual('nodejs-app-experiment');
  });
});
