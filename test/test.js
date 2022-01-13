const grunt = require('grunt');

exports['dart-sass'] = {
  
  compile(test) {
  
    test.expect(2);
    
    const outputs = [
      grunt.file.read('test/tmp/test.css'), 
      grunt.file.read('test/tmp/test.min.css'),
    ];
    const expected = [
      grunt.file.read('test/expected/test.css'),
      grunt.file.read('test/expected/test.min.css')
    ];
    
    outputs.forEach((output, i) => test.equal(output, expected[i], 'should compile SCSS to CSS'));

    test.done();
  
  },
  whole_dir_test(test) {
    const expected_output = grunt.file.read('test/expected/test.css')
    const outputs = [
      grunt.file.read('test/tmp/whole_dir/test.css'),
      grunt.file.read('test/tmp/whole_dir/error.css'),
    ];

    outputs.forEach((output) => test.equal(output, expected_output, 'should compile SCSS to CSS'));

    test.done();
  }
  
};