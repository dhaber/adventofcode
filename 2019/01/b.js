const parser = require('../../common/parser.js');

function callback(line, context) {
  let val = Math.floor(line / 3) - 2;
  if (val <= 0 ) {
    return;
  }
  context.total += val;
  callback(val, context);
}

parser.run({
  onLine: callback,
  context: {total: 0}
});
