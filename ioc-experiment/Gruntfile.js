module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      all: {
        src: ['./**/*.spec.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('default', ['mochaTest']);
};
