var capabilities = {};
if(process.env.TRAVIS) {
  capabilities.browserName = 'firefox';
} else {
  capabilities.browserName = 'chrome';
}

module.exports = {
  config: {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e-test/spec.js'],
    capabilities: capabilities,
    baseUrl: 'http://localhost:3000/'
  }
};
