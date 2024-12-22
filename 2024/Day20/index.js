const {
  findShortestPathLength,
  binaryIntSearch,
} = require("../../shared/js/algorithims");

const {
  stringToNode,
  getOrthNeighbours,
  nodeToString,
  to2dArray,
  createCharToCoor,
} = require("../../shared/js/2dcoor");

function solve(inputString) {
  const map = to2dArray(inputString);
  const charToChor = createCharToCoor(map);

  let simple = getDist(map, { x: -1, y: -1 });

  let aa = 0;
  for (let y = 1; y < map.length - 1; y++) {
    console.log(y);
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === "#") {
        const a = getOrthNeighbours({ x, y }).filter(
          (neigh) => map[neigh.y]?.[neigh.x] === "."
        ).length;
        if (a > 0) {
          const bb = getDist(map, { x, y }, undefined);
          if (bb <= simple - 100) aa++;
        }
      }
    }
  }

  let partOneTotal = 0;
  let partTwoTotal = 0;

  return [simple, aa];
}

function getDist(map, override, maxDistance) {
  const charToChor = createCharToCoor(map);
  const start = nodeToString(charToChor["S"][0]);
  const end = nodeToString(charToChor["E"][0]);
  const getNeighbors = (n) => {
    const node = stringToNode(n);
    return getOrthNeighbours(node)
      .filter(
        (neigh) =>
          map[neigh.y][neigh.x] !== "#" ||
          (neigh.y === override.y && neigh.x === override.x)
      )
      .map((neigh) => ({ neighbor: nodeToString(neigh), distance: 1 }));
  };

  return findShortestPathLength(
    start,
    getNeighbors,
    (x) => x === end,
    maxDistance
  );
}

module.exports = solve;
