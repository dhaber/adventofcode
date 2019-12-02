const parser = require('../../common/parser.js');

function callback(line, context) {
  context.total += line;
}

parser.runWithInts(callback, {total: 0});
