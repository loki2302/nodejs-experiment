module.exports = function(grunt) {
  grunt.initConfig({

    // Backend tests
    beTestSrcDir: 'be-test',
    mochaTest: {
      all: {
        src: ['<%= beTestSrcDir %>/**/*.spec.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('be-test', 'Run backend tests', ['mochaTest']);
  grunt.registerTask('test', 'Run all tests', ['be-test']);
};
