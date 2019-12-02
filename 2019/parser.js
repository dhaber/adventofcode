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

  // runs our async parser and displays the context
  run(callback, context, lineParser = defaultLineParser) {
    (async () => {
      await this.parse(callback, context, lineParser);
      console.log(context);
    })();

  }

  // given a callback and a context, calls the callback for each line in the data
  async parse(callback, context, lineParser) {
    // file names are like /a/b/1a.js
    // convert /a/b/1a.js -> 1a
    let file = path.posix.basename(require.main.filename, '.js');

    // convert 1a -> 1
    file = file.replace(/[ab]/, '');

    // download the data
    let data = await request({
      url: `https://adventofcode.com/2019/day/${file}/input`,
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
