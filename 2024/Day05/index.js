function solve(inputString) {
  const [ruleStrings, updateStrings] = inputString
    .split(/\r?\n\r?\n/)
    .map((x) => x.split(/\r?\n/));

  const updates = updateStrings.map((s) => s.split(",")).map(u => makeObey(u, ruleStrings));

  let partOneTotal = sumMiddle(updates.filter((x) => x[1]).map((x) => x[0]));
  let partTwoTotal = sumMiddle(updates.filter((x) => !x[1]).map((x) => x[0]));
  return [partOneTotal, partTwoTotal];
}

function sumMiddle(update) {
  return update
    .map((up) => parseInt(up[(up.length - 1) / 2]))
    .reduce((a, b) => a + b, 0);
}

function makeObey(update, ruleStrings) {
  const intital = update.toString();
  const sorted = update.sort((a, b) =>
    ruleStrings.includes(a + "|" + b) ? -1 : 1
  );
  return [sorted, intital === sorted.toString()];
}

module.exports = solve;
