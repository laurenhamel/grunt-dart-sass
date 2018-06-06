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
  grunt.registerMultiTask('dart-sass', 'Compile Sass to CSS via Dart Sass', function () { 
    
    // Load dependencies.
    const sass = require('sass');
    const extend = require('extend');
    const path = require('path');
    const chalk = require('chalk');
    const intercept = require('intercept-stdout');
    
    // Make asynchronous.
    const done = this.async();
    
    // Set options.
    const options = this.options({
      sourceMap: undefined,
      sourceMapContents: false,
      sourceMapEmbed: false,
      sourceMapRoot: undefined,
      outputStyle: 'expanded',
      omitSourceMapUrl: false,
      indentedSyntax: false,
      indentType: 'space',
      indentWidth: 2,
      lineFeed: 'lf',
      includePaths: [],
      /*file*/
      /*outFile*/
    }); 
    
    // Initialize results.
    let results = [];
    
    // Initialize error handler.
    let error = undefined; 
    
    // Initialize output type.
    let type = 'log';
    
    // Initialize interceptor.
    const unhook = intercept(function(text) {
      
      // Make sure some text has been captures.
      if( text ) {
      
        // Get next index in result set.
        let next = results.length;

        // Check the last index for line breaks, and decrement if none is found.
        if( next > 0 && !(/^\r?\n$/).test(results[next-1]) ) --next;

        // Make sure the item has been initialized.
        if( !Array.isArray(results[next]) ) results[next] = [];
        
        // Check for types.
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
    
    for( let file of this.files ) { 

      // Try to compile Sass.
      try { 
        
        // Initialize render data.
        const data = extend({}, options, {
          file: Array.isArray(file.src) ? file.src[0] : file.src,
          outFile: file.dest
        }); 
      
        // Render Sass file.
        const result = sass.renderSync(data);
        
        // Save the CSS file to its target destination
        grunt.file.write(file.dest, results.css);
        
      }
      
      // Otherwise, catch any errors.
      catch(e) {
        
        error = e;
        
        break;
      
      }

    }
    
    // Unhook the interceptor.
    unhook();
    
    // Standardize the console logger.
    console.log = console.debug = console.error = console.warn = function(text) {
      
      process.stdout.write(text);
      
    };
    
    // Handle errors.
    if( error ) done(error);
    
    // Otherwise, log results.
    else {
      
      // Flatten the result set.
      results = results.reduce((array, result) => {
        
        if( Array.isArray(result) ) array = array.concat(result);
        
        else array.push(result);
        
        return array;
        
      }, []);
    
      // Set output styles.
      const styles = {
        log: [],
        error: ['red'],
        warn: ['yellow'],
        debug: ['blue'],
      };

      // Stylize results.
      results.forEach((result) => {
        
        // Get the style.
        const style = styles[result.type].length > 0 ? styles[result.type].slice() : false;

        // Handle styles.
        if( style ) {
          
          // Bold important words.
          if( ['WARNING', 'ERROR', 'DEBUG'].includes(result.text) ) style.push('bold');
          
          // Output the result.
          console[result.type](chalk`{${style.join('.')} ${result.text}}`);
          
        }

        else console[result.type](result.text);

      });

      // Done.
      done();
      
    }
    
  });
  
};