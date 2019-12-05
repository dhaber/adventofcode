const parser = require('../../common/parser.js');

function getMode(instruction, position) {
  const mode = Math.floor(instruction / Math.pow(10,position)) % 10;
  if (mode > 1 || mode < 0) {
    console.log('unknown mode', instruction, position, mode);
    process.exit(-1);
  }
  return mode;
}

function getValue(memory, position, mode) {
  // position mode
  if (mode == 0) {
    return memory[memory[position]];

  // immediate mode;
  } else if (mode == 1) {
    return memory[position];
  }
  throw new Error("Unexpected mode");
}


function run(memory, context) {
  for (let i =0; i < memory.length; ) {
    const instruction = memory[i];
    const opcode = instruction % 100;
    switch (opcode) {
      // add
      case 1:
        a = getValue(memory, i+1, getMode(instruction,2));
        b = getValue(memory, i+2, getMode(instruction,3));
        memory[memory[i+3]] = a + b;
        i += 4;
        break;
      // multiple
      case 2:
        a = getValue(memory, i+1, getMode(instruction,2));
        b = getValue(memory, i+2, getMode(instruction,3));
        memory[memory[i+3]] = a * b;
        i += 4;
        break;

      // read input
      case 3:
        memory[memory[i+1]] = context.input;
        i += 2;
        break;

      // write output
      case 4:
        a = getValue(memory, i+1, getMode(instruction,2));
        console.log(a);
        i += 2;
        break;

      // jump if true
      case 5:
        a = getValue(memory, i+1, getMode(instruction,2));
        b = getValue(memory, i+2, getMode(instruction,3));
        if (a != 0) {
          i = b;
        } else {
          i += 3;
        }
        break;

      // jump if false
      case 6:
        a = getValue(memory, i+1, getMode(instruction,2));
        b = getValue(memory, i+2, getMode(instruction,3));
        if (a == 0) {
          i = b;
        } else {
          i += 3;
        }
        break;

      // less
      case 7:
        a = getValue(memory, i+1, getMode(instruction,2));
        b = getValue(memory, i+2, getMode(instruction,3));
        memory[memory[i+3]] = a < b ? 1 : 0;
        i += 4;
        break;

      // equal
      case 8:
        a = getValue(memory, i+1, getMode(instruction,2));
        b = getValue(memory, i+2, getMode(instruction,3));
        memory[memory[i+3]] = a == b ? 1 : 0;
        i += 4;
        break;

      case 99:
        return memory[0];
      default:
        console.log("Unexpected opcode", opcode, i);
        return -1;
    }
  }
}

parser.run({
//  data: '1002,4,3,4,33',
//  data: '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99',
  lineParser: 'commaIntLineParser',
  onLine: run,
  context: {input: 5}
});
