const parser = require('../../common/parser.js');

function run(memory) {
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
        return memory[0];
      default:
        console.log("Unexpected opcode", opcode, i);
        return -1;
    }
  }
}

function callback(defaultMemory, context) {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const memory = defaultMemory.slice();
      memory[1] = noun;
      memory[2] = verb;
      const result = run(memory);
      if (result == 19690720) {
        context.output = 100 * noun + verb;
        return;
      }
    }
  }
  console.log("could not find result");
}

parser.run({
  lineParser: 'commaIntLineParser',
  onLine: callback
});
