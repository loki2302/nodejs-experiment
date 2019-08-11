var multiCapabilities;
if(process.env.TRAVIS) {
  multiCapabilities = [{ browserName: 'firefox' }];
} else {
  multiCapabilities = [{ browserName: 'chrome' }, { browserName: 'firefox' }];
}

module.exports = {
  config: {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e-test/**/*.spec.js'],
    multiCapabilities: multiCapabilities,
    maxSessions: 1,
    baseUrl: 'http://localhost:3000/'
  }
};
