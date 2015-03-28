module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      all: ['app.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['nodeunit']);
};
