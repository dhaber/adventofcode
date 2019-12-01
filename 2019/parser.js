require('dotenv').config();
const request = require("request-promise-native");
const path = require('path');

if (!process.env.SESSION_COOKIE) {
 console.log("Make sure you defined 'SESSION_COOKIE' in your .env file");
}
async function parse(callback, context) {
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
    callback(line.trim(), context)
  }
}

module.exports = parse;
