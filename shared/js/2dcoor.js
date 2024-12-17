// everything is clockwise starting from top.

const UP_coor = { x: 0, y: -1 };
const UP_RIGHT_coor = { x: 1, y: -1 };
const RIGHT_coor = { x: 1, y: 0 };
const DOWN_RIGHT_coor = { x: 1, y: 1 };
const DOWN_coor = { x: 0, y: 1 };
const DOWN_LEFT_coor = { x: -1, y: 1 };
const LEFT_coor = { x: -1, y: 0 };
const UP_LEFT_coor = { x: -1, y: -1 };

const directionCoors = {
  UP: UP_coor,
  UP_RIGHT: UP_RIGHT_coor,
  RIGHT: RIGHT_coor,
  DOWN_RIGHT: DOWN_RIGHT_coor,
  DOWN: DOWN_coor,
  DOWN_LEFT: DOWN_LEFT_coor,
  LEFT: LEFT_coor,
  UP_LEFT: UP_LEFT_coor,
};

const directions = {
  UP: "UP",
  UP_RIGHT: "UP_RIGHT",
  RIGHT: "RIGHT",
  DOWN_RIGHT: "DOWN_RIGHT",
  DOWN: "DOWN",
  DOWN_LEFT: "DOWN_LEFT",
  LEFT: "LEFT",
  UP_LEFT: "UP_LEFT",
};

const orthoDirectionsClockwise = [UP_coor, RIGHT_coor, DOWN_coor, LEFT_coor];
const allDirectionsClockwise = [
  UP_coor,
  UP_RIGHT_coor,
  RIGHT_coor,
  DOWN_RIGHT_coor,
  DOWN_coor,
  DOWN_LEFT_coor,
  LEFT_coor,
  UP_LEFT_coor,
];

function getOrthNeighbours(coor) {
  return orthoDirectionsClockwise.map((d) => ({
    x: coor.x + d.x,
    y: coor.y + d.y,
  }));
}

function getAllNeighbours(coor) {
  return allDirectionsClockwise.map((d) => ({
    x: coor.x + d.x,
    y: coor.y + d.y,
  }));
}

function applyDirection(coor, direction) {
  return {
    x: coor.x + direction.x,
    y: coor.y + direction.y,
  };
}

function parseDirection(str) {
  switch (str) {
    case "v":
    case "V":
      return DOWN_coor;
    case "<":
      return LEFT_coor;
    case ">":
      return RIGHT_coor;
    case "^":
      return UP_coor;
  }
  throw new Error("Invalid stirng: " + str);
}

function getOppositeDirectionString(str) {
  switch (str) {
    case directions.DOWN:
      return directions.UP;
    case directions.UP:
      return directions.DOWN;
    case directions.RIGHT:
      return directions.LEFT;
    case directions.LEFT:
      return directions.RIGHT;
  }
  throw new Error("Invalid direction: " + str);
}

// map parsing
function to2dArray(inp, parser = null) {
  return inp
    .split(/\r?\n/)
    .map((line) => line.split(""))
    .map((line) => (parser ? line.map(parser) : line));
}

function createCharToCoor(array, mapper) {
  const nodes = {};
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[0].length; x++) {
      const element = array[y][x];
      const key = mapper ? mapper(element) : element;
      if (!nodes[key]) nodes[key] = [];
      nodes[key].push({ x, y });
    }
  }
  return nodes;
}

function nodeToString(coor) {
  return coor.x + "," + coor.y;
}

module.exports = {
  getOrthNeighbours,
  nodeToString,
  orthoDirectionsClockwise,
  getAllNeighbours,
  to2dArray,
  createCharToCoor,
  parseDirection,
  applyDirection,
  directionCoors,
  directions,
  getOppositeDirectionString,
};
