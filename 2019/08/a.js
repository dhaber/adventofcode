const parser = require('../../common/parser.js');

function getLayers(line, context) {
  let layerSize = context.height * context.width;
  let layer = null;
  let layers = [];
  for (let i=0; i < line.length; i++) {
    if (i % layerSize == 0) {
      if (layer != null) {
        layers.push(layer);
      }
      layer = {rows: []};
    }
    if (i % context.width == 0) {
      if (row )
    }

    let pixel = parseInt(line.charAt(i),10);
    layer.pixels.push(pixel);
    layer.zeros += pixel == 0 ? 1 : 0;
    layer.ones += pixel == 1 ? 1 : 0;
    layer.twos += pixel == 2 ? 1 : 0;
  }
  layers.push(layer);

  return layers;
}

function onLine(line, context) {
  let layers = getLayers(line, context);
  let minLayer = {zeros: 999999999};
  for (let i=0; i < layers.length; i++) {
    let layer = layers[i];
    if (layer.zeros < minLayer.zeros) {
      minLayer = layer;
    }
  }
  console.log(minLayer.ones * minLayer.twos);
}

function onEnd(context) {
}

parser.run({
  onLine: onLine,
  onEnd: onEnd,
  context: {width: 25, height: 6,}
});
