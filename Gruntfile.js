module.exports = function(grunt) {

	grunt.initConfig({
		builddir: 'fe-build',

		// FE build stuff
		uglify: {
			app: {
				src: "fe-src/**/*.js",
				dest: "<%= builddir %>/all.js"				
			}
		},
		concat: {
			angular: {
				src: [
					"bower_components/angular/angular.min.js",
					"bower_components/angular-resource/angular-resource.min.js",
					"bower_components/angular-route/angular-route.min.js",
					"bower_components/ng-tags-input/ng-tags-input.min.js",
					"bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"
				],
				dest: "<%= builddir %>/angular.js"
			}			
		},
		copy: {
			app: {
				expand: true,
				flatten: true,				
				src: "fe-src/**/*.html",
				dest: "<%= builddir %>/"
			},
			bootstrap: {
				expand: true,
				flatten: true,				
				src: "bower_components/bootstrap/dist/css/bootstrap.min.css", 
				dest: "<%= builddir %>/"				
			},
			ngTagsInput: {
				expand: true,
				flatten: true,
				src: [
					"bower_components/ng-tags-input/ng-tags-input.min.css",
					"bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css"
				],
				dest: "<%= builddir %>/"
			}
		},
		clean: [
			"<%= builddir %>"
		],

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
		"shell": {
      "webdriver": {
        options: {
          stdout: true
        },
        command: require("path").resolve("node_modules/protractor/bin/webdriver-manager") + " update"
      }
    },
    "run": {
      "app": {
        options: {
          wait: false
        },
        args: [
          "--harmony",
          "be-src/runner.js"
        ]
      }
    },
    "protractor_webdriver": {
      dummyTarget: {}
    },
    "protractor": {
      dummyTarget: {
        options: {
          configFile: "protractor.conf.js"
        }
      }
    }		
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-run");
  grunt.loadNpmTasks("grunt-protractor-webdriver");
  grunt.loadNpmTasks("grunt-protractor-runner");
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('fe-build', ["uglify", "copy", "concat"]);		
	grunt.registerTask("fe-test", ["karma:test"]);
	grunt.registerTask("fe-watch", ["karma:watch"]);
	grunt.registerTask('webdriver-update', ['shell:webdriver']);
	grunt.registerTask('e2e-test', ['fe-build', 'run:app', 'protractor_webdriver', 'protractor', 'stop:app']);
	grunt.registerTask('be-test', ['mochaTest']);

	grunt.registerTask('test', ['be-test', 'fe-test', 'e2e-test']);

	grunt.registerTask("default", ['fe-build']);	
};
