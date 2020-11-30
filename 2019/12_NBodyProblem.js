const utilities = require("./utilities");
solvePartOne();
solvePartTwo();

function solvePartOne() {
  const state = getStartingState();
  for (let i = 0; i < 1000; i++) {
    ["x", "y", "z"].forEach(dim => {
      updateVelocity(state, dim);
    });
    ["x", "y", "z"].forEach(dim => {
      updatePosition(state, dim);
    });
  }
  console.log(getTotalEnergy(state));
}

function solvePartTwo() {
  const repPeriods = ["x", "y", "z"].map(dim =>
    getRepetitionPeriod(getStartingState(), dim)
  );
  console.log(getLCM(repPeriods));
}

function getRepetitionPeriod(state, dimension) {
  let step = 0;
  const oldState = convertStateToString(state);
  do {
    updatePosition(state, dimension);
    updateVelocity(state, dimension);
    step++;
  } while (convertStateToString(state) !== oldState);

  return step;
}

function updatePosition(state, dimension) {
  state.forEach(moon => {
    moon.pos[dimension] += moon.vel[dimension];
  });
}

function updateVelocity(state, dimension) {
  const moonNumber = state.length;
  for (let i = 0; i < moonNumber; i++) {
    for (let j = i + 1; j < moonNumber; j++) {
      updateVelocityOfPair(state[i], state[j], dimension);
    }
  }
}

function getTotalEnergy(state) {
  return state.reduce(
    (acc, moon) =>
      acc +
      Object.values(moon.vel).reduce((a, b) => a + Math.abs(b), 0) *
        Object.values(moon.pos).reduce((a, b) => a + Math.abs(b), 0),
    0
  );
}

function updateVelocityOfPair(moon1, moon2, dim) {
  if (moon1.pos[dim] < moon2.pos[dim]) {
    moon1.vel[dim] += 1;
    moon2.vel[dim] -= 1;
  } else if (moon1.pos[dim] > moon2.pos[dim]) {
    moon2.vel[dim] += 1;
    moon1.vel[dim] -= 1;
  }
}

function getLCM(numbers) {
  const multi = numbers.reduce((a, b) => a * b);
  const HCF = utilities.getHCF(numbers);
  return multi / Math.pow(HCF, numbers.length - 1);
}

function convertStateToString(state) {
  return JSON.stringify(state).replace(/[\[\]\{\}osel":,]/g, "");
}

function getStartingState() {
  const input = `<x=7, y=10, z=17>
  <x=-2, y=7, z=0>
  <x=12, y=5, z=12>
  <x=5, y=-8, z=6>`;
  return input
    .replace(/ /g, "")
    .replace(/=/g, "")
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/x/g, "")
    .replace(/y/g, "")
    .replace(/z/g, "")
    .split("\n")
    .map(moon => {
      const posAr = moon.split(",");
      return {
        pos: {
          x: parseInt(posAr[0]),
          y: parseInt(posAr[1]),
          z: parseInt(posAr[2])
        },
        vel: {
          x: 0,
          y: 0,
          z: 0
        }
      };
    });
}
