function solve(inputString) {
  const newLine = /\r?\n/g;
  const lineLength = newLine.exec(inputString).index;
  const parsed = inputString.replaceAll(newLine, "Z");
  const reversed = parsed.split("").reverse().join("");
  const partOne =
    countForwardXmas(parsed, lineLength) +
    countForwardXmas(reversed, lineLength);
  const partTwo =
    countForwardCrossmas(parsed, lineLength) +
    countForwardCrossmas(reversed, lineLength);

  return [partOne, partTwo];
}

function countForwardXmas(string, lineLength) {
  return (
    [...string.matchAll(getXmasRegex(0))].length +
    [...string.matchAll(getXmasRegex(lineLength))].length +
    [...string.matchAll(getXmasRegex(lineLength + 1))].length +
    [...string.matchAll(getXmasRegex(lineLength - 1))].length
  );
}
function countForwardCrossmas(string, lineLength) {
  return (
    [...string.matchAll(getHorizintalCrossmasRegex(lineLength))].length +
    [...string.matchAll(getVerticalCrossmasRegex(lineLength))].length
  );
}

function getXmasRegex(dist) {
  return new RegExp(`(?=(X.{${dist}}M.{${dist}}A.{${dist}}S))`, "g");
}

function getVerticalCrossmasRegex(lineLength) {
  return new RegExp(
    `(?=(M.M.{${lineLength - 1}}A.{${lineLength - 1}}S.S))`,
    "g"
  );
}

function getHorizintalCrossmasRegex(lineLength) {
  return new RegExp(
    `(?=(M.S.{${lineLength - 1}}A.{${lineLength - 1}}M.S))`,
    "g"
  );
}

module.exports = solve;
