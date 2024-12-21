function solve(inputString) {
  const [tilesString, patternString] = inputString.split(/\r?\n\r?\n/);
  const tiles = tilesString.split(", ");

  const patterns = patternString
    .split(/\r?\n/)
    .map((p) =>
      countways(
        tiles.filter((t) => p.includes(t)),
        p
      )
    )
    .filter((x) => x);

  return [patterns.length, patterns.reduce((a, b) => a + b, 0)];
}

const hash = {};
function countways(tiles, patter) {
  if (hash[patter] !== undefined) {
    return hash[patter];
  }
  const count = tiles
    .flatMap((t) => {
      if (!patter.startsWith(t)) {
        return 0;
      }
      if (patter === t) {
        return 1;
      }
      return countways(tiles, patter.slice(t.length));
    })
    .reduce((a, b) => a + b, 0);
  hash[patter] = count;
  return count;
}

module.exports = solve;
