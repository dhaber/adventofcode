const parser = require('../../common/parser.js');

// Returns the mode (immediate or position) based on the position
function getMode(instruction, position) {
  const mode = Math.floor(instruction / Math.pow(10,position)) % 10;
  return mode;
}

// returns the position - doesn't read the actual value
function getPosition(memory, position, mode, relativeBase) {
  let value = undefined;
  // position mode
  if (mode == 0) {
    return memory[position];

  // immediate mode;
  } else if (mode == 1) {
    return position;

  // relative mode
  } else if (mode == 2){
    return relativeBase + memory[position];

  } else {
    throw new Error("Unexpected mode", mode);
  }
}

// Reads a value from memory in the position
function getValue(memory, position, mode, relativeBase) {
  let value = memory[getPosition(memory, position, mode, relativeBase)];

  if (value == undefined) {
    throw new Error(`Undefined value ${position}, ${mode}, ${relativeBase}`);
  }

  return value;
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
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      b = getValue(memory, program.ptr+2, getMode(instruction,3), program.relativeBase);
      writePosition = getPosition(memory, program.ptr+3, getMode(instruction, 4), program.relativeBase);

      memory[writePosition] = a + b;

      program.ptr += 4;
      break;

    // multiple
    case 2:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      b = getValue(memory, program.ptr+2, getMode(instruction,3), program.relativeBase);
      writePosition = getPosition(memory, program.ptr+3, getMode(instruction, 4), program.relativeBase);

      memory[writePosition] = a * b;
      program.ptr += 4;
      break;

    // read input
    case 3:
      if (program.input.length == 0) {
        program.needsInput = true;
        return 2;
      }
      writePosition = getPosition(memory, program.ptr+1, getMode(instruction, 2), program.relativeBase);

      memory[writePosition] = program.input.shift()
      program.ptr += 2;
      break;

    // write output
    case 4:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      program.output = a;
      program.ptr += 2;
      break;

    // jump if true
    case 5:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      b = getValue(memory, program.ptr+2, getMode(instruction,3), program.relativeBase);
      if (a != 0) {
        program.ptr = b;
      } else {
        program.ptr += 3;
      }
      break;

    // jump if false
    case 6:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      b = getValue(memory, program.ptr+2, getMode(instruction,3), program.relativeBase);
      if (a == 0) {
        program.ptr = b;
      } else {
        program.ptr += 3;
      }
      break;

    // less
    case 7:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      b = getValue(memory, program.ptr+2, getMode(instruction,3), program.relativeBase);
      writePosition = getPosition(memory, program.ptr+3, getMode(instruction, 4), program.relativeBase);
      memory[writePosition] = a < b ? 1 : 0;
      program.ptr += 4;
      break;

    // equal
    case 8:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      b = getValue(memory, program.ptr+2, getMode(instruction,3), program.relativeBase);
      writePosition = getPosition(memory, program.ptr+3, getMode(instruction, 4), program.relativeBase);

      memory[writePosition] = a == b ? 1 : 0;
      program.ptr += 4;
      break;

    case 9:
      a = getValue(memory, program.ptr+1, getMode(instruction,2), program.relativeBase);
      program.relativeBase += a;
      program.ptr += 2;
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
    if (program.output != null) {
      console.log(program.output);
      program.output = null;

    } else if (program.needsInput) {
      console.log("input");
      return;

    } else if (program.exit) {
      console.log("exit");
      return;
    }
  }

}

// Gets a set of sequences and executes programs against them
// Finds the largest output
function onLine(program, context) {
  const memory = program.slice()
  // Initialize memory
  for (let i=memory.length; i < 10000; i++) {
    memory[i] = 0;
  }

  runProgram({
    memory: memory,
    relativeBase: 0,
    input: [context.input],
    ptr: 0,
    id: 1,
  });

  console.log("done");
}

function onEnd(context) {
}

parser.run({
//  data: `109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`,
//  data: `1102,34915192,34915192,7,4,7,99,0`,
//  data: `104,1125899906842624,99`,
  lineParser: 'commaIntLineParser',
  onLine: onLine,
  onEnd: onEnd,
  context: {input: parseInt(process.argv[2],10) || -1}
});
