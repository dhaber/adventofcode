const parser = require('../../common/parser.js');

function onLine(line, context) {
  let moon = {
    id: context.id++,
    pos: {
      x: parseInt(line.x, 10),
      y: parseInt(line.y, 10),
      z: parseInt(line.z, 10)
    },
    velocity: {
        x: 0,
        y: 0,
        z: 0
    }
  };

  context.moons.push(moon);
}

function onEnd(context) {
  const initial = JSON.parse(JSON.stringify(context.moons));
  let i = 1;
  let x = 0;
  let y = 0;
  let z = 0;
  while (x == 0 || y == 0 || z == 0) {
    i++;
    step(context.moons)
    if (x == 0 && check(initial, context.moons, 'x')) {
      x = i;
    }
    if (y == 0 && check(initial, context.moons, 'y')) {
      y = i;
    }
    if (z == 0 && check(initial, context.moons, 'z')) {
      z = i;
    }
  }
  let min = lcm(x,y);
  min = lcm(min, z);

  console.log(min);
}

function check(initial, current, key) {
  for (let i=0; i < initial.length; i++) {
    if (initial[i]['pos'][key] != current[i]['pos'][key]) {
      return false;
    }
  }
  return true;
}

// Least common multiple from stack overflow
function lcm(a,b) {
  return a * b / gcd(a,b);
}

// greatest common divisor from stack overflow
function gcd(a,b) {
  return a ? gcd(b % a, a) : b;
}

function step(moons) {
  for (let i=0; i < moons.length; i++) {
    let current = moons[i];
    for (let j=i+1; j < moons.length; j++) {
      let other = moons[j];
      updateGravities(current, other);
    }
  }
  for (let i=0; i < moons.length; i++) {
    updateVelocity(moons[i]);
  }
}

function updateGravities(current, other) {
  updateGravity(current, other, 'x');
  updateGravity(current, other, 'y');
  updateGravity(current, other, 'z');
}

function updateGravity(current, other, key) {
  let diff = current['pos'][key] - other['pos'][key]
  if (diff < 0) {
    current['velocity'][key] += 1;
    other['velocity'][key] -= 1;
  } else if (diff > 0) {
    current['velocity'][key] -= 1;
    other['velocity'][key] += 1;
  }
}

function updateVelocity(moon) {
  moon.pos.x += moon.velocity.x;
  moon.pos.y += moon.velocity.y;
  moon.pos.z += moon.velocity.z;
}

parser.run({
  /*
  data: `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`,
 data: `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`,
*/
  lineParser: 'objectParser',
  onLine: onLine,
  onEnd: onEnd,
  context: {
    moons: [],
    id: 1
  }
});
