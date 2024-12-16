const directions = [
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

function solve(inputString) {
  const input = inputString.split(/\r?\n/).map((x) => x.split(""));

  const regions = [];

  let nextRegion;
  while ((nextRegion = findAndRemoveRegion(input))) {
    regions.push(nextRegion);
  }

  return [
    regions.map((x) => x.area * x.perimeter).reduce((a, b) => a + b, 0),
    regions.map((x) => x.area * x.sides).reduce((a, b) => a + b, 0),
  ];
}

function findAndRemoveRegion(input) {
  const height = input.length;
  const wdith = input[0].length;

  let start = null;
  outerloop: for (let y = 0; y < height; y++) {
    for (let x = 0; x < wdith; x++) {
      if (input[y][x]) {
        start = { x, y };
        break outerloop;
      }
    }
  }
  if (!start) return null;

  const letter = input[start.y][start.x];
  const visited = new Set();
  let orthNeighbors = [[], [], [], []]; // track seperately for each direction
  let current = [start];

  while (current.length) {
    const next = [];
    current.forEach((n) => {
      if (!input[n.y][n.x]) return;
      input[n.y][n.x] = null;
      visited.add(n.y + "," + n.x);

      directions.forEach((dir, directionIndex) => {
        const x = n.x + dir.x;
        const y = n.y + dir.y;

        if (visited.has(y + "," + x)) return;
        if (input[y]?.[x] !== letter) {
          orthNeighbors[directionIndex].push({ x, y });
          return;
        }
        next.push({ x, y });
      });
    });
    current = next;
  }

  const perimeter = orthNeighbors.flat().length;
  const sides = orthNeighbors.map(countSides).reduce((a, b) => a + b, 0);

  return {
    area: visited.size,
    perimeter,
    sides,
  };
}

function countSides(orthNeighbors, i) {
  const set = new Set(orthNeighbors.map(({ x, y }) => y + "," + x));
  const dir = directions[(i + 1) % 4];
  let sides = orthNeighbors.filter((n) => !set.has(n.y + dir.y + "," + (n.x + dir.x))).length;
  return sides;
}

module.exports = solve;
