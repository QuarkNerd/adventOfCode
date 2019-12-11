const input =
  "3,8,1005,8,310,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,1002,8,1,28,1,105,11,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,55,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,76,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,102,1,8,98,1,1004,7,10,1006,0,60,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,127,2,1102,4,10,1,1108,7,10,2,1102,4,10,2,101,18,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,166,1006,0,28,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,101,0,8,190,1006,0,91,1,1108,5,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1002,8,1,220,1,1009,14,10,2,1103,19,10,2,1102,9,10,2,1007,4,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,258,2,3,0,10,1006,0,4,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,1001,8,0,286,1006,0,82,101,1,9,9,1007,9,1057,10,1005,10,15,99,109,632,104,0,104,1,21102,1,838479487636,1,21102,327,1,0,1106,0,431,21102,1,932813579156,1,21102,1,338,0,1106,0,431,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,0,179318033447,1,21101,385,0,0,1105,1,431,21101,248037678275,0,1,21101,0,396,0,1105,1,431,3,10,104,0,104,0,3,10,104,0,104,0,21101,0,709496558348,1,21102,419,1,0,1105,1,431,21101,825544561408,0,1,21101,0,430,0,1106,0,431,99,109,2,22101,0,-1,1,21101,40,0,2,21102,462,1,3,21101,0,452,0,1106,0,495,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,457,458,473,4,0,1001,457,1,457,108,4,457,10,1006,10,489,1101,0,0,457,109,-2,2106,0,0,0,109,4,2101,0,-1,494,1207,-3,0,10,1006,10,512,21101,0,0,-3,22101,0,-3,1,22101,0,-2,2,21101,1,0,3,21102,531,1,0,1105,1,536,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,559,2207,-4,-2,10,1006,10,559,22101,0,-4,-4,1106,0,627,21202,-4,1,1,21201,-3,-1,2,21202,-2,2,3,21102,578,1,0,1105,1,536,22101,0,1,-4,21101,1,0,-1,2207,-4,-2,10,1006,10,597,21102,0,1,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,619,21201,-1,0,1,21102,1,619,0,105,1,494,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2106,0,0";
const B = input.split(",");
const intcode = B.map(entry => parseInt(entry));
let relativeBase = 0;

function solvePartOne() {
  const robot = returnARobot(0);
  computeAlarm(intcode, robot.getColour, robot.onInput);
  console.log(Object.values(robot.colourHash).length);
}

function solvePartTwo() {
  const robot = returnARobot(1);
  computeAlarm(intcode, robot.getColour, robot.onInput);
  const height = robot.limits.y.max - robot.limits.y.min + 1;
  const width = robot.limits.x.max - robot.limits.x.min + 1;
  const image = Array.apply(null, Array(height)).map(() =>
    Array(width).fill(1)
  );
  const coloursArray = Object.entries(robot.colourHash);
  for (let i = 0; i < coloursArray.length; i++) {
    const coor = coloursArray[i][0].split(",");
    image[parseInt(coor[1]) + robot.limits.y.min][
      parseInt(coor[0]) + robot.limits.x.min
    ] = coloursArray[i][1];
  }
  console.log(
    image
      .join("\n")
      .replace(/,/g, "")
      .replace(/0/g, " ")
  );
}

solvePartOne();
solvePartTwo();

