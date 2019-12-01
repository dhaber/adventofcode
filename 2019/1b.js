const parse = require('./parser.js');

function callback(line, context) {
  let val = Math.floor(line / 3) - 2;
  if (val <= 0 ) {
    return;
  }
  context.total += val;
  callback(val, context);
}

(async () => {
  const context = {total: 0}
  await parse(callback, context);
  console.log(context.total);
})();
