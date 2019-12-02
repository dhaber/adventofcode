require('dotenv').config();
const request = require("request-promise-native");
const path = require('path');

if (!process.env.SESSION_COOKIE) {
 console.log("Make sure you defined 'SESSION_COOKIE' in your .env file");
 process.exit(-1);
}

function defaultLineParser(line) {
  return line.trim();
}

function commaLineParser(line) {
  return defaultLineParser(line).split(',');
}

function commaIntLineParser(line) {
  return commaLineParser(line).map(i => parseInt(i, 10));
}

const Parser = class {
  constructor() {
    this.defaultLineParser = defaultLineParser;
    this.commaLineParser = commaLineParser;
    this.commaIntLineParser = commaIntLineParser;
  }

  intLineParser(line) {
    return parseInt(defaultLineParser(line),10);
  }

  runWithInts(callback, context) {
    this.run(callback, context, this.intLineParser);
  }

  // runs our async parser and displays the context
  run(callback, context, lineParser = defaultLineParser) {
    (async () => {
      await this.parse(callback, context, lineParser);
      console.log(context);
    })();

  }

  // given a callback and a context, calls the callback for each line in the data
  async parse(callback, context, lineParser) {
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

    // call the callback for each line
    for (const line of lines) {
      callback(lineParser(line), context)
    }
  }
}

module.exports = new Parser();
