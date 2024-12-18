const {
  to2dArray,
  createCharToCoor,
  applyDirection,
  parseDirection,
  nodeToString,
  directionCoors,
} = require("../../shared/js/2dcoor");

function solve(inputString) {
  const [mapString, directionsString] = inputString.split(/\r?\n\r?\n/);
  const directions = directionsString
    .split("")
    .filter((x) => x !== "\r" && x !== "\n")
    .map((x) => parseDirection(x));

  return [
    solvePart(mapString, directions, false),
    solvePart(mapString, directions, true),
  ];
}

function solvePart(mapString, directions, isPartTwo = false) {
  const map = getMap(mapString, isPartTwo);

  charToCoor = createCharToCoor(map);
  bot = charToCoor["@"][0];
  map[bot.y][bot.x] = ".";

  directions.forEach((direction) => {
    const nextBot = applyDirection(bot, direction);
    const target = map[nextBot.y][nextBot.x];
    if (target === "#") return;
    if (target === ".") {
      bot = nextBot;
      return;
    }

    let boxesToTest = [{ ...nextBot, char: target }];
    const boxesToMove = {};

    while (boxesToTest.length) {
      const nextBoxestoTest = [];
      for (const box of boxesToTest) {
        const next = applyDirection(box, direction);
        const nextChar = map[next.y][next.x];
        if (nextChar === "#") return;
        if (nextChar === "[" || nextChar === "]" || nextChar === "O") {
          nextBoxestoTest.push({ ...next, char: nextChar });
        }
        if (
          (direction === directionCoors.DOWN ||
            direction === directionCoors.UP) &&
          box.char !== "O"
        ) {
          const otherSideDirection =
            box.char === "[" ? directionCoors.RIGHT : directionCoors.LEFT;
          const otherCoors = applyDirection(box, otherSideDirection);
          const str = nodeToString(otherCoors);
          if (!boxesToMove[str]) {
            nextBoxestoTest.push({
              ...otherCoors,
              char: map[otherCoors.y][otherCoors.x],
            });
          }
        }
        const str = nodeToString(box);
        boxesToMove[str] = { ...box };
      }
      boxesToTest = nextBoxestoTest;
    }

    Object.values(boxesToMove).forEach(({ x, y }) => (map[y][x] = "."));
    Object.values(boxesToMove).forEach((box) => {
      const newPos = applyDirection(box, direction);
      map[newPos.y][newPos.x] = box.char;
    });
    bot = nextBot;
  });

  return isPartTwo ? score(map, "[") : score(map, "O");
}

function getMap(mapString, isPartTwo) {
  const mapP1 = to2dArray(mapString);
  if (!isPartTwo) return mapP1;
  return mapP1.map((line) =>
    line.flatMap((element) => {
      switch (element) {
        case "#":
          return ["#", "#"];
        case "O":
          return ["[", "]"];
        case ".":
          return [".", "."];
        case "@":
          return ["@", "."];
      }
    })
  );
}

function score(map, char) {
  const charToCoor = createCharToCoor(map);
  return charToCoor[char]
    .map(({ x, y }) => y * 100 + x)
    .reduce((a, b) => a + b, 0);
}

module.exports = solve;
