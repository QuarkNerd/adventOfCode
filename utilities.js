function computeIntcode(intcode, getInput, output) {
  let C = intcode;
  let relativeBase = 0;
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
      3: parseInt(instruction / 10000) % 10
    };
    let value;
    switch (opcode) {
      case 1:
        value =
          getValue(C, i + 1, parameterModes[1], relativeBase) +
          getValue(C, i + 2, parameterModes[2], relativeBase);
        setValue(C, value, i + 3, parameterModes[3], relativeBase);
        i += 4;
        break;
      case 2:
        value =
          getValue(C, i + 1, parameterModes[1], relativeBase) *
          getValue(C, i + 2, parameterModes[2], relativeBase);
        setValue(C, value, i + 3, parameterModes[3], relativeBase);
        i += 4;
        break;
      case 3:
        setValue(C, getInput(), i + 1, parameterModes[1], relativeBase);
        i += 2;
        break;
      case 4:
        output(getValue(C, i + 1, parameterModes[1], relativeBase));
        i += 2;
        break;
      case 5:
        if (getValue(C, i + 1, parameterModes[1], relativeBase) !== 0) {
          i = getValue(C, i + 2, parameterModes[2], relativeBase);
        } else {
          i += 3;
        }
        break;
      case 6:
        if (getValue(C, i + 1, parameterModes[1], relativeBase) === 0) {
          i = getValue(C, i + 2, parameterModes[2], relativeBase);
        } else {
          i += 3;
        }
        break;
      case 7:
        if (
          getValue(C, i + 1, parameterModes[1], relativeBase) <
          getValue(C, i + 2, parameterModes[2], relativeBase)
        ) {
          value = 1;
        } else {
          value = 0;
        }
        setValue(C, value, i + 3, parameterModes[3], relativeBase);
        i += 4;
        break;
      case 8:
        if (
          getValue(C, i + 1, parameterModes[1], relativeBase) ==
          getValue(C, i + 2, parameterModes[2], relativeBase)
        ) {
          value = 1;
        } else {
          value = 0;
        }
        setValue(C, value, i + 3, parameterModes[3], relativeBase);
        i += 4;
        break;
      case 9:
        relativeBase += getValue(C, i + 1, parameterModes[1], relativeBase);
        i += 2;
        break;
      case 99:
        console.log("halt");
        leave = true;
        break;
      default:
        console.log("Default");
    }
    if (leave) {
      break;
    }
  }
  return C;
}

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
        max: Math.max(x, this.limits.x.max)
      },
      y: {
        min: Math.min(y, this.limits.y.min),
        max: Math.max(y, this.limits.y.max)
      }
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

class Arcade {
  constructor() {
    this.gridHash = {};
    this.currentInstruction = [];
    this.tileCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  }

  setInstruction = input => {
    if (this.currentInstruction.length < 2) {
      this.currentInstruction.push(input);
    } else {
      this.drawTile(
        this.currentInstruction[0],
        this.currentInstruction[1],
        input
      );
      this.currentInstruction = [];
    }
  };

  drawTile = (x, y, tile) => {
    this.gridHash[`${x},${y}`] = tile;
    this.tileCount[tile] += 1;
  };
}

function getValue(intcode, ID, parameterMode, relativeBase) {
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
function setValue(intcode, value, ID, parameterMode, relativeBase) {
  if (parameterMode == 0) {
    intcode[intcode[ID]] = value;
  } else if (parameterMode == 2) {
    intcode[intcode[ID] + relativeBase] = value;
  } else {
    console.log("error", ID, parameterMode);
  }
}

module.exports = { computeIntcode, Robot, Arcade };
