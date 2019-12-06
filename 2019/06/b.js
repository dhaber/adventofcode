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

  context.satMap[satellite] = planet;
}

function onEnd(context) {
  let santaPath = [];
  getPath('SAN', context.satMap, santaPath);

  let myPath = [];
  getPath('YOU', context.satMap, myPath);

  calculate(santaPath, myPath);
}

function getPath(sat, satMap, arr) {
  const next = satMap[sat];
  if (!satMap[sat]) {
    return;
  }
  arr.push(next);
  return getPath(next, satMap, arr);

}

function calculate(santa, me) {
  let min = Math.min(santa.length, me.length);
  for (let i=0; i < min; i++) {
    let s = santa[santa.length - i - 1];
    let m = me[me.length - i - 1];
    if (s != m) {
      console.log('me',me.length - i);
      console.log('santa', santa.length - i);
      console.log('total', (me.length -i) + (santa.length -i));
      return;
    }
  }

}

parser.run({
  lineParser: lineParser,
  onLine: onLine,
  onEnd: onEnd,
  context: {map: {}, satMap: {}}
});
