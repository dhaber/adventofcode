const parser = require('./parser.js');

function callback(line, context) {
  let val = Math.floor(line / 3) - 2;
  context.total += val;
}

parser.run(callback, {total: 0});
