module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			options: { },
			development: {
				src: ['index.js', 'Gruntfile.js']
			}
		},
		sloc: {
			options: {
				reportDetail: true
			},
			development: {
				files: {
					'./': ['index.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-sloc');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'sloc']);
};
