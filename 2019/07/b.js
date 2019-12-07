const parser = require('../../common/parser.js');

// Returns the mode (immediate or position) based on the position
function getMode(instruction, position) {
  const mode = Math.floor(instruction / Math.pow(10,position)) % 10;
  if (mode > 1 || mode < 0) {
    console.log('unknown mode', instruction, position, mode);
    process.exit(-1);
  }
  return mode;
}

// Reads a value from memory in the position
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

// Executes an instruction
// Updates the program based on the result
// Updates include the program ptr, if the program is awaiting input,
// if the program exited and the program output
function handleInstruction(instruction, program) {
  const opcode = instruction % 100;
  let memory = program.memory;
  switch (opcode) {
    // add
    case 1:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      b = getValue(memory, program.ptr+2, getMode(instruction,3));
      memory[memory[program.ptr+3]] = a + b;
      program.ptr += 4;
      break;

    // multiple
    case 2:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      b = getValue(memory, program.ptr+2, getMode(instruction,3));
      memory[memory[program.ptr+3]] = a * b;
      program.ptr += 4;
      break;

    // read input
    case 3:
      if (program.input.length == 0) {
        program.needsInput = true;
        return 2;
      }
      memory[memory[program.ptr+1]] = program.input.shift();
      program.ptr += 2;
      break;

    // write output
    case 4:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      program.output = a;
      program.ptr += 2;
      break;

    // jump if true
    case 5:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      b = getValue(memory, program.ptr+2, getMode(instruction,3));
      if (a != 0) {
        program.ptr = b;
      } else {
        program.ptr += 3;
      }
      break;

    // jump if false
    case 6:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      b = getValue(memory, program.ptr+2, getMode(instruction,3));
      if (a == 0) {
        program.ptr = b;
      } else {
        program.ptr += 3;
      }
      break;

    // less
    case 7:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      b = getValue(memory, program.ptr+2, getMode(instruction,3));
      memory[memory[program.ptr+3]] = a < b ? 1 : 0;
      program.ptr += 4;
      break;

    // equal
    case 8:
      a = getValue(memory, program.ptr+1, getMode(instruction,2));
      b = getValue(memory, program.ptr+2, getMode(instruction,3));
      memory[memory[program.ptr+3]] = a == b ? 1 : 0;
      program.ptr += 4;
      break;

    case 99:
      program.exit = true
      return;
    default:
      console.log("Unexpected opcode", opcode, program.ptr);
      return -1;
  }
}

// Executes instructions until the program finishes, needs input or provides output
function runProgram(program) {
  program.output = null;
  program.exit = null;
  program.needsInput = false;
  
  while (true) {
    const instruction = program.memory[program.ptr];
    handleInstruction(instruction, program);
    if (program.output || program.exit || program.needsInput) {
      return program.output;
    }
  }

}

// Gets a set of sequences and executes programs against them
// Finds the largest output
function onLine(program, context) {
  let max = 0;
  let sequences = [];
  getSequences([5,6,7,8,9], [], sequences);

  for (let i =0; i < sequences.length; i++) {
    runSequence(program, context, sequences[i]);
    max = Math.max(max, context.output);
  }

  console.log(max);
}

// Recursively creates an array of nums in all possible values
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

// Given a memory and a sequence returns a program for each member of the sequence
function loadPrograms(memory, sequence) {
  let programs = [];
  for (let j=0; j < sequence.length; j++) {
    programs.push({memory: memory.slice(), input: [sequence[j]], ptr: 0, id: sequence[j]});
  }
  return programs;
}

// Runs programs for each member of the sequence in order
// Exits if a program finishes, passes output to the next program in the
// sequence.  Waits for input if necessary.
function runSequence(memory, context, sequence) {
  let programs = loadPrograms(memory, sequence);

  context.output = 0;
  while (programs.length > 0) {
    let program = programs.shift();

    program.input.push(context.output);
    context.output = runProgram(program);

    // If the program didn't exit then return it to the queue
    if (!program.exit) {
      programs.push(program);

    // If the program did exit then pass its input as the output
    } else {
      context.output = program.input[0];
    }
  }
}

function onEnd(context) {
}

parser.run({
//  data:`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`,
//  data:`3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`,
  lineParser: 'commaIntLineParser',
  onLine: onLine,
  onEnd: onEnd,
  context: {}
});
