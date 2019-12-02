const parser = require('../../common/parser.js');

function callback(line, context) {
  context.total += line;
  if (context.previous[context.total]) {
    console.log(context.total);
    process.exit(0);
  }
  context.previous[context.total] = true;
}

parser.runWithInts(callback, {
  total: 0,
  previous: {},
  suppressContextOutput: true,
  restartData: true}
);
