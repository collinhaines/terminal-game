/**
 * Gruntfile.js
 */

'use strict';

module.exports = function (grunt) {
  // Load all tasks from package.json.
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    terminal: {
      tmp: 'js/tmp/terminal-<%= pkg.version %>.js',
      min: 'js/terminal-<%= pkg.version %>.min.js',
      src: 'js/src/*.js'
    },

    babel: {
      default: {
        files: {
          '<%= terminal.tmp %>': ['<%= terminal.tmp %>']
        },

        options: {
          presets: ['es2015']
        }
      }
    },

    browserSync: {
      default: {
        bsFiles: {
          src: ['css/*.min.css', 'js/*.min.js', '*.html']
        },

        options: {
          open:      false,
          proxy:     'localhost:8080',
          notify:    true,
          watchTask: true
        }
      }
    },

    clean: {
      prod: ['./css/*.min.css*', './js/terminal-*.min.js'],
      temp: ['./js/tmp']
    },

    concat: {
      default: {
        src:  ['<%= terminal.src %>'],
        dest: '<%= terminal.tmp %>',
        options: {
          // Remove `module.exports` at the bottom for the browser.
          process: function (src) {
            return src.replace(/^(module.exports).*/gm, '');
          }
        }
      }
    },

    'http-server': {
      default: {
        host:            'localhost',
        port:            8080,
        root:            './',
        runInBackground: true
      }
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },

      grunt: {
        files: {
          src: ['Gruntfile.js']
        }
      },

      scripts: {
        src: ['js/src/*.js']
      }
    },

    less: {
      options: {
        compress:  true,
        sourceMap: true
      },

      bootstrap: {
        files: {
          'css/bootstrap-3.3.7.min.css': 'css/bootstrap/bootstrap.less',
        }
      },

      terminal: {
        files: {
          'css/terminal-<%= pkg.version %>.min.css': 'css/terminal/terminal.less'
        }
      }
    },

    lesslint: {
      options: {
        failOnWarning: false,
        csslint: {
          csslintrc: 'css/.csslintrc'
        }
      },

      bootstrap: {
        src: ['css/bootstrap/bootstrap.less'],
        options: {
          imports: ['css/bootstrap/**.less']
        }
      },

      terminal: {
        src: ['css/terminal/terminal.less'],
        options: {
          imports: ['css/terminal/*.less']
        }
      }
    },

    mochaTest: {
      default: {
        src: ['test/*.js'],
        options: {
          log:       true,
          logErrors: true
        }
      }
    },

    uglify: {
      default: {
        files: {
          '<%= terminal.min %>': ['<%= terminal.tmp %>']
        },

        options: {
          compress: {
            warnings: false
          },
          mangle: true
        }
      }
    },

    watch: {
      'less-bootstrap': {
        files: ['css/bootstrap/**/*.less'],
        tasks: ['less:bootstrap']
      },

      'less-terminal': {
        files: ['css/terminal/*.less'],
        tasks: ['less:terminal']
      },

      'lint-bootstrap': {
        files: ['css/bootstrap/**/*.less'],
        tasks: ['lesslint:bootstrap']
      },

      'lint-terminal': {
        files: ['css/terminal/*.less'],
        tasks: ['lesslint:terminal']
      },

      scripts: {
        files: ['js/src/*.js'],
        tasks: ['jshint:scripts', 'scripts']
      },

      test: {
        files: ['test/*.js'],
        tasks: ['mochaTest']
      }
    }
  });

  // Check ourself. Make sure we're good.
  grunt.registerTask('default', 'jshint:grunt');

  // Start up a local development session.
  grunt.registerTask('dev', [
    // Start a HTTP server.
    'http-server',

    // Just make web development easier.
    'browserSync',

    // Watch specific files, execute specific tasks.
    'watch'
  ]);

  // Check to see if our code is correct.
  grunt.registerTask('lint', [
    // Check all LESS files.
    'lesslint',

    // Check all JavaScript files (excludes Gruntfile.js)
    'jshint:scripts'
  ]);

  // Compile and create external assets for production server.
  grunt.registerTask('prod', [
    // Clean out old files.
    'clean:prod',

    // Compile LESS files into CSS.
    'less',

    // Execute the JavaScript file workflow.
    'scripts'
  ]);

  // Workflow for JavaScript files.
  grunt.registerTask('scripts', [
    // Concatenate files together.
    'concat',

    // Convert to pre-ES6 syntax for uglify.
    'babel',

    // Minify and obfuscate code.
    'uglify',

    // Clean out temp JavaScript/
    'clean:temp'
  ]);
};
