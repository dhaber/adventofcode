const parser = require('../../common/parser.js');
const ctx = require('axel')

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
        program.onInput(program);
        if (program.input.length == 0) {
          throw Error("No input received");
        }
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
      program.onOutput(program.output);
      program.output = null;

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

  // add quarters
  memory[0] = 2;

  runProgram({
    memory: memory,
    relativeBase: 0,
    input: [],
    onInput: getInput.bind(this, context),
    onOutput: onOutput.bind(this, context),
    ptr: 0,
    id: 1,
  });

//  console.log("done");
  process.exit(0);
}

function getInput(context, program) {
  // Add a delay per input to be able to watch
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + 5) {
      ;
  }

  if (context.ball[0] > context.paddle[0]) {
    program.input.push(1);

  } else if (context.ball[0] < context.paddle[0]) {
    program.input.push(-1);

  } else {
    program.input.push(0);
  }
}

function onOutput(context, value) {
  let instruction = context.instruction;
  instruction.push(value);
  if (instruction.length == 3) {
    if (value == 3) {
      context.paddle = instruction;
    }
    if (value == 4) {
      context.ball = instruction;
    }
    draw(instruction);
    context.instruction = [];
  }
}

function draw(instruction) {
  const x = instruction[0];
  const y = instruction[1];
  const id = instruction[2];

  // Put score in the top left
  if (x == -1 && y == 0) {
    ctx.text(1,2,id + '');

  // Shift everything else over slightly
  } else {
    ctx.text(x+1,y+3,getText(id));
  }
}

function getText(id) {
  if (id == 0) {
    return ' ';
  } else if (id == 1) {
    return '@';
  } else if (id == 2) {
    return '#';
  } else if (id == 3) {
    return '_';
  } else if (id == 4) {
    return '*';
  } else {
    throw Error("unknown id");
  }
}

function onEnd(context) {
}

parser.run({
  lineParser: 'commaIntLineParser',
  onLine: onLine,
  onEnd: onEnd,
  context: {
    instruction: [],
    input: []
  }
});
