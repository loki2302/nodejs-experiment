module.exports = function(grunt) {
  grunt.initConfig({
    distDir: 'dist',
    git_deploy: {
      dist: {
        options: {
          url: 'https://git.heroku.com/powerful-beach-8366.git',
          message: 'Deployment by Grunt',
          branch: 'master'
        },
        src: 'dist'
      }
    },

    // Backend tests
    beTestSrcDir: 'be-test',
    mochaTest: {
      all: {
        src: ['<%= beTestSrcDir %>/**/*.spec.js']
      }
    },

    // Frontend build
    feSrcDir: 'fe-src',
    feTmpBuildDir: 'fe-tmp',
    feTemplatesJsFile: '<%= feTmpBuildDir %>/templates.js',
    ngtemplates: {
      all: {
        src: ['<%= feSrcDir %>/**/*.html', '!**/index.html'],
        dest: '<%= feTemplatesJsFile %>',
        options: {
          module: 'tbTemplates',
          standalone: true,
          url: function(url) {
            // TODO: can I access feTemplatesSrcDir here?
            return url.replace('fe-src/', '');
          }
        }
      }
    },
    feAmalgamatedJsFile: '<%= feTmpBuildDir %>/amalgamated.js',
    feBowerComponentsDir: 'bower_components',
    uglify: {
      all: {
        src: ['<%= feSrcDir %>/**/*.js', '<%= feTemplatesJsFile %>'],
        dest: '<%= feAmalgamatedJsFile %>'
      }
    },
    feBuildDir: 'fe-build',
    feAmalgamatedJsFileWithDependencies: '<%= feBuildDir %>/teambuildr.js',
    feAmalgamatedCssFile: '<%= feBuildDir %>/teambuildr.css',
    concat: {
      allJs: {
        src: [
          '<%= feBowerComponentsDir %>/uri.js/src/URI.min.js',
          '<%= feBowerComponentsDir %>/angular/angular.min.js',
          '<%= feBowerComponentsDir %>/angular-route/angular-route.min.js',
          '<%= feBowerComponentsDir %>/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
          '<%= feAmalgamatedJsFile %>'
        ],
        dest: '<%= feAmalgamatedJsFileWithDependencies %>'
      },
      allCss: {
        src: ['<%= feBowerComponentsDir %>/bootstrap/dist/css/bootstrap.min.css'],
        dest: '<%= feAmalgamatedCssFile %>'
      }
    },
    feIndexHtmlFile: '<%= feSrcDir %>/index.html',
    copy: {
      indexHtml: {
        expand: true,
        flatten: true,
        src: ['<%= feIndexHtmlFile %>'],
        dest: '<%= feBuildDir %>'
      },
      dist: {
        files: [
          { expand: true, src: ['be-src/**'], dest: '<%= distDir %>/' },
          { expand: true, src: ['fe-build/**'], dest: '<%= distDir %>/' },
          { expand: true, src: ['Procfile', 'package.json'], dest: '<%= distDir %>/' }
        ]
      }
    },
    clean: {
      feBuild: ['<%= feBuildDir %>'],
      feTmpBuildDir: ['<%= feTmpBuildDir %>'],
      dist: ['<%= distDir %>']
    },

    // Launch
    beSrcDir: 'be-src',
    serverJs: '<%= beSrcDir %>/server.js',
    run: {
      teambuildr: {
        args: ['--harmony', '<%= serverJs %>']
      }
    },

    // FE tests
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      runOnce: {
        singleRun: true
      },
      watch: {
        singleRun: false
      }
    },

    // E2E tests
    shell: {
      webDriver: {
        options: {
          stdout: true
        },
        command: require('path')
          .resolve('node_modules/protractor/bin/webdriver-manager') + ' update'
      }
    },
    protractor_webdriver: {
      options: {
        keepAlive: true
      },
      dummyTarget: {} // TODO: check if this dummy target is even needed
    },
    protractor: {
      dummyTarget: { // TODO: check if this dummy target is even needed
        options: {
          configFile: 'protractor.conf.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-git-deploy');

  grunt.registerTask('be-test', 'Run backend tests', ['mochaTest']);
  grunt.registerTask('test', 'Run all tests',
    ['be-test', 'fe-test', 'e2e-test']);

  grunt.registerTask('fe-build', 'Build frontend',
    ['clean', 'ngtemplates', 'uglify', 'copy', 'concat', 'clean:feTmpBuildDir']);

  grunt.registerTask('start', 'Build frontend and launch everything',
    ['fe-build', 'run']);

  grunt.registerTask('webdriver-update', 'Install/update WebDriver',
    ['shell:webDriver']);

  grunt.registerTask('e2e-test', 'Run E2E tests',
    ['fe-build', 'protractor_webdriver', 'protractor']);

  grunt.registerTask('fe-test', 'Run FE tests once', ['karma:runOnce']);
  grunt.registerTask('fe-watch', 'Run FE tests continuously', ['karma:watch']);

  grunt.registerTask('heroku-deployment', 'Build everything and deploy to Heroku', [
    'clean:dist',
    'fe-build',
    'copy:dist',
    'git_deploy:dist',
    'clean:dist'
  ]);
};
