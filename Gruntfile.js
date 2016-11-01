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
      'dev': {
        host: '127.0.0.1',
        root: './',
        port: 8080,
      }
    },

    less: {
      default: {
        options: {
          compress:  true,
          sourceMap: true
        },
        files: {
          'css/bootstrap-3.3.7.min.css': 'css/bootstrap/bootstrap.less',
          'css/terminal.min.css': 'css/terminal/terminal.less'
        }
      }
    },

    watch: {
      less: {
        files: ['css/**/*.less'],
        tasks: ['less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');

  grunt.registerTask('dev', 'concurrent');
  grunt.registerTask('default', 'less');
};
