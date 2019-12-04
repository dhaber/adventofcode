const parser = require('../../common/parser.js');

function onEnd(context) {
  let count = 0;
  for (let i=context.start; i <= context.end; i++) {
    let last = -1;
    let increase = true;
    let dupes = {};
    let currentDupe = 0;
    for (let j=5; j >= 0; j--) {
      const val = Math.floor(i / Math.pow(10,j)) % 10;
      if (val == last) {
        currentDupe += 1;
        dupes[val] = (currentDupe == 1)
      } else if (val < last) {
        increase = false;
        break;
      } else {
        currentDupe = 0;
      }
      last = val;
    }
    if (increase && Object.values(dupes).reduce((all,i) => all || i, false)) {
      console.log(i);
      count += 1;
    }
  }
  console.log(count);
}

parser.run({
  data: ' ',
  onEnd: onEnd,
  context: {start:172930, end:683082}
//  context: {start:122444, end:122446}
});
