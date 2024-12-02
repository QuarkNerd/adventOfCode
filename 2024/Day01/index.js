function solve(inputString) {
  const input = inputString.split(/\r?\n/).map((x) => x.split("   "));

  const left = input.map((x) => parseInt(x[0])).sort((a, b) => a - b);
  const right = input.map((x) => parseInt(x[1])).sort((a, b) => a - b);
  const rightMap = right.reduce((map, v) => {
    map[v] = map[v] ? map[v] + 1 : 1;
    return map;
  }, {});

  const partOneTotal = left.reduce(
    (current, v, i) => current + Math.abs(v - right[i]),
    0
  );
  const partTwoTotal = left.reduce(
    (a, v) => a + (rightMap[v] ? rightMap[v] : 0) * v,
    0
  );

  return [partOneTotal, partTwoTotal];
}

module.exports = solve;
