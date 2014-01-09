/* global module:false */
module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://lab.hakim.se/reveal-js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2013 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		watch: {
      slides: {
        files: [ 'slides.json', 'slides/*.jade' ],
        tasks: 'slides'
      }
		},

		jade: {
			build: {
				options: {
					data: grunt.file.readJSON('slides.json'),
					pretty: true
				},
				files: {
					"slides.html": [ "slides.jade" ]
				}
			}
		},

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    zip: {
      'slides.zip': [
        'slides.html',
        'css/**',
        'js/**',
        'lib/**',
        'images/**',
        'plugin/**'
      ]
    }

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-jade' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );

  // assemble slides document
  grunt.registerTask( 'precompile', function() {
    var options = grunt.file.readJSON('slides.json');

    var slides = options.slides.reduce(function(result, slide) {
      return result + "  include slides/" + slide + "\n";
    }, 'extends layout\n\nblock slides\n');

    slides = slides + "\nblock options\n  script\n    var options = " + JSON.stringify(options.options) + ";";

    grunt.file.write('slides.jade', slides);
  });

  grunt.registerTask( 'slides',  [ 'precompile', 'jade' ] );

  grunt.registerTask( 'serve',   [ 'connect', 'watch' ] );

  grunt.registerTask( 'package', [ 'slides', 'zip' ] );

  grunt.registerTask( 'default', [ 'serve'] );

  // for some reason, loading this above with the other plugins
  // causes the 'precompile' task to break
  grunt.loadNpmTasks( 'grunt-zip' );
};
