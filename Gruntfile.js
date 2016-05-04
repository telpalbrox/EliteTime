module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		watch: {
			babel: {
				files: ["src/**/*.js"],
				tasks: ["newer:babel:build"],
				options: {
					spawn: false
				}
			}
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: './src',
						src: ['index.html', 'styles/**/*'],
						dest: './build/'
					}
				]
			}
		},
		clean: {
			build: ['./build/']
		},
		babel: {
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: [
						'**/*.js'
					],
					dest: 'build'
				}]
			}
		}
	});

	grunt.registerTask("build-dev", ["clean:build", "copy:build", "babel:build"]);
	grunt.registerTask("dev", ["build-dev", "watch:babel"]);
};
