/*
 * grunt-dart-sass
 * https://github.com/laurenhamel/grunt-dart-sass
 *
 * Copyright (c) 2018 Lauren Hamel
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');
const path = require('path');
const sass = require('sass');
const pkg = require('../package.json');
const logger = require('../utils/logger.js');

module.exports = async function (grunt) {

  // Register Grunt multi-task.
  grunt.registerMultiTask('dart-sass', pkg.description, function () {

    // Make asynchronous.
    const done = this.async();

    // Set options.
    const options = this.options();

    // Initialize console interceptor.
    logger.intercept();

    // Wait for the Sass files to compile.
    for (const file of this.files) {

      // Attempt to compile the Sass file.
      try {

        // Capture the source.
        const { src: [src], dest } = file;

        // Validate the source.
        if( !src || _.startsWith(path.basename(src), '_') ) continue;

        // Render the Sass file.
        const result = sass.renderSync(_.merge({}, options, {
          file: src,
          outFile: dest
        }));

        // Save the CSS file.
        grunt.file.write(dest, result.css);

        logger.file(dest);

        // Save the source map.
        if( options.sourceMap && result.map ) {
          const map = options.sourceMap === true ? `${dest}.map` : options.sourceMap;

          grunt.file.write(map, result.map);

          logger.file(map);
        }

      }

      // Catch any errors.
      catch(error) {

        throw error;

      }

    }

    // Capture file count.
    const stylesheets = `${this.files.length} stylesheet${this.files.length > 1 ? 's' : ''}`;
    const maps = options.sourceMap ? ` with source map${this.files.length > 1 ? 's' : ''}` : '';

    // Report done.
    logger.success(`Successfully compiled ${stylesheets}${maps}.\n`);

    // Unhook the interceptor.
    logger.unhook();

    // Done.
    done();

  });

};
