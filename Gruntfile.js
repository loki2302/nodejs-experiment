module.exports = function(grunt) {
  grunt.initConfig({
    buildDir: 'build',
    appBuildDir: '<%= buildDir %>/app',
    testBuildDir: '<%= buildDir %>/test',
    tsd: {
      install: {
        options: {
          command: 'reinstall',
          config: 'tsd.json'
        }
      }
    },
    typescript: {
      app: {
        src: 'app.ts',
        dest: '<%= appBuildDir %>/',
        options: {
          module: 'commonjs',
          sourcemap: true
        }
      },
      test: {
        src: 'test.ts',
        dest: '<%= testBuildDir %>/',
        options: {
          module: 'commonjs',
          sourcemap: true
        }
      }
    },
    execute: {
      app: {
        src: '<%= appBuildDir %>/app.js'
      }
    },
    mochaTest: {
      test: {
        src: ['<%= testBuildDir %>/*.js']
      }
    },
    clean: ['<%= buildDir %>']
  });

  grunt.loadNpmTasks('grunt-tsd');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('install', ['tsd:install']);
  grunt.registerTask('test', ['clean', 'typescript:test', 'mochaTest']);
  grunt.registerTask('run', ['clean', 'typescript:app', 'execute']);

  grunt.registerTask('default', ['test']);
};
