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
        options: {
          timeout: 10000
        },
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
            return url.replace('fe-src/', '');
          }
        }
      }
    },
    feBuildDir: 'fe-build',
    feBowerComponentsDir: 'bower_components',
    feAmalgamatedJsFile: '<%= feBuildDir %>/teambuildr.js',
    uglify: {
      all: {
        src: [
          '<%= feBowerComponentsDir %>/uri.js/src/URI.min.js',
          '<%= feBowerComponentsDir %>/angular/angular.min.js',
          '<%= feBowerComponentsDir %>/angular-route/angular-route.min.js',
          '<%= feBowerComponentsDir %>/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
          '<%= feBowerComponentsDir %>/angular-deckgrid/angular-deckgrid.js',
          '<%= feSrcDir %>/**/*.js',
          '<%= feTemplatesJsFile %>'
        ],
        dest: '<%= feAmalgamatedJsFile %>'
      }
    },
    feAmalgamatedCssFile: '<%= feBuildDir %>/teambuildr.css',
    cssmin: {
      all: {
        files: {
          '<%= feAmalgamatedCssFile %>': [
            '<%= feBowerComponentsDir %>/bootstrap/dist/css/bootstrap.min.css',
            '<%= feSrcDir %>/home.css',
            '<%= feSrcDir %>/commons/avatar.css',
            '<%= feSrcDir %>/teams/teams.css',
            '<%= feSrcDir %>/people/people.css'
          ]
        }
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
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      all: {},
      general: { options: { args: { suite: 'general' } } },
      people: { options: { args: { suite: 'people' } } },
      teams: { options: { args: { suite: 'teams' } } }
    }
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-git-deploy');

  grunt.registerTask('be-test', 'Run backend tests', ['mochaTest']);
  grunt.registerTask('test', 'Run all tests',
    ['be-test', 'fe-test', 'e2e-test:all']);

  grunt.registerTask('fe-build', 'Build frontend',
    ['clean', 'ngtemplates', 'uglify', 'copy', /*'concat',*/ 'cssmin', 'clean:feTmpBuildDir']);

  grunt.registerTask('start', 'Build frontend and launch everything',
    ['fe-build', 'run']);

  grunt.registerTask('webdriver-update', 'Install/update WebDriver',
    ['shell:webDriver']);

  grunt.registerTask('e2e-test', 'Run E2E tests', function(suite) {
    var protractorTask = 'protractor:all';
    if(suite) {
      protractorTask = 'protractor:' + suite;
    }

    grunt.task.run(['fe-build', 'protractor_webdriver', protractorTask]);
  });

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
