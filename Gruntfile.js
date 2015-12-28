module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			options: { },
			development: {
				src: ['index.js', 'Gruntfile.js', 'test/*.js']
			}
		},
		nodeunit: {
			options: { },
			development: {
				src: ['test/*.js']
			}
		},
		sloc: {
			options: {
				reportDetail: true
			},
			development: {
				files: {
					'./': ['index.js', 'test/*.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-sloc');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'nodeunit', 'sloc']);
};
