module.exports = function(grunt) {
	grunt.initConfig({
		builddir: 'fe-build',
    tmpdir: 'fe-tmp',

		// FE build stuff
    ngtemplates: {
      app: {
        // do I need index.html here?
        src: ['fe-src/**/*.html', '!**/index.html'],
        dest: '<%= tmpdir %>/templates.js',
        options: {
          url: function(url) {
            return url.replace('fe-src/', '');
          }
        }
      }
    },
		uglify: {
			app: {
				src: [
          'fe-src/**/*.js',
          '<%= tmpdir %>/*.js'
        ],
				dest: '<%= tmpdir %>/app.js'
			}
		},
		concat: {
			js: {
				src: [
					'bower_components/angular/angular.min.js',
					'bower_components/angular-resource/angular-resource.min.js',
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/ng-tags-input/ng-tags-input.min.js',
					'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
          '<%= tmpdir %>/app.js'
				],
				dest: '<%= builddir %>/app.js'
			},
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/ng-tags-input/ng-tags-input.min.css',
          'bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css'
        ],
        dest: '<%= builddir %>/app.css'
      }			
		},
		copy: {
			app: {
				expand: true,
				flatten: true,				
				src: 'fe-src/index.html',
				dest: '<%= builddir %>/'
			}
		},
		clean: {
      'build': ['<%= builddir %>'],
      'tmp' : ['<%= tmpdir %>']
		},

		// BE tests stuff
		mochaTest: {
			test: {
				src: ['be-test/tests.js']
			}
		},

		// Karma stuff
		karma: {
			options: {
				configFile: 'karma.conf.js'
			},
			'test': {
				singleRun: true
			},
			'watch': {
				singleRun: false
			}
		},

		// Protractor-related stuff
		'shell': {
      'webdriver': {
        options: {
          stdout: true
        },
        command: require('path').resolve('node_modules/protractor/bin/webdriver-manager') + ' update'
      }
    },
    'run': {
      'app': {
        options: {
          wait: false
        },
        args: [
          '--harmony',
          'be-src/runner.js'
        ]
      }
    },
    'protractor_webdriver': {
      options: { keepAlive: true },
      dummyTarget: {}
    },
    'protractor': {
      dummyTarget: {
        options: {
          configFile: 'protractor.conf.js'
        }
      }
    }		
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('fe-build', ['clean', 'ngtemplates', 'uglify', 'copy', 'concat', 'clean:tmp']);		
	grunt.registerTask('fe-test', ['karma:test']);
	grunt.registerTask('fe-watch', ['karma:watch']);
	grunt.registerTask('webdriver-update', ['shell:webdriver']);
  grunt.registerTask('e2e-test', ['fe-build', 'protractor_webdriver', 'protractor']);
	grunt.registerTask('be-test', ['mochaTest']);

	grunt.registerTask('test', ['be-test', 'fe-test', 'e2e-test']);

	grunt.registerTask('default', ['fe-build']);	
};
