const parser = require('../../common/parser.js');

function callback(line, context) {
  context.total += line;
  if (context.previous[context.total]) {
    return false;
  }
  context.previous[context.total] = true;
}

parser.run({
  lineParser: 'intLineParser',
  onLine: callback,
  context: {total: 0, previous: {}},
  restartData: true,
  onEnd: parser.partialContextEndHandler.bind(parser, 'total')
});
