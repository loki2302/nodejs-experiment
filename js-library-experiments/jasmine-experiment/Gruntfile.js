module.exports = function(grunt) {
  grunt.initConfig({
    jasmine: {
      all: {
        options: {
          specs: 'test.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('default', ['jasmine']);
};
