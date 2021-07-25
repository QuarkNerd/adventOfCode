const utilities = require("./utilities");
const input = getInput();
const grid = input.replace(/ /g, "").split("\n");
const width = grid[0].length;
const height = grid.length;

let bestCoor = [];
solvePartOne();
solvePartTwo();

function solvePartOne() {
  let currentHighest = 0;
  let currentCount;
  for (let x0 = 0; x0 < width; x0++) {
    for (let y0 = 0; y0 < height; y0++) {
      if (grid[y0][x0] === "#") {
        currentCount = getAsteroidsSeen(x0, y0).length;
        if (currentCount > currentHighest) {
          currentHighest = currentCount;
          bestCoor = [x0, y0];
        }
      }
    }
  }
  console.log("Answer", currentHighest, "Best coordinates", bestCoor);
}

function solvePartTwo() {
  const bestX = bestCoor[0];
  const bestY = bestCoor[1];
  let asteroidRelativeList = getAsteroidsSeen(bestX, bestY);
  asteroidRelativeList.sort((a, b) => {
    return getAngle(a) - getAngle(b);
  });

  console.log(
    (asteroidRelativeList[199][0] + bestX) * 100 +
      asteroidRelativeList[199][1] +
      bestY
  );
}

function getAsteroidsSeen(x0, y0) {
  const reducedCoorhash = {};
  let reducedCoors;
  let hashKey;
  for (let x1 = 0; x1 < width; x1++) {
    for (let y1 = 0; y1 < height; y1++) {
      if (grid[y1][x1] === "#") {
        reducedCoors = getReducedCoor(x1 - x0, y1 - y0);
        hashKey = reducedCoors.join(",");
        if (
          reducedCoorhash[hashKey] == undefined ||
          Math.abs(x1 - x0) < Math.abs(reducedCoorhash[hashKey][0]) ||
          Math.abs(y1 - y0) < Math.abs(reducedCoorhash[hashKey][1])
        ) {
          reducedCoorhash[hashKey] = [x1 - x0, y1 - y0];
        }
      }
    }
  }
  delete reducedCoorhash["0,0"];
  return Object.values(reducedCoorhash);
}

function getReducedCoor(x, y) {
  if (x == 0 && y == 0) {
    return [x, y];
  } else if (x == 0) {
    return [0, Math.sign(y)];
  } else if (y == 0) {
    return [Math.sign(x), 0];
  } else {
    const HCF = utilities.getHCF(x, y);
    return [parseInt(x / HCF), parseInt(y / HCF)];
  }
}

//Returns angle that coordinates form with origin with a line going straight up from origin
// coordinates are positive for right-down by deafult

function getAngle([x, y]) {
  if (x == 0 && y < 0) {
    return 0;
  }

  if (x == 0 && y > 0) {
    return Math.PI;
  }

  y = -y;
  const angleBase = Math.atan2(x, y);
  if (x > 0) {
    return angleBase;
  }

  return angleBase + 2 * Math.PI;
}

function getInput() {
  return `#....#.....#...#.#.....#.#..#....#
#..#..##...#......#.....#..###.#.#
#......#.#.#.....##....#.#.....#..
..#.#...#.......#.##..#...........
.##..#...##......##.#.#...........
.....#.#..##...#..##.....#...#.##.
....#.##.##.#....###.#........####
..#....#..####........##.........#
..#...#......#.#..#..#.#.##......#
.............#.#....##.......#...#
.#.#..##.#.#.#.#.......#.....#....
.....##.###..#.....#.#..###.....##
.....#...#.#.#......#.#....##.....
##.#.....#...#....#...#..#....#.#.
..#.............###.#.##....#.#...
..##.#.........#.##.####.........#
##.#...###....#..#...###..##..#..#
.........#.#.....#........#.......
#.......#..#.#.#..##.....#.#.....#
..#....#....#.#.##......#..#.###..
......##.##.##...#...##.#...###...
.#.....#...#........#....#.###....
.#.#.#..#............#..........#.
..##.....#....#....##..#.#.......#
..##.....#.#......................
.#..#...#....#.#.....#.........#..
........#.............#.#.........
#...#.#......#.##....#...#.#.#...#
.#.....#.#.....#.....#.#.##......#
..##....#.....#.....#....#.##..#..
#..###.#.#....#......#...#........
..#......#..#....##...#.#.#...#..#
.#.##.#.#.....#..#..#........##...
....#...##.##.##......#..#..##....`;
}
