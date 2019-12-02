const parser = require('../../common/parser.js');

function lineParser(line, context) {
  const parts = line.split(/[\s,:x]+/);
  return {
    id: parts[0],
    left: parseInt(parts[2],10),
    top: parseInt(parts[3],10),
    width: parseInt(parts[4],10),
    height: parseInt(parts[5],10)
  }
}

function onLine(line, context) {
  for (i=line.left; i < line.left + line.width; i++) {
    for (j=line.top; j < line.top + line.height; j++) {
      const val = context.fabric[j][i];
      if (val == 'X') {
        context.overlaps += 1;
        context.fabric[j][i] = 'Y'
      } else if (val == 'Y') {}
      else {
        context.fabric[j][i] = 'X';
      }
    }
  }
}

const fabric = new Array(1000);
for (i=0; i < fabric.length; i++) {
  fabric[i] = new Array(1000);
  fabric[i].fill(".");
}

parser.run({
  lineParser: lineParser,
  onLine: onLine,
  onEnd: parser.partialContextEndHandler.bind(parser, 'overlaps'),
  context: {fabric: fabric, overlaps: 0}
});
