// Prioritise left over vertical because otherwise in later steps this causes a split in the left
// direction which is costsly
// Priotitise down over right because then the steps to get to down are condensed
// The execption is when you want to avoid the panic button

const numericPad = {
  PANIC: { x: 0, y: 3 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
};

const directionPad = {
  PANIC: { x: 0, y: 0 },
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  V: { x: 1, y: 1 },
  ">": { x: 2, y: 1 },
};

function solve(inputString) {
  const lines = inputString.split(/\r?\n/);

  return [
    lines.map((l) => getComplexity(l, 2)).reduce((a, b) => a + b, 0),
    lines.map((l) => getComplexity(l, 25)).reduce((a, b) => a + b, 0),
  ];
}

function getComplexity(line, middleBots) {
  const value = parseInt(line.slice(0, 3));
  return value * getShortestPath(line, middleBots);
}

function getShortestPath(line, middleBots) {
  const directions = expandToDirections("A", line.split(""), numericPad);
  let length = 0;
  let current = "A";
  for (const d of directions) {
    length += getButtonsPressCount(current, d, middleBots);
    current = d;
  }
  return length;
}

// layer 0 is the human layer
const hash = {};
function getButtonsPressCount(start, buttonToPress, layer) {
  const key = start + "-" + buttonToPress + "-" + layer;
  if (hash[key]) {
    return hash[key];
  }
  if (start === buttonToPress) {
    return 1;
  }
  const directions = getDirections(start, buttonToPress, directionPad);
  if (layer === 1) {
    return directions.length;
  }

  let length = 0;
  let current = "A";
  for (const d of directions) {
    length += getButtonsPressCount(current, d, layer - 1);
    current = d;
  }
  hash[key] = length;
  return length;
}

function expandToDirections(start, buttonsToPress, pad) {
  let directions = [];
  let current = start;
  buttonsToPress.forEach((but) => {
    const nextSteps = getDirections(current, but, pad);
    directions = [...directions, ...nextSteps];
    current = but;
  });

  return directions;
}

function getDirections(start, buttonToPress, pad) {
  const panicLoc = pad.PANIC;
  const startLoc = pad[start];
  const buttonToPressLoc = pad[buttonToPress];
  const right = buttonToPressLoc.x - startLoc.x;
  const down = buttonToPressLoc.y - startLoc.y;

  const rightDirs = right > 0 ? Array(Math.abs(right)).fill(">") : [];
  const leftDirs = right < 0 ? Array(Math.abs(right)).fill("<") : [];
  const upDownDirs = Array(Math.abs(down)).fill(down > 0 ? "V" : "^");

  if (startLoc.y === panicLoc.y && buttonToPressLoc.x === panicLoc.x) {
    return [...upDownDirs, ...rightDirs, ...leftDirs, "A"];
  }
  if (startLoc.x === panicLoc.x && buttonToPressLoc.y === panicLoc.y) {
    return [...leftDirs, ...rightDirs, ...upDownDirs, "A"];
  }
  return [...leftDirs, ...upDownDirs, ...rightDirs, "A"];
}

module.exports = solve;
