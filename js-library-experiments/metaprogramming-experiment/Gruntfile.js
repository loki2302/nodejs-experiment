module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      all: {
        src: ['tests/*.spec.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['mochaTest']);
};
