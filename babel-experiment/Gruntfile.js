module.exports = function(grunt) {
  grunt.initConfig({
    'execute': {
      app: {
        src: ['dist/app.js']
      }
    },
    'babel': {
      'dist/app.js': 'src/app.js'
    },
    'clean': ['dist']
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('default', ['clean', 'babel', 'execute']);
};
