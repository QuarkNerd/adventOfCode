// everything is clockwise starting from top.

const UP = { x: 0, y: -1 };
const UP_RIGHT = { x: 1, y: -1 };
const RIGHT = { x: 1, y: 0 };
const DOWN_RIGHT = { x: 1, y: 1 };
const DOWN = { x: 0, y: 1 };
const DOWN_LEFT = { x: -1, y: 1 };
const LEFT = { x: -1, y: 0 };
const UP_LEFT = { x: -1, y: -1 };

const orthoDirectionsClockwise = [UP, RIGHT, DOWN, LEFT];
const allDirectionsClockwise = [
  UP,
  UP_RIGHT,
  RIGHT,
  DOWN_RIGHT,
  DOWN,
  DOWN_LEFT,
  LEFT,
  UP_LEFT,
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

function nodeToString(coor) {
  return coor.x + "," + coor.y;
}

module.exports = {
  getOrthNeighbours,
  nodeToString,
  orthoDirectionsClockwise,
  getAllNeighbours,
};
