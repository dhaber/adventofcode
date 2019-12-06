const parser = require('../../common/parser.js');

function lineParser(line) {
  return line.trim().split(')');
}

function onLine([planet, satellite], context) {
  let children = context.map[planet];
  if (!children) {
    children = [];
    context.map[planet] = children;
  }
  children.push(satellite);
}

function onEnd(context) {
  let count = 0;
  for (const planet of Object.keys(context.map)) {
    count += getSatellites(planet, context.map);
  }
  console.log(count);
}

function getSatellites(planet, map) {
  let satellites = map[planet];
  if (!satellites) {
    return 0;
  }

  let count = 0;
  for (let i=0; i < satellites.length; i++) {
    count = count + 1 + getSatellites(satellites[i], map);
  }
  return count;
}

parser.run({
  lineParser: lineParser,
  onLine: onLine,
  onEnd: onEnd,
  context: {map: {}}
});
