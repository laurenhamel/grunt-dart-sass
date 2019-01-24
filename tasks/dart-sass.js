/*
 * grunt-dart-sass
 * https://github.com/laurenhamel/grunt-dart-sass
 *
 * Copyright (c) 2018 Lauren Hamel
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Register Grunt multi-task.
  grunt.registerMultiTask('dart-sass', 'Compile Sass to CSS via Dart Sass', async function () {

    // Load dependencies.
    const sass = require('sass');
    const extend = require('extend');
    const path = require('path');
    const chalk = require('chalk');
    const intercept = require('intercept-stdout');

    // Make asynchronous.
    const done = this.async();

    // Set options.
    const options = this.options();

    // Initialize default logger type.
    let type = 'log';

    // Define logger styles.
    const styles = {
      log: [],
      success: ['green'],
      error: ['red'],
      warn: ['yellow'],
      debug: ['blue'],
    };

    // Initialize results.
    let results = [];

    // Initialize counter.
    let compiled = 0;

    // Initialize console interceptor.
    const unhook = intercept((text) => {

      // Make sure some text has been captures.
      if( text ) {

        // Get next index in result set.
        let next = results.length;

        // Check the last index for line breaks, and decrement if none is found.
        if( next > 0 && !(/^\r?\n$/).test(results[next-1]) ) --next;

        // Make sure the item has been initialized.
        if( !Array.isArray(results[next]) ) results[next] = [];

        // Check for types.
        if( text.indexOf('SUCCESS') === 0 ) type = 'success';
        if( text.indexOf('ERROR') === 0 ) type = 'error';
        if( text.indexOf('WARN') === 0 ) type = 'warn';
        if( text.indexOf('DEBUG') === 0 ) type = 'debug';

        // Capture line breaks.
        if( (/^\r?\n$/).test(text) ) results.push({type: type = 'log', text});

        // Add to the array.
        else results[next].push({type, text});

      }

      // Discard original text.
      return '';

    });

    // Initialize a custom logger.
    const logger = (text) => process.stdout.write(text);

    // Standardize our logging methods.
    const log = {
      log: logger,
      success: logger,
      error: logger,
      warn: logger,
      debug: logger
    };

    // Wait for the Sass files to compile.
    await Promise.all(this.files.map(async (file) => {

      // Attempt to compile the Sass file.
      try {

        // Capture the source.
        const [src] = file.src;

        // Validate the source.
        if( !src || path.basename(src)[0] === '_' ) return;

        // Render the Sass file.
        const result = sass.renderSync(extend({}, options, {
          file: src,
          outFile: file.dest
        }));

        // Save the CSS file.
        grunt.file.write(file.dest, result.css);

        // Save the source map.
        if( options.sourceMap ) grunt.file.write((options.sourceMap === true ? `${file.dest}.map` : options.sourceMap), result.map);

        // Tally success.
        ++compiled;

      }

      // Catch any errors.
      catch(error) { throw error; }

    })).then(() => {

      // Unhook the interceptor.
      unhook();

      // Flatten the result set.
      results = results.reduce((array, result) => {

        if( Array.isArray(result) ) array = array.concat(result);

        else array.push(result);

        return array;

      }, []);

      // Stylize results.
      results.forEach((result) => {

        // Get the style.
        const style = styles[result.type].length > 0 ? styles[result.type].slice() : false;

        // Handle styles.
        if( style ) {

          // Bold important words.
          if( ['WARNING', 'ERROR', 'DEBUG'].includes(result.text) ) style.push('bold');

          // Output the result.
          log[result.type](chalk`{${style.join('.')} ${result.text}}`);

        }

        else console[result.type](result.text);

      });

      // Report done.
      log.log(chalk`{${styles.success.join('.')} Successfully compiled ${compiled} Sass file(s).\n}`);

      // Done.
      done();

    }).catch((error) => {

      // Unhook the interceptor.
      unhook();

      // Done, but errors occurred.
      done(error);

    });

  });

};
