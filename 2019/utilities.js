function computeIntcode(intcode, getInput, output, runAutomatically = true) {
  let C = intcode;
  let relativeBase = 0;
  let i = 0;
  let leave;
  let opcode;
  let instruction;
  let parameterModes = { 1: undefined, 2: undefined };

  if (!runAutomatically) return step;

  let cont = true;
  while (cont) {
    cont = step();
  }

  return C;

  function step() {
    if (i >= C.length) return false;
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
        // console.log("halt");
        leave = true;
        break;
      default:
        throw new Error("invalid code");
    }
    return !leave
  }
}

// Some of these classes can probably inherit some grid functionality and drawing functionality
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

  draw = () => {
    console.log(
      getImagefromGridHash(this.colourHash, this.limits, 0, [["0", " "]])
    );
  };
}

class Arcade {
  constructor() {
    this.gridHash = {};
    this.currentInstruction = [];
    this.tileCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    this.limits = { x: { max: 0, min: 0 }, y: { max: 0, min: 0 } };
    this.paddle = { x: undefined, y: undefined };
    this.ball = { x: undefined, y: undefined };
  }

  setInstruction = input => {
    if (this.currentInstruction.length < 2) {
      this.currentInstruction.push(input);
    } else {
      const coor = {
        x: this.currentInstruction[0],
        y: this.currentInstruction[1]
      };
      this.currentInstruction = [];
      if (coor.x == -1 && coor.y == 0) {
        this.score = input;
        return;
      }

      this.setTile(coor, input);
      if (input == 3) this.paddle = coor;
      else if (input == 4) this.ball = coor;
    }
  };

  setTile = (coor, tile) => {
    this.gridHash[`${coor.x},${coor.y}`] = tile;
    this.tileCount[tile] += 1;
    ["x", "y"].forEach(dim => {
      this.limits[dim] = {
        min: Math.min(this.limits[dim].min, coor[dim]),
        max: Math.max(this.limits[dim].max, coor[dim])
      };
    });
  };

  getInput = () => {
    return Math.sign(this.ball.x - this.paddle.x);
  };

  draw = () => {
    console.log(
      getImagefromGridHash(this.gridHash, this.limits, 0, [
        ["0", " "],
        ["1", "#"],
        ["2", "O"],
        ["3", "_"],
        ["4", "+"]
      ])
    );
  };
}

class VacumnBot {
  constructor() {
    this.currentLine = [];
    this.grid = [this.currentLine];
    this.nodeConnections = [];
  }

  UP = { x: 0, y: -1 };
  RIGHT = { x: 1, y: 0 };
  DOWN = { x: 0, y: 1 };
  LEFT = { x: -1, y: 0 };

  DIRECTIONS = [this.UP, this.RIGHT, this.DOWN, this.LEFT];

  setGridTile = (input) => {
    const char = String.fromCharCode(input);
    if (char === "\n") {
      this.currentLine = [];
      this.grid.push(this.currentLine);
    } else {
      this.currentLine.push(char);
    }
  };

  draw = () => {
    console.log(this.grid.join("\n").replace(/,/g, ""));
  };

  getPath = () => {
    this.parseGrid();
    const positionArray = this.robotStart.split(",");
    const currentPos = { x: parseInt(positionArray[0]), y: parseInt(positionArray[1]) };
    const arrow = this.grid[currentPos.y][currentPos.x];
    let currentDirectionIndex;

    switch (arrow) {
      case "^":
        currentDirectionIndex = 0;
        break;
      case ">":
        currentDirectionIndex = 1;
        break;
      case "v":
        currentDirectionIndex = 2;
        break;
      case "<":
        currentDirectionIndex = 3;
        break;
      default:
        throw new Error("Bad robot code", arrow);
    }

    const path = [];
    let pathEnded = false;

    const backwardsIndex = (currentDirectionIndex + 2) % 4;

    // This check should only be done once, because we should never
    // turn backwards later
    if (
      this.isScaffold(
        currentPos.x + this.DIRECTIONS[backwardsIndex].x,
        currentPos.y + this.DIRECTIONS[backwardsIndex].y
      )
    ) {
      currentDirectionIndex = backwardsIndex;
      path.push("R");
      path.push("R");
    }

    while (!pathEnded) {
      let steps = 0;

      while (
        this.isScaffold(
          currentPos.x + this.DIRECTIONS[currentDirectionIndex].x,
          currentPos.y + this.DIRECTIONS[currentDirectionIndex].y
        )
      ) {
        steps += 1;
        (currentPos.x =
          currentPos.x + this.DIRECTIONS[currentDirectionIndex].x),
          (currentPos.y =
            currentPos.y + this.DIRECTIONS[currentDirectionIndex].y);
      }

      if (steps > 0) path.push(steps);

      const relRight = (currentDirectionIndex + 1) % 4; // relativeRight
      const relLeft = (currentDirectionIndex + 3) % 4;
      if (
        this.isScaffold(
          currentPos.x + this.DIRECTIONS[relRight].x,
          currentPos.y + this.DIRECTIONS[relRight].y
        )
      ) {
        currentDirectionIndex = relRight;
        path.push("R");
      } else if (
        this.isScaffold(
          currentPos.x + this.DIRECTIONS[relLeft].x,
          currentPos.y + this.DIRECTIONS[relLeft].y
        )
      ) {
        currentDirectionIndex = relLeft;
        path.push("L");
      } else {
        pathEnded = true;
      }
    }
  
    return path;
  };

