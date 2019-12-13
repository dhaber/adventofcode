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
  for (let i=0; i < context.steps; i++) {
    step(context.moons)
  }
  let energy = 0;
  for (let moon of context.moons) {
    energy += (
              Math.abs(moon.pos.x) +
              Math.abs(moon.pos.y) +
              Math.abs(moon.pos.z)
            ) *
            (
              Math.abs(moon.velocity.x) +
              Math.abs(moon.velocity.y) +
              Math.abs(moon.velocity.z)
            );
  }

  console.log(energy);

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
  lineParser: 'objectParser',
  onLine: onLine,
  onEnd: onEnd,
  context: {
    moons: [],
    steps: 1000,
    id: 1
  }
});
