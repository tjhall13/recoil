module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			browser: {
				options: {
					compress: true
				},
				files: {
					'theme/css/recoil.min.css': ['theme/less/recoil.less']
				}
			}
		},
		jshint: {
			browser: {
				options: {
					jquery: true
				},
				src: ['theme/js/**.js']
			},
			server: {
				src: ['Gruntfile.js', 'bin/recoil', 'index.js', 'lib/**.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('browser', ['jshint:browser', 'less:browser']);
	grunt.registerTask('server', ['jshint:server']);

	grunt.registerTask('default', ['browser', 'server']);
};