  parseGrid = () => {
    const height = this.grid.length;
    const width = this.grid[0].length;

    let nodeConnections = {};
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (this.isScaffold(x, y)) {
          // refaactor to use up down left right
          const possibleConnections = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 },
          ];
          const actualConnections = possibleConnections.filter((coor) =>
            this.isScaffold(coor.x, coor.y)
          );
          nodeConnections[`${x},${y}`] = actualConnections.map(
            ({ x, y }) => `${x},${y}`
          );

          if (this.isBot(x, y)) this.robotStart = `${x},${y}`;
        }
      }
    }
    this.nodeConnections = nodeConnections;
  };

  getSumAllignParam = () => {
    this.parseGrid();
    let sum = 0;
    Object.entries(this.nodeConnections).forEach(([coor, connections]) => {
      if (connections.length === 4) {
        const [x, y] = coor.split(",");
        sum += x * y;
      }
    });
    return sum;
  };

  isScaffold = (x, y) => {
    const grid = this.grid;
    const isBotFunc = this.isBot;
    return x >= 0 && y >= 0 && 
      x <= this.grid[0].length && 
      y <= this.grid.length && 
      (grid[y][x] === "#" || isBotFunc(x, y));
  };

  isBot = (x, y) => {
    return ["<", ">", "v", "^"].indexOf(this.grid[y][x]) !== -1;
  };
}

class SpringDroid {
  constructor(instructions) {
    this.currentMessage = "";
    this.instructionGenerator = generateFromArray(
      instructions
        .join("\n")
        .split("")
        .map(a => a.charCodeAt(0))
    );
  }

  provideIntcodeInput = () => {
    return this.instructionGenerator.next().value;
  };

  onIntcodeOutput = code => {
    if (code > 127) console.log(code);
    const char = String.fromCharCode(code);
    if (char === "\n") {
      console.log(this.currentMessage);
      this.currentMessage = "";
    } else {
      this.currentMessage = this.currentMessage + char;
    }
  };
}

class RepairDroid {
  constructor() {
    this.graph = {
      "0,0": {
        connectedNodes: [],
        directionToThis: null,
        directionsLeftToVisit: [1, 2, 3, 4]
      }
    };
    this.currentPos = { x: 0, y: 0 };
    this.lastDirection = null;
    this.wasLastMovementReversal = false;
    this.oxygenCoorHash = null;
  }

  onIntcodeInputRequest = () => {
    const posDetails = this.graph[this.getCurrentPosHashKey()];
    const directionsLeft = posDetails.directionsLeftToVisit;
    let newPos;
    let direction;
    while (directionsLeft.length !== 0) {
      direction = directionsLeft.pop();
      newPos = this.getNewPos(direction);
      if (this.graph[this.getPosHashKey(newPos)] === undefined) {
        this.lastDirection = direction;
        this.wasLastMovementReversal = false;
        return direction;
      } else {
        posDetails.connectedNodes.push(getPosHashKey(newPos));
      }
    }
    if (this.currentPos.x !== 0 || this.currentPos.y !== 0) {
      this.lastDirection = this.getOppositeDirection(
        posDetails.directionToThis
      );
      this.wasLastMovementReversal = true;
      return this.lastDirection;
    }
  };

  onIntcodeOutput = output => {
    if (output === 1 || output === 2) {
      this.move(this.lastDirection);
    }
    if (output === 2) this.oxygenCoorHash = this.getCurrentPosHashKey();
  };

