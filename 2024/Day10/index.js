const directions = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function solve(inputString) {
  const map = inputString
    .split(/\r?\n/)
    .map((line) => line.split("").map((x) => parseInt(x)));

  let nodes = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 0) {
        nodes.push(`${y},${x}`);
      }
    }
  }

  return nodes
    .map((node) => {
      const n = node.split(",").map((x) => parseInt(x));
      let nodes = [n];
      for (let i = 0; i < 9; i++) {
        let nextNodes = [];
        nodes.forEach(([currY, currX]) => {
          directions.forEach((dir) => {
            const newX = currX + dir.x;
            const newY = currY + dir.y;
            if (map[newY]?.[newX] === i + 1) {
              nextNodes.push([newY, newX]);
            }
          });
        });
        nodes = nextNodes;
      }
      const set = new Set(nodes.map((n) => n.toString()));
      return [set.size, nodes.length];
    })
    .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
}

module.exports = solve;
