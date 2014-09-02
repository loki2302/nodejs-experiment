module.exports = function(grunt) {

	grunt.initConfig({
		uglify: {
			build: {
				files: {
					"build/all.js": "src/*.js"			
				}
			}
		},
		copy: {
			build: {
				files: [{ 
					expand: true,
					cwd: "bower_components/bootstrap/dist/css/",
					src: ["bootstrap.min.css"], 
					dest: "build/"
				}, {
					expand: true,
					cwd: "bower_components/angular/",
					src: ["angular.min.js"],
					dest: "build/"
				}, {
					expand: true,
					cwd: "bower_components/angular-resource/",
					src: ["angular-resource.min.js"],
					dest: "build/"
				}, {
					expand: true,
					cwd: "src/",
					src: "index.html",
					dest: "build/"
				}]
			}
		},
		clean: [
			"build"
		]
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.registerTask("default", ["uglify", "copy"]);	
};