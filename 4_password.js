let counter = 0;
let b;
for (let i = 123257; i < 647015; i++) {
  b = i.toString();
  if (hasALonePair(b) && neverDecreases(b)) {
    counter++;
  }
}

console.log(counter);

function neverDecreases(nu) {
  return !(
    decreasesFrom(nu, 0) ||
    decreasesFrom(nu, 1) ||
    decreasesFrom(nu, 2) ||
    decreasesFrom(nu, 3) ||
    decreasesFrom(nu, 4)
  );
}
function hasALonePair(nu) {
  return (
    hasALonePairAt(nu, 0) ||
    hasALonePairAt(nu, 1) ||
    hasALonePairAt(nu, 2) ||
    hasALonePairAt(nu, 3) ||
    hasALonePairAt(nu, 4)
  );
}
function decreasesFrom(nu, ind) {
  return parseInt(nu[ind]) > parseInt(nu[ind + 1]);
}
function hasALonePairAt(nu, ind) {
  return (
    hasAPairAt(nu, ind) && !hasAPairAt(nu, ind + 1) && !hasAPairAt(nu, ind - 1)
  );
}
function hasAPairAt(n, ind) {
  if (ind == 5 || ind == -1) {
    return false;
  }
  return n[ind] == n[ind + 1];
}
