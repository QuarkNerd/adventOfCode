function solve(inputString) {
  let pebbles = inputString.split(/\s+/).reduce((acc, newVal) => {
    acc[newVal] = 1;
    return acc;
  }, {});

  for (let i = 0; i < 25; i++) {
    pebbles = step_set(pebbles);
  }
  const p1 = Object.values(pebbles).reduce((a, b) => a + b, 0);

  for (let i = 0; i < 50; i++) {
    pebbles = step_set(pebbles);
  }

  return [p1, Object.values(pebbles).reduce((a, b) => a + b, 0)];
}

function step_set(set) {
  const next = {};

  for (let oldPeb in set) {
    const count = set[oldPeb];
    step_peb(oldPeb).forEach((newPeb) => {
      if (next[newPeb]) {
        next[newPeb] += count;
      } else {
        next[newPeb] = count;
      }
    });
  }
  return next;
}

function step_peb(pebble) {
  const peb = parseInt(pebble);
  if (peb === 0) {
    return [1];
  }
  const st = peb.toString();
  if (!(st.length % 2)) {
    const partOne = st.slice(0, st.length / 2);
    const partTwo = st.slice(st.length / 2, st.length);
    return [parseInt(partOne), parseInt(partTwo)];
  }
  return [peb * 2024];
}

module.exports = solve;
