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

		// Tests will be added soon
		qunit: {
			files: [ 'test/**/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		cssmin: {
			compress: {
				files: {
					'css/reveal.min.css': [ 'css/reveal.css' ]
				}
			}
		},

		sass: {
			main: {
				files: {
					'css/theme/default.css': 'css/theme/source/default.scss',
					'css/theme/beige.css': 'css/theme/source/beige.scss',
					'css/theme/night.css': 'css/theme/source/night.scss',
					'css/theme/serif.css': 'css/theme/source/serif.scss',
					'css/theme/simple.css': 'css/theme/source/simple.scss',
					'css/theme/sky.css': 'css/theme/source/sky.scss',
					'css/theme/moon.css': 'css/theme/source/moon.scss',
					'css/theme/solarized.css': 'css/theme/source/solarized.scss'
				}
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js' ]
		},

		watch: {
			main: {
				files: [ 'Gruntfile.js', 'js/reveal.js', 'css/reveal.css' ],
				tasks: 'default'
			},
			theme: {
				files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
				tasks: 'themes'
			},
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
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-jade' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );

	// Default task
	grunt.registerTask( 'default', [ 'jshint', 'cssmin', 'uglify' ] );

	// Theme task
	grunt.registerTask( 'themes', [ 'sass' ] );

  // assemble slides document
  grunt.registerTask( 'precompile', function() {
    var options = grunt.file.readJSON('slides.json');

    var slides = options.slides.reduce(function(result, slide) {
      return result + "  include slides/" + slide + "\n";
    }, 'extends layout\n\nblock slides\n');

    slides = slides + "\nblock options\n  script\n    var options = " + JSON.stringify(options.options) + ";";

    grunt.file.write('slides.jade', slides);
  });

  grunt.registerTask( 'slides', [ 'precompile', 'jade' ] );

  grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

  grunt.registerTask( 'package', [ 'slides', 'zip' ] );

  // for some reason, loading this above with the other plugins
  // causes the 'precompile' task to break
  grunt.loadNpmTasks( 'grunt-zip' );
};
