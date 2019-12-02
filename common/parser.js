require('dotenv').config();
const request = require("request-promise-native");
const path = require('path');

if (!process.env.SESSION_COOKIE) {
 console.log("Make sure you defined 'SESSION_COOKIE' in your .env file");
 process.exit(-1);
}

const Parser = class {
  constructor() {}

  // no op for data
  defaultDataHandler(lines) {
    return lines;
  }

  // trims each line
  defaultLineParser(line) {
    return line.trim();
  }

  // splits each line by comma into an array
  commaLineParser(line) {
    return this.defaultLineParser(line).split(',');
  }

  // splits each line by comman into an array and converts to ints
  commaIntLineParser(line) {
    return this.commaLineParser(line).map(i => parseInt(i, 10));
  }

  // converts each line to an int
  intLineParser(line) {
    return parseInt(this.defaultLineParser(line),10);
  }

  // no op on line
  defaultLineHandler(line) {
    return line;
  }

  // writes the context out to the console
  defaultEndHandler(context) {
    console.log(context);
  }

  noopEndHandler(context) {}

  partialContextEndHandler(key, context) {
    console.log(context[key]);
  }

  // This is syntactic sugar to call parse
  run(options) {
    (async () => {
      await this.parse(options);
    })();
  }

  // given a string or function will return the appropriate function or a
  // default.  The string will be a function on this.
  stringOrFunc(str, def) {
    let func = str || def;
    if (typeof func == 'string') {
      func = this[func].bind(this);
    }

    if (!func) {
      console.log("Could not find function", func);
      process.exit(-2);
    }

    return func;
  }

  // infers the input from executing module (e.g. /foo/bar/2019/02/a.js)
  // and then retrieves the input from the web.  Parses the input and
  // makes it available for processing using these options:
  // Options:
  //  onData: string || function  - name of a known handler or function to handle - defaults to noop
  //  lineParser: string || function - name of a known handler or function to parse the line - defaults to trim
  //  onLine: string || function - name of a known handler or function to handler - return false to stop processing
  //  onEnd: string || function - name of a known handler or function to handler - defaults to console log
  //  context: object to be passed to callbacks
  //  restartData: after we finish processing the data start it up again.
  //
  async parse(options) {
    const onData = this.stringOrFunc(options.onData, 'defaultDataHandler');
    const lineParser = this.stringOrFunc(options.lineParser, 'defaultLineParser');
    const onLine = this.stringOrFunc(options.onLine, 'defaultLineHandler');
    const onEnd = this.stringOrFunc(options.onEnd, 'defaultEndHandler');
    const context = options.context || {};

    // this looks like /a/b/c/2019/02/a.js
    const paths  = require.main.filename.split(path.sep);
    const day = parseInt(paths[paths.length - 2], 10);
    const year = parseInt(paths[paths.length - 3], 10);

    // download the data
    let data = await request({
      url: `https://adventofcode.com/${year}/day/${day}/input`,
      headers: {
        Cookie: `session=${process.env.SESSION_COOKIE}`
      }
    })

    // split it on newlines
    const lines = data.trim().split(/\r?\n/);
    onData(lines, context);

    let stop = false;
    do {
      // call the callback for each line
      for (let line of lines) {
        line = lineParser(line, context);
        stop = onLine(line, context) === false;

        if (stop) {
          break;
        }

      }
    } while (!stop && options.restartData)

    onEnd(context);
  }
}

module.exports = new Parser();