  move = direction => {
    const newPos = this.getNewPos(direction);
    const newPosHash = this.getPosHashKey(newPos);
    if (!this.wasLastMovementReversal) {
      this.graph[newPosHash] = this.createNewNodeInfo(direction);
      this.graph[this.getCurrentPosHashKey()].connectedNodes.push(newPosHash);
    }
    this.currentPos = newPos;
  };

  getCurrentPosHashKey = () => {
    return this.getPosHashKey({ x: this.currentPos.x, y: this.currentPos.y });
  };

  createNewNodeInfo = direction => {
    const reverseDirection = this.getOppositeDirection(direction);
    const directionsToTry = [1, 2, 3, 4];
    directionsToTry.splice(directionsToTry.indexOf(reverseDirection), 1);
    return {
      connectedNodes: [this.getCurrentPosHashKey()],
      directionToThis: direction,
      directionsLeftToVisit: directionsToTry
    };
  };

  getNewPos = direction => {
    switch (direction) {
      case 1:
        return { x: this.currentPos.x, y: this.currentPos.y - 1 };
      case 2:
        return { x: this.currentPos.x, y: this.currentPos.y + 1 };
      case 3:
        return { x: this.currentPos.x - 1, y: this.currentPos.y };
      case 4:
        return { x: this.currentPos.x + 1, y: this.currentPos.y };
    }
  };

  getPosHashKey = ({ x, y }) => {
    return `${x},${y}`;
  };

  getOppositeDirection(dir) {
    return { 1: 2, 2: 1, 3: 4, 4: 3 }[dir];
  }
}

function* generateFromArray(array) {
  var index = 0;
  while (index < array.length) {
    yield array[index];
    index++;
  }
  throw "This generator has been called too many times, use longer array";
}

function getImagefromGridHash(
  gridHash,
  limits,
  defaultValue,
  replacements = []
) {
  const height = limits.y.max - limits.y.min + 1;
  const width = limits.x.max - limits.x.min + 1;
  let image = Array.apply(null, Array(height)).map(() =>
    Array(width).fill(defaultValue)
  );
  const gridContents = Object.entries(gridHash);
  for (let i = 0; i < gridContents.length; i++) {
    const coor = gridContents[i][0].split(",");
    image[parseInt(coor[1]) + limits.y.min][parseInt(coor[0]) + limits.x.min] =
      gridContents[i][1];
  }
  image = image.join("\n").replace(/,/g, "");

  replacements.forEach(replacement => {
    let re = new RegExp(replacement[0], "g");
    image = image.replace(re, replacement[1]);
  });

  return image;
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

function getMinimumSteps(connectedNodes, startPosition, endPosition = null) {
  let steps = 0;
  let searching = true;
  let positionsToSearch = [startPosition];
  const positionsSearched = {};
  while (positionsToSearch.length !== 0 && searching) {
    positionsToSearch.forEach(pos => {
      positionsSearched[pos] = true;
      if (pos === endPosition) {
        searching = false;
      }
    });
    positionsToSearch = positionsToSearch
      .map(pos => connectedNodes(pos))
      .flat()
      .filter(pos => positionsSearched[pos] === undefined);
    steps++;
  }
  return { success: !searching || !endPosition, steps: steps - 1 };
}

function getHCF(numbers) {
  let a = numbers[0];
  for (var i = 1; i < numbers.length; i++) {
    b = numbers[i];
    a = getHCF2Numbers(a, b);
  }
  return a;
}
function getHCF2Numbers(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  const limit = Math.min(a, b);
  let currentHighest = 1;
  for (let i = 2; i <= limit; i++) {
    if (a % i == 0 && b % i == 0) {
      currentHighest = i;
    }
  }
  return currentHighest;
}

function getSmallestIndexThat(array, func, start = 0) {
 for (let i = start; i < array.length; i++) {
   if (func(array[i])) return i;
 } 
}

function deepCloneNestedArray(obj) {
  if (!Array.isArray(obj)) return obj;
  return obj.map((o) => deepCloneNestedArray(o));
}

module.exports = {
  computeIntcode,
  Robot,
  Arcade,
  VacumnBot,
  SpringDroid,
  RepairDroid,
  generateFromArray,
  getMinimumSteps,
  getHCF,
  getSmallestIndexThat,
  deepCloneNestedArray,
};
