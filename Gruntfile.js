module.exports = (grunt) => {
  
  // Initialize configurations.
  grunt.initConfig({
    'dart-sass': {
      expanded: {
        files: {
          'test/tmp/test.css': 'test/fixtures/test.scss'
        }
      },
      compressed: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'test/tmp/test.min.css': 'test/fixtures/test.scss'
        }
      },
      error: {
        files: {
          'test/tmp/error.css': 'test/fixtures/error.scss'
        }
      },
      whole_dir: {
        files: [{
          expand: true,
          cwd: 'test/fixtures',
          src: ['*.scss'],
          dest: 'test/tmp/whole_dir',
          ext: '.css'
        }]
      },
    },
    clean: {
      test: ['test/tmp']
    },
    nodeunit: {
      test: ['test/*.js']
    }
  });
  
  // Load tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Register tasks.
  grunt.registerTask('default', [
    'clean',
    'dart-sass:expanded',
    'dart-sass:compressed',
    'dart-sass:whole_dir',
    'nodeunit',
    'clean'
  ]);
  grunt.registerTask('throw', [
    'dart-sass:error'
  ]);
  
};