const {
  findShortestPathLength,
  binaryIntSearch,
} = require("../../shared/js/algorithims");

const {
  stringToNode,
  getOrthNeighbours,
  nodeToString,
} = require("../../shared/js/2dcoor");

const size = 71;
const max = size - 1;

function solve(inputString) {
  const input = inputString.split(/\r?\n/);
  const partOne = solveForBytes(input.slice(0, 1024));

  const firstFailureIndex = binaryIntSearch(1024, input.length, (i) => {
    if (solveForBytes(input.slice(0, i))) {
      return "TOO_LOW";
    } else if (solveForBytes(input.slice(0, i - 1))) {
      return "MATCH";
    }
    return "TOO_HIGH";
  });

  return [partOne, input[firstFailureIndex - 1]];
}

function solveForBytes(bytes) {
  const blocks = new Set(bytes);
  const getNeighbors = (str) => {
    const node = stringToNode(str);
    const neigh = getOrthNeighbours(node).filter(
      (n) => 0 <= n.x && n.x <= max && 0 <= n.y && n.y <= max
    );

    return neigh
      .map(nodeToString)
      .filter((str) => {
        return !blocks.has(str);
      })
      .map((neighbor) => ({ neighbor, distance: 1 }));
  };
  return findShortestPathLength(
    "0,0",
    getNeighbors,
    (x) => x === `${max},${max}`
  );
}

module.exports = solve;
