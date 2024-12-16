const { getOrthNeighbours, nodeToString } = require("../../shared/js/2dcoor");

function solve(inputString) {
  const map = inputString
    .split(/\r?\n/)
    .map((line) => line.split("").map((x) => parseInt(x)));

  let nodes = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 0) {
        nodes.push({ x, y });
      }
    }
  }

  return nodes
    .map((node) => {
      let nodes = [node];
      for (let i = 0; i < 9; i++) {
        let nextNodes = [];
        nodes.forEach((currentNode) => {
          getOrthNeighbours(currentNode).forEach(({ x, y }) => {
            if (map[y]?.[x] === i + 1) {
              nextNodes.push({ x, y });
            }
          });
        });
        nodes = nextNodes;
      }
      const set = new Set(nodes.map(nodeToString));
      return [set.size, nodes.length];
    })
    .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
}

module.exports = solve;
