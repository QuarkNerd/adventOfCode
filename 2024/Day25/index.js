const { to2dArray } = require("../../shared/js/2dcoor");
const fiveRange = Array(5)
  .fill(null)
  .map((_, x) => x);
const sevenRange = Array(7)
  .fill(null)
  .map((_, y) => y);

function solve(inputString) {
  const componentMaps = inputString
    .split(/\r?\n\r?\n/)
    .map((x) => to2dArray(x));

  const [keys, locks] = getKeysAndLocks(componentMaps);

  let count = 0;

  for (const key of keys) {
    for (const lock of locks) {
      if (doesFit(key, lock)) count++;
    }
  }

  return [count, 0];
}

function doesFit(key, lock) {
  return fiveRange.every((i) => key[i] + lock[i] <= 7);
}

function getKeysAndLocks(componentMaps) {
  const keys = [];
  const locks = [];

  for (const map of componentMaps) {
    const isKey = map[0][0] === ".";
    const component = parseComponentMap(map);
    (isKey ? keys : locks).push(component);
  }
  return [keys, locks];
}

function parseComponentMap(map) {
  return fiveRange.map(
    (x) => sevenRange.filter((y) => map[y][x] === "#").length
  );
}

module.exports = solve;
