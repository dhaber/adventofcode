const parser = require('../../common/parser.js');


function onLine(line, context) {
  let best = context.best;
  context.row += 1;
  for (let i=0; i < line.length; i++) {
    let char = line.charAt(i);
    if (char == '#') {
      let asteroid = {x: i, y: context.row};

      if (asteroid.x == best.x && asteroid.y == best.y) {
        continue;
      }
      asteroid.slope = Math.abs((asteroid.x - best.x) / (asteroid.y - best.y));
      asteroid.slope = asteroid.slope == Infinity ? 9999999 : asteroid.slope;
      asteroid.xDir = asteroid.x - best.x >= 0 ? 'r' : 'l';
      asteroid.yDir = asteroid.y - best.y > 0 ? 'd' : 'u';
      asteroid.distance = Math.abs(asteroid.x - best.x) + Math.abs(asteroid.y - best.y);
      context.asteroids.push(asteroid);
    }
  }
}

function onEnd(context) {
  let roidMap = group(context.asteroids);
  let sortedGroups = Object.keys(roidMap).sort(keySort);

  let i =0;
  let lastI = -1;
  while (i != lastI) {
    lastI = i;
    for (let [index, group] of sortedGroups.entries()) {
      let roids = roidMap[group];
      if (roids.length > 0) {
        console.log(i++, roids.shift());
      }
    }
  }
}

function group(asteroids) {
  let all = {};
  for (let asteroid of asteroids) {
    let key = asteroid.xDir + asteroid.yDir + asteroid.slope;
    let group = all[key];
    if (!group) {
      group = [];
      all[key] = group;
    }
    group.push(asteroid);
  }

  for (let [key, value] of Object.entries(all)) {
    all[key] = value.sort(sortRoids)
  }

  return all;
}

function sortRoids(a,b) {
  return a.distance - b.distance;
}

function keySort(a,b) {
  let aQuad = a.substring(0,2);
  let aSlope = parseFloat(a.substring(2), 10);

  let bQuad = b.substring(0,2);
  let bSlope = parseFloat(b.substring(2), 10);

  if (aQuad == 'ru') {
    if (bQuad != 'ru') {
      return -1;
    } else {
      return aSlope - bSlope;
    }

  } else if (aQuad == 'rd') {
    if (bQuad == 'ru') {
      return 1;
    } else if (bQuad == 'rd') {
      return bSlope - aSlope;
    } else {
      return -1;
    }

  } else if (aQuad == 'ld') {
    if (bQuad == 'ru' || bQuad == 'rd') {
      return 1;
    } else if (bQuad == 'ld') {
      return aSlope - bSlope;
    } else {
      return -1;
    }

  } else {
    if (bQuad != 'lu') {
      return 1;
    } else {
      return bSlope - aSlope;
    }
  }
  throw Exception("Shouldn't get here");
}

parser.run({
/*
  data: `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`,
*/
  onLine: onLine,
  onEnd: onEnd,
  context: {best: {x:25, y: 31}, asteroids: [], row: -1}
});
