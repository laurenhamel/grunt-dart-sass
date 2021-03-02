const _ = require('lodash');
const chalk = require('chalk');
const intercept = require('intercept-stdout');

const logger = {

  __unhook: null,
  __results: [],
  __styles: {
    log: [],
    success: ['green'],
    error: ['red', 'bold'],
    warn: ['yellow', 'bold'],
    debug: ['blue', 'bold'],
  },
  __linebreak: /^\r?\n$/,
  __chalk (styles) {
    let method = styles.length ? chalk : (text) => text;

    for (const style of styles) {
      method = method[style];
    }

    return method;
  },
  __log (text) {
    const { __linebreak, __results } = logger;

    // Make sure some text has been captured.
    if( text ) {

      const output = { text, type: 'log' };

      // Get next index in result set.
      let next = logger.__results.length;

      // Check the last index for line breaks, and decrement if none are found.
      if( next > 0 && !__linebreak.test(__results[next-1]) ) --next;

      // Make sure the item has been initialized.
      if( !_.isArray(__results[next]) ) __results[next] = [];

      // Check for types.
      if( _.startsWith(text, 'SUCCESS') ) output.type = 'success';
      if( _.startsWith(text, 'ERROR') ) output.type = 'error';
      if( _.startsWith(text, 'WARN') ) output.type = 'warn';
      if( _.startsWith(text, 'DEBUG') ) output.type = 'debug';

      // Capture line breaks.
      if( __linebreak.test(text) ) {
        output.type = 'log';

        __results.push(output);
      }

      // Add to the array.
      else __results[next].push(output);

    }
  },
  __output () {
    logger.__results.flat().forEach(({ type, text }) => process.stdout.write(text));
  },

  intercept () {
    logger.__unhook = intercept(logger.__log);
  },
  unhook () {
    logger.__unhook();
    logger.__output();
  },

  log: (text) => logger.__log(logger.__chalk(logger.__styles.log)(text)),
  success: (text) => logger.__log(logger.__chalk(logger.__styles.success)(text)),
  error: (text) => logger.__log(logger.__chalk(logger.__styles.error)(text)),
  warn: (text) => logger.__log(logger.__chalk(logger.__styles.warn)(text)),
  debug: (text) => logger.__log(logger.__chalk(logger.__styles.debug)(text)),
  file: (file) => logger.__log(`>> File ${chalk.cyan(file)} created.\n`)
};

module.exports = logger;
