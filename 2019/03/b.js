const parser = require('../../common/parser.js');

function lineParser(line) {
  return parser.commaLineParser.call(parser,line).map(i => {
    return {
      direction: i.charAt(0),
      distance: parseInt(i.substring(1),10)
    }
  })
}

function pointSort(a,b) {
  let distance = a.x - b.x;
  if (distance != 0) {
    return distance;
  }
  return a.y - b.y;
}

function onLine(steps, context) {
  let x = 0;
  let y = 0;
  let totalSteps = 0;
  let points = [];
  for (const step of steps) {
    for (let i=1; i <= step.distance; i++) {
      switch(step.direction) {
        case 'R':
          x += 1;
          break;
        case 'U':
          y += 1;
          break;
        case 'L':
          x -= 1;
          break;
        case 'D':
          y -= 1;
          break;
        default:
          console.log('Unexpected direction', step);
          process.exit(-1);
      }
      totalSteps += 1;
      points.push({x: x, y: y, steps: totalSteps});
    }
  }
  context.lines.push(points);
}

function onEnd(context) {
  const matches = findMatches(context.lines[0], context.lines[1]);
  console.log(matches);
  const min = findMin(matches);
  console.log(min);
}

// This is gross.  Should sort and then increment pointers.
function findMatches(aLine, bLine) {
  const matches = [];
  for (const a of aLine) {
    for (const b of bLine) {
      if (a.x == b.x && a.y == b.y) {
        matches.push([a,b]);
      }
    }
  }
  return matches;
}

function findMin(matches) {
  let min = Number.MAX_SAFE_INTEGER;

  for (const [a,b] of matches) {
    min = Math.min(a.steps + b.steps, min);
  }
  return min;
}

parser.run({
  lineParser: lineParser,
  onLine: onLine,
  onEnd: onEnd,
  context: {lines: []}
});
