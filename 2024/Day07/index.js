function solve(inputString) {
  const input = inputString.split(/\r?\n/).map((line) => {
    const [res, numbersString] = line.split(": ");
    return {
      target: parseInt(res),
      inputs: numbersString.split(/\s+/).map((x) => parseInt(x)),
    };
  });
  const partOne = input.map((x) => isPossible(x)).reduce((a, b) => a + b, 0);
  const partTwo = input
    .map((x) => isPossible(x, true))
    .reduce((a, b) => a + b, 0);
  return [partOne, partTwo];
}

function isPossible(set, isPartTwo) {
  const { target, inputs } = set;
  return possible(target, inputs, isPartTwo) ? target : 0;
}

function possible(result, numbers, isPartTwo) {
  if (numbers.length == 1) {
    return numbers[0] === result;
  }
  let newNumbers = [...numbers];
  const last = newNumbers.pop();

  const [canDeconcatenate, newRes] = isPartTwo
    ? deconcatenate(result, last)
    : [false];

  return (
    possible(result - last, newNumbers, isPartTwo) ||
    (result % last === 0 && possible(result / last, newNumbers, isPartTwo)) ||
    (canDeconcatenate && possible(newRes, newNumbers, isPartTwo))
  );
}

// removes b from back of a;
function deconcatenate(a, b) {
  const c = a - b;
  const magnitude = Math.pow(10, new String(b).length);
  if (c % magnitude !== 0) return [false];
  return [true, c / magnitude];
}

module.exports = solve;
