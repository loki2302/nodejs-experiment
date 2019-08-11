module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      all: ['tests/*.js', '!tests/*.spec.js']
    },
    mochaTest: {
      all: {
        src: ['tests/*.spec.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['nodeunit', 'mochaTest']);
};
