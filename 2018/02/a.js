const parser = require('../../common/parser.js');

function onLine(line, context) {
  const map = {};
  for (let i=0; i < line.length; i++) {
    let char = line.charAt(i);
    if (map.hasOwnProperty(char)) {
      map[char] += 1;
    } else {
      map[char] = 1;
    }
  }

  let twos = false;
  let threes = false;

  for (const val of Object.values(map)) {
    twos = val === 2 ? true : twos;
    threes = val === 3 ? true : threes;
  }

  context.twos = twos ? context.twos + 1 : context.twos;
  context.threes = threes ? context.threes + 1 : context.threes;
}

function onEnd(context){
  console.log(context.twos * context.threes);
}

parser.run({
  onLine: onLine,
  context: {twos: 0, threes: 0},
  onEnd: onEnd
});
