module.exports = function(grunt) {

	grunt.initConfig({
		builddir: 'build',
		uglify: {
			app: {
				src: "src/**/*.js",
				dest: "<%= builddir %>/all.js"				
			}
		},
		concat: {
			angular: {
				src: [
					"bower_components/angular/angular.min.js",
					"bower_components/angular-resource/angular-resource.min.js",
					"bower_components/angular-route/angular-route.min.js",
					"bower_components/ng-tags-input/ng-tags-input.min.js"
				],
				dest: "<%= builddir %>/angular.js"
			}			
		},
		copy: {
			app: {
				expand: true,
				flatten: true,				
				src: "src/**/*.html",
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
		]
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.registerTask("default", ["uglify", "copy", "concat"]);	
};
