const parser = require('../../common/parser.js');

function callback(memory, context) {
  memory[1] = 12;
  memory [2] = 2;

  for (let i =0; i < memory.length; i+=4) {
    const opcode = memory[i];
    switch (opcode) {
      case 1:
        memory[memory[i+3]] = memory[memory[i+1]] + memory[memory[i+2]];
        break;
      case 2:
        memory[memory[i+3]] = memory[memory[i+1]] * memory[memory[i+2]];
        break;
      case 99:
        context.output = memory[0];
        return false;
      default:
        console.log("Unexpected opcode", opcode, i, memory);
        return false;
    }
  }
}

parser.run({
  lineParser: 'commaIntLineParser',
  onLine: callback
});
