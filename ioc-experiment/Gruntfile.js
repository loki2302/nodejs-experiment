module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      all: {
        src: ['./**/*.spec.js']
      }
    },
    watch: {
      all: {
        files: ['./*.js'],
        tasks: ['default'],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['mochaTest']);
};
