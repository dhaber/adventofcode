const parser = require('../../common/parser.js');

function onLine(line, context) {
  let layers = getLayers(line, context);

  let outLayer = [];
  for (let i=0; i < context.height; i++) {
    let row = [];
    for (let j=0; j < context.width; j++) {
      row.push(-1);
    }
    outLayer.push(row);
  }


  for (let i=0; i < layers.length; i++) {
    let layer = layers[i];
    for (let row=0; row < layer.rows.length; row++) {
      for (let pixel = 0; pixel < layer.rows[row].length; pixel++) {
        if (outLayer[row][pixel] == -1 && layer.rows[row][pixel] != 2) {
          outLayer[row][pixel] = layer.rows[row][pixel];
        }
      }
    }
//    console.log(layers[i].rows)
  }
  console.log(outLayer);
  return;

}

function getLayers(line, context) {
  let layers = [];
  for (let i=0; i < line.length; i += context.height * context.width) {
    layers.push(getLayer(line, i, context.height, context.width));
  }
  return layers;
}

function getLayer(line, start, height, width) {
  let layer = {rows: []}
  for (let i=start; i < start + (height*width); i += width) {
    layer.rows.push(getRow(line, i, width));
  }
  return layer;
}

function getRow(line, start, width) {
  let row = [];
  for (let i=start; i < start + width; i++) {
    row.push(parseInt(line.charAt(i)));
  }
  return row;
}


function onEnd(context) {
}

parser.run({
//  data: `0222112222120000`,
  onLine: onLine,
  onEnd: onEnd,
  context: {width: 25, height: 6,}
//  context: {width: 2, height: 2,}
});
