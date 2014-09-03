module.exports = function(grunt) {

	grunt.initConfig({
		builddir: 'build',
		uglify: {
			build: {
				files: {
					"<%= builddir %>/all.js": "src/**/*.js"
				}
			}
		},
		copy: {
			build: {
				files: [{ 
					expand: true,
					cwd: "bower_components/bootstrap/dist/css/",
					src: ["bootstrap.min.css"], 
					dest: "<%= builddir %>/"
				}, {
					expand: true,
					cwd: "bower_components/angular/",
					src: ["angular.min.js"],
					dest: "<%= builddir %>/"
				}, {
					expand: true,
					cwd: "bower_components/angular-resource/",
					src: ["angular-resource.min.js"],
					dest: "<%= builddir %>/"
				}, {
					expand: true,
					cwd: "bower_components/angular-route/",
					src: ["angular-route.min.js"],
					dest: "<%= builddir %>/"
				}, {
					expand: true,
					flatten: true,
					cwd: "src/",
					src: ["**/*.html"],
					dest: "<%= builddir %>/"
				}]
			}
		},
		clean: [
			"<%= builddir %>"
		]
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.registerTask("default", ["uglify", "copy"]);	
};