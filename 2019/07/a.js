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
        memory[memory[i+1]] = context.input.shift();
        i += 2;
        break;

      // write output
      case 4:
        a = getValue(memory, i+1, getMode(instruction,2));
        context.output = a;
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

function onLine(program, context) {
  let max = 0;
  let sequences = [];
  getSequences([0,1,2,3,4], [], sequences);

  for (let i =0; i < sequences.length; i++) {
    runSequence(program, context, sequences[i]);
    max = Math.max(max, context.output);
  }

  console.log(max);
}

function getSequences(nums, arr, output) {
  if (nums.length == 0) {
    output.push(arr);
    return;
  }

  for (let i=0; i < nums.length; i++){
    let subArr = arr.slice();
    subArr.push(nums[i]);

    let subNums = nums.slice();
    subNums.splice(i,1);
    getSequences(subNums, subArr, output);
  }
}

function runSequence(program, context, sequence) {
  context.output = 0;
  for (let i=0; i < sequence.length; i++) {
    context.input = [sequence[i],context.output];
    run(program.slice(),context);
  }
}

function onEnd(context) {
}

parser.run({
//  data:`3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`,
  lineParser: 'commaIntLineParser',
  onLine: onLine,
  onEnd: onEnd,
  context: {}
});
