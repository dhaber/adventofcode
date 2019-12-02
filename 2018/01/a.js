const parser = require('../../common/parser.js');

function callback(line, context) {
  context.total += line;
}

parser.run({
  lineParser: 'intLineParser',
  onLine: callback,
  context: {total: 0}
});