// Put in a function to leverage hoisting -not the nicest way chnage it to import
function returnARobot(startValue) {
  class Robot {
    constructor(startValue) {
      this.colourHash = {};
      this.position = { x: 0, y: 0 };
      this.nextInputIsColour = true;
      this.direction = 0; // from up clockwise 0 1 2 3. Right-down is positive axis
      this.startValue = startValue;
      this.limits = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    }

    onInput = input => {
      if (this.nextInputIsColour) {
        this.colourHash[this.getPositionHashKey()] = input;
      } else {
        this.move(input);
      }
      this.nextInputIsColour = !this.nextInputIsColour;
    };

    move = input => {
      if (input === 0) {
        this.direction = (this.direction + 3) % 4;
      } else if (input === 1) {
        this.direction = (this.direction + 1) % 4;
      } else {
        console.log("ERROR");
      }
      let x = this.position.x;
      let y = this.position.y;
      switch (this.direction) {
        case 0:
          y = y - 1;
          break;
        case 1:
          x = x + 1;
          break;
        case 2:
          y = y + 1;
          break;
        case 3:
          x = x - 1;
          break;
      }
      this.position = { x, y };
      this.limits = {
        x: {
          min: Math.min(x, this.limits.x.min),
          max: Math.max(x, this.limits.x.max),
        },
        y: {
          min: Math.min(y, this.limits.y.min),
          max: Math.max(y, this.limits.y.max),
        },
      };
    };

    getColour = () => {
      const colour = this.colourHash[this.getPositionHashKey()];
      return colour != undefined ? colour : this.startValue;
    };

    getPositionHashKey = () => {
      return [this.position.x, this.position.y].join(",");
    };
  }
  return new Robot(startValue);
}

function computeAlarm(intcode, getInput, output) {
  let C = [...intcode];
  let i = 0;
  let leave;
  let opcode;
  let instruction;
  let parameterModes = { 1: undefined, 2: undefined };
  while (i < C.length) {
    instruction = C[i];
    leave = false;
    opcode = instruction % 100;
    parameterModes = {
      1: parseInt(instruction / 100) % 10,
      2: parseInt(instruction / 1000) % 10,
      3: parseInt(instruction / 10000) % 10,
    };
    let value;
    switch (opcode) {
      case 1:
        value =
          getValue(C, i + 1, parameterModes[1]) +
          getValue(C, i + 2, parameterModes[2]);
        setValue(C, value, i + 3, parameterModes[3]);
        i += 4;
        break;
      case 2:
        value =
          getValue(C, i + 1, parameterModes[1]) *
          getValue(C, i + 2, parameterModes[2]);
        setValue(C, value, i + 3, parameterModes[3]);
        i += 4;
        break;
      case 3:
        setValue(C, getInput(), i + 1, parameterModes[1]);
        i += 2;
        break;
      case 4:
        output(getValue(C, i + 1, parameterModes[1]));
        i += 2;
        break;
      case 5:
        if (getValue(C, i + 1, parameterModes[1]) !== 0) {
          i = getValue(C, i + 2, parameterModes[2]);
        } else {
          i += 3;
        }
        break;
      case 6:
        if (getValue(C, i + 1, parameterModes[1]) === 0) {
          i = getValue(C, i + 2, parameterModes[2]);
        } else {
          i += 3;
        }
        break;
      case 7:
        if (
          getValue(C, i + 1, parameterModes[1]) <
          getValue(C, i + 2, parameterModes[2])
        ) {
          value = 1;
        } else {
          value = 0;
        }
        setValue(C, value, i + 3, parameterModes[3]);
        i += 4;
        break;
      case 8:
        if (
          getValue(C, i + 1, parameterModes[1]) ==
          getValue(C, i + 2, parameterModes[2])
        ) {
          value = 1;
        } else {
          value = 0;
        }
        setValue(C, value, i + 3, parameterModes[3]);
        i += 4;
        break;
      case 9:
        relativeBase += getValue(C, i + 1, parameterModes[1]);
        i += 2;
        break;
      case 99:
        console.log("halt");
        leave = true;
        break;
      // default:
    }
    if (leave) {
      break;
    }
  }
  return C;
}
function getValue(intcode, ID, parameterMode) {
  let value;
  if (parameterMode == 0) {
    value = intcode[intcode[ID]];
  } else if (parameterMode == 1) {
    value = intcode[ID];
  } else if (parameterMode == 2) {
    value = intcode[intcode[ID] + relativeBase];
  } else {
    console.log("error", ID, parameterMode);
  }
  return value == undefined ? 0 : value;
}
function setValue(intcode, value, ID, parameterMode) {
  if (parameterMode == 0) {
    intcode[intcode[ID]] = value;
  } else if (parameterMode == 2) {
    intcode[intcode[ID] + relativeBase] = value;
  } else {
    console.log("error", ID, parameterMode);
  }
}
