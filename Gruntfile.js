module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: false
				},
				files: {
					'theme/css/recoil.min.css': ['assets/less/**.less']
				}
			},
			release: {
				options: {
					compress: true
				},
				files: {
					'theme/css/recoil.min.css': ['assets/less/recoil.less']
				}
			}
		},
		jshint: {
			browser: {
				options: {
					jquery: true
				},
				src: ['assets/js/**.js']
			},
			server: {
				src: ['Gruntfile.js', 'bin/recoil', 'index.js', 'lib/**.js']
			}
		},
		uglify: {
			development: {
				options: {
					mangle: false,
					compress: false,
					beautify: true,
					preserveComments: 'all'
				},
				files: {
					'theme/js/recoil.min.js': ['assets/js/**.js']
				}
			},
			release: {
				options: {
					mangle: true,
					compress: true,
					preserveComments: false
				},
				files: {
					'theme/js/recoil.min.js': ['assets/js/**.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('browser', [
		'jshint:browser',
		'less:development',
		'uglify:development'
	]);
	grunt.registerTask('browser:release', [
		'jshint:browser',
		'less:release',
		'uglify:release'
	]);
	grunt.registerTask('server', [
		'jshint:server'
	]);
	grunt.registerTask('server:release', [
		'jshint:server'
	]);

	grunt.registerTask('default', [
		'browser',
		'server'
	]);
	grunt.registerTask('release', [
		'browser:release',
		'server:release'
	]);
};
