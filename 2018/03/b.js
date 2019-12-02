const parser = require('../../common/parser.js');

function lineParser(line, context) {
  const parts = line.split(/[\s,:x]+/);
  context.bad[parts[0]] = true;
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
      if (val == '.') {
        context.fabric[j][i] = line.id;
      } else {
        context.bad[val] = false;
        context.bad[line.id] = false;
      }
    }
  }
}

function onEnd(context) {
  for (const [id, good] of Object.entries(context.bad)) {
      if (good) {
        console.log(id,good);
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
  onEnd: onEnd,
  context: {fabric: fabric, bad: {}}
});
