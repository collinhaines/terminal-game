/**
 * Gruntfile.js
 */

'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    minified: 'terminal-<%= pkg.version %>.min.js',

    babel: {
      default: {
        files: {
          'js/<%= minified %>': ['js/<%= minified %>']
        },

        options: {
          presets: ['es2015']
        }
      }
    },

    concat: {
      default: {
        src:  ['js/src/*js'],
        dest: 'js/<%= minified %>',
        options: {
          // Remove `module.exports` at the bottom for the browser.
          process: function (src) {
            return src.replace(/^(module.exports).*/gm, '');
          }
        }
      }
    },

    concurrent: {
      default: {
        tasks: ['http-server', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    'http-server': {
      default: {
        host: 'localhost',
        port: 8080,
        root: './'
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
          'css/terminal.min.css': 'css/terminal/terminal.less'
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
          'js/<%= minified %>': ['js/<%= minified %>']
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

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('compile', ['less', 'scripts']);
  grunt.registerTask('dev',     ['concurrent']);
  grunt.registerTask('lint',    ['jshint:scripts', 'lesslint']);
  grunt.registerTask('self',    ['jshint:grunt']);
  grunt.registerTask('scripts', ['concat', 'babel', 'uglify']);

  grunt.registerTask('default', ['lint', 'compile']);
};
