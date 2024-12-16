const { mod } = require("../../shared/js/utils");
const { getAllNeighbours, nodeToString } = require("../../shared/js/2dcoor");
const height = 103;
const width = 101;
const verticalyMiddle = (height - 1) / 2;
const horizontolyMiddle = (width - 1) / 2;

function solve(inputString) {
  const input = inputString
    .split(/\r?\n/)
    .map((x) => x.matchAll(/-?\d+/g).map((x) => parseInt(x)));
  const quadrants = input
    .map((state) => quadrantAfterT(state))
    .filter((x) => x !== -1)
    .reduce((acc, v) => {
      if (!acc[v]) acc[v] = 1;
      else acc[v] += 1;
      return acc;
    }, {}); // list to count utility function
  return [
    Object.values(quadrants).reduce((a, b) => a * b, 1),
    "Run day14 directly for part two, its manual",
  ];
}

function solvePartTwo() {
  const fs = require("fs");
  const inputString = fs.readFileSync(`./input`).toString("utf8");
  const input = inputString
    .split(/\r?\n/)
    .map((x) => [...x.matchAll(/-?\d+/g).map((x) => parseInt(x))]);
  let i = 0;
  setInterval(() => {
    i = drawNextWithBlockAndUpdate(input, i);
    console.log(i);
  }, 500);
}

// top left is 0, go clockwise
function quadrantAfterT([i_x, i_y, v_x, v_y], t = 100) {
  const f_x = mod(i_x + t * v_x, width);
  const f_y = mod(i_y + t * v_y, height);

  if (f_x === horizontolyMiddle || f_y === verticalyMiddle) return -1;

  const isRight = f_x > horizontolyMiddle;
  const isDown = f_y > verticalyMiddle;
  if (isRight) {
    return isDown ? 3 : 2;
  }
  return isDown ? 4 : 1;
}

function drawNextWithBlockAndUpdate(bots, i) {
  let pos;
  outer: while (true) {
    i++;
    pos = new Set();
    for (const bot of bots) {
      bot[0] = mod(bot[0] + bot[2], width);
      bot[1] = mod(bot[1] + bot[3], height);
      pos.add(bot[0] + "," + bot[1]);

      if (containsBlockAround(pos, { x: bot[0], y: bot[1] })) break outer;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const img = pos.has(nodeToString({ x, y })) ? "#" : ".";
      process.stdout.write(img);
    }
    process.stdout.write("\n");
  }
  return i;
}

function containsBlockAround(bots, bot) {
  return getAllNeighbours(bot).every((n) => bots.has(nodeToString(n)));
}

module.exports = solve;

if (require.main === module) {
  solvePartTwo();
}
