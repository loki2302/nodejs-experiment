module.exports = function(grunt) {

	grunt.initConfig({
		builddir: 'fe-build',
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
		clean: [
			"<%= builddir %>"
		]
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-karma");
	
	grunt.registerTask("default", ["uglify", "copy", "concat"]);	
	grunt.registerTask("test", ["karma:test"]);
	grunt.registerTask("watch", ["karma:watch"]);
};
