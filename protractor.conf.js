exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e-test/spec.js'],
  baseUrl: 'http://localhost:3000/'
};
