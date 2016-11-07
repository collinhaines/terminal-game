/**
 * Gruntfile.js
 */

'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
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
        ignores:  ['js/*.min.js'],
        jshintrc: 'js/.jshintrc'
      },

      grunt: {
        files: {
          src: ['Gruntfile.js']
        }
      },

      scripts: {
        src: ['js/*.js']
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

      'lint-scripts': {
        files: ['js/*.js', '!js/*.min.js'],
        tasks: ['jshint:scripts']
      },

      'lint-terminal': {
        files: ['css/terminal/*.less'],
        tasks: ['lesslint:terminal']
      },

      test: {
        files: ['test/*.js'],
        tasks: ['mochaTest']
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-lesslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('compile', ['less:bootstrap', 'less:terminal']);
  grunt.registerTask('dev',     ['concurrent']);
  grunt.registerTask('lint',    ['jshint:scripts', 'lesslint:bootstrap', 'lesslint:terminal']);
  grunt.registerTask('self',    ['jshint:grunt']);

  grunt.registerTask('default', ['lint', 'compile']);
};
