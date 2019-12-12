const input = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
const state = input
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
const moonNumber = state.length;

solvePartOne();
function solvePartOne() {
  for (let i = 0; i < 9; i++) {
    console.log(state);
    updateVelocity();
    updatePosition();
  }
  console.log(getTotalEnergy(state));
}

function updatePosition() {
  state.forEach(moon => {
    ["x", "y", "z"].forEach(dim => {
      moon.pos[dim] += moon.vel[dim];
    });
  });
}

function updateVelocity() {
  for (let i = 0; i < moonNumber; i++) {
    for (let j = i + 1; j < moonNumber; j++) {
      updateVelocityOfPair(state[i], state[j]);
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

function updateVelocityOfPair(moon1, moon2) {
  ["x", "y", "z"].forEach(dim => {
    if (moon1.pos[dim] < moon2.pos[dim]) {
      moon1.vel[dim] += 1;
      moon2.vel[dim] -= 1;
    } else {
      moon2.vel[dim] += 1;
      moon1.vel[dim] -= 1;
    }
  });
}
