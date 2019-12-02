const parser = require('../../common/parser.js');

function onData(lines) {
  const sorted = lines.sort();

  for (let i=0; i < sorted.length -1; i++) {
    const first = sorted[i];
    const second = sorted[i+1];
    let misses = 0;
    for (let j=0; j < first.length; j++) {
      if (first[j] != second[j]) {
        misses += 1;
      }
      if (misses > 1) {
        break;
      }
    }
    if (misses == 1) {
      console.log(first);
      console.log(second);
      break;
    }
  }

}
parser.run({
  onData: onData
});
