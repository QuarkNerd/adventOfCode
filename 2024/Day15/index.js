const {
  to2dArray,
  createCharToCoor,
  applyDirection,
  parseDirection,
} = require("../../shared/js/2dcoor");

function solve(inputString) {
  const [mapString, directions] = inputString.split(/\r?\n\r?\n/);

  const map = to2dArray(mapString);
  let charToCoor = createCharToCoor(map);
  let bot = charToCoor["@"][0];
  map[bot.y][bot.x] = ".";

  directions
    .split("")
    .filter((x) => x !== "\r" && x !== "\n")
    .forEach((dirStr) => {
      const direction = parseDirection(dirStr);
      let positionOfInterest = applyDirection(bot, direction);
      let target = map[positionOfInterest.y]?.[positionOfInterest.x];

      if (target === "#") return;
      if (target === ".") {
        bot = positionOfInterest;
        return;
      }
      while (target === "O") {
        positionOfInterest = applyDirection(positionOfInterest, direction);
        target = map[positionOfInterest.y]?.[positionOfInterest.x];
      }
      if (target === "#") return;
      bot = applyDirection(bot, direction);
      map[bot.y][bot.x] = ".";
      map[positionOfInterest.y][positionOfInterest.x] = "O";
    });

  charToCoor = createCharToCoor(map);

  const partOne = charToCoor["O"]
    .map(({ x, y }) => y * 100 + x)
    .reduce((a, b) => a + b, 0);

  return [partOne, 0];
}

module.exports = solve;
