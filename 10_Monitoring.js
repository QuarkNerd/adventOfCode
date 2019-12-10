const input = getInput();
const grid = input.split("\n");
const width = grid[0].length;
const height = grid.length;
// console.log(width, height);

solvePartOne();

function solvePartOne() {
  let currentHighest = 0;
  let currentCount;
  for (let x1 = 0; x1 < width; x1++) {
    for (let y1 = 0; y1 < height; y1++) {
      if (grid[y1][x1] === "#") {
        currentCount = getAsteroidsSeenNumber(x1, y1);
        currentHighest =
          currentHighest > currentCount ? currentHighest : currentCount;
      }
    }
  }
  console.log(currentHighest);
}

function getAsteroidsSeenNumber(x0, y0) {
  let num = -1; // to not count self
  const reducedCoorhash = {};
  let reducedCoors;
  let hashKey;
  for (let x1 = 0; x1 < width; x1++) {
    for (let y1 = 0; y1 < height; y1++) {
      if (grid[y1][x1] === "#") {
        reducedCoors = getReducedCoor(x0 - x1, y0 - y1);
        hashKey = reducedCoors.join(",");
        // console.log(x0 - x1, y0 - y1, hashKey);
        // console.log("hash", reducedCoorhash);
        if (reducedCoorhash[hashKey] == undefined) {
          //   console.log("isNEw");
          num += 1;
          reducedCoorhash[hashKey] = true;
        }
      }
    }
  }
  return num;
}

function getReducedCoor(x, y) {
  if (x == 0 && y == 0) {
    return [x, y];
  } else if (x == 0) {
    return [0, Math.sign(y)];
  } else if (y == 0) {
    return [Math.sign(x), 0];
  } else {
    const HCF = getHCF(x, y);
    return [parseInt(x / HCF), parseInt(y / HCF)];
  }
}

function getHCF(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  const limit = Math.min(a, b);
  let currentHighest = 1;
  for (let i = 2; i <= limit; i++) {
    if (a % i == 0 && b % i == 0) {
      currentHighest = i;
    }
  }
  //   console.log(a, b, currentHighest);
  return currentHighest;
}

function getInput() {
  return `..............#.#...............#....#....
    #.##.......#....#.#..##........#...#......
    ..#.....#....#..#.#....#.....#.#.##..#..#.
    ...........##...#...##....#.#.#....#.##..#
    ....##....#...........#..#....#......#.###
    .#...#......#.#.#.#...#....#.##.##......##
    #.##....#.....#.....#...####........###...
    .####....#.......#...##..#..#......#...#..
    ...............#...........#..#.#.#.......
    ........#.........##...#..........#..##...
    ...#..................#....#....##..#.....
    .............#..#.#.........#........#.##.
    ...#.#....................##..##..........
    .....#.#...##..............#...........#..
    ......#..###.#........#.....#.##.#......#.
    #......#.#.....#...........##.#.....#..#.#
    .#.............#..#.....##.....###..#..#..
    .#...#.....#.....##.#......##....##....#..
    .........#.#..##............#..#...#......
    ..#..##...#.#..#....#..#.#.......#.##.....
    #.......#.#....#.#..##.#...#.......#..###.
    .#..........#...##.#....#...#.#.........#.
    ..#.#.......##..#.##..#.......#.###.......
    ...#....###...#......#..#.....####........
    .............#.#..........#....#......#...
    #................#..................#.###.
    ..###.........##...##..##.................
    .#.........#.#####..#...##....#...##......
    ........#.#...#......#.................##.
    .##.....#..##.##.#....#....#......#.#....#
    .....#...........#.............#.....#....
    ........#.##.#...#.###.###....#.#......#..
    ..#...#.......###..#...#.##.....###.....#.
    ....#.....#..#.....#...#......###...###...
    #..##.###...##.....#.....#....#...###..#..
    ........######.#...............#...#.#...#
    ...#.....####.##.....##...##..............
    ###..#......#...............#......#...#..
    #..#...#.#........#.#.#...#..#....#.#.####
    #..#...#..........##.#.....##........#.#..
    ........#....#..###..##....#.#.......##..#
    .................##............#.......#..`;
}
