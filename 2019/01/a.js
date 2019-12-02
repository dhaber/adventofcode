const parser = require('../../common/parser.js');

function callback(line, context) {
  let val = Math.floor(line / 3) - 2;
  context.total += val;
}

parser.run({
  onLine: callback,
  context: {total: 0}
});
