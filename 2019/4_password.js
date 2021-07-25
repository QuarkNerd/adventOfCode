const INPUT = "278384-824795".split("-");
const NUMBER_A = parseInt(INPUT[0]);
const NUMBER_B = parseInt(INPUT[1]);

solvePartOne();
solvePartTwo();

function solvePartOne() {
  console.log(
    countNumbers(
      NUMBER_A,
      NUMBER_B,
      number => hasAPair(number) && neverDecreases(number)
    )
  );
}

function solvePartTwo() {
  console.log(
    countNumbers(
      NUMBER_A,
      NUMBER_B,
      number => hasALonePair(number) && neverDecreases(number)
    )
  );
}

function countNumbers(start, end, rule) {
  let counter = 0;
  for (let i = start; i < end + 1; i++) {
    let number = i.toString();
    if (rule(number)) {
      counter++;
    }
  }
  return counter;
}
function neverDecreases(nu) {
  for (let i = 0; i < nu.length - 1; i++) {
    if (decreasesFrom(nu, i)) {
      return false;
    }
  }
  return true;
}
function hasALonePair(nu) {
  for (let i = 0; i < nu.length - 1; i++) {
    if (hasALonePairAt(nu, i)) {
      return true;
    }
  }
  return false;
}
function hasAPair(nu) {
  for (let i = 0; i < nu.length - 1; i++) {
    if (hasAPairAt(nu, i)) {
      return true;
    }
  }
  return false;
}
function decreasesFrom(nu, ind) {
  return parseInt(nu[ind]) > parseInt(nu[ind + 1]);
}
function hasALonePairAt(nu, ind) {
  return (
    hasAPairAt(nu, ind) && !hasAPairAt(nu, ind + 1) && !hasAPairAt(nu, ind - 1)
  );
}
function hasAPairAt(nu, ind) {
  return nu[ind] == nu[ind + 1];
}
