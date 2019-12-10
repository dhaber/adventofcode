const parser = require('../../common/parser.js');


function onLine(line, context) {
  context.row += 1;
  for (let i=0; i < line.length; i++) {
    let char = line.charAt(i);
    if (char == '#') {
      context.asteroids.push({x: i, y: context.row});
    }
  }
}

function onEnd(context) {
  let max = {count: 0};
  for (let asteroid of context.asteroids) {
    asteroid.count = getCount(asteroid, context.asteroids);
    if (max.count < asteroid.count) {
      max = asteroid;
    }
  }
  console.log(max);
}

function getCount(asteroid, asteroids) {
  let slopes = {};
  for (let other of asteroids) {
    if (other.x == asteroid.x && other.y == asteroid.y) {
      continue;
    }
    let x = other.x - asteroid.x;
    let y = other.y - asteroid.y;
    let slope =  x / y;
    let xdir = x > 0 ? 'r' : 'l';
    let ydir = y > 0 ? 'd' : 'u';
    if (asteroid.x == 2 && asteroid.y == 2) {
//      console.log(other.x, other.y, slope);
    }
    slopes[xdir + ydir + slope] = true;
  }
  //console.log(asteroid, Object.keys(slopes).length);

  return Object.keys(slopes).length;
}

parser.run({
  onLine: onLine,
  onEnd: onEnd,
  context: {asteroids: [], row: -1}
});
