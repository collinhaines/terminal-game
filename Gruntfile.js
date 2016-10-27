module.exports = function (grunt) {
  grunt.initConfig({
    less: {
      default: {
        options: {
          compress:  true,
          sourceMap: true
        },
        files: {
          'css/bootstrap-3.3.7.min.css': 'css/bootstrap/bootstrap.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', 'less');
};
