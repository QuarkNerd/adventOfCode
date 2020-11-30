const input = `##.#.
.#.##
.#...
#..#.
.##..`;
let state = input.split("\n");

solvePartOne();
function solvePartOne() {
  const statesHash = {};
  do {
    statesHash[state.join("")] = true;
    state = getNewState(state);
  } while (statesHash[state.join("")] === undefined);
  const bioDiversity = state
    .join("")
    .split("")
    .reduce((acc, square, i) => acc + (square === "#" ? Math.pow(2, i) : 0), 0);
  console.log(bioDiversity);

  function getNewState(prevState) {
    const newState = [];
    for (let i = 0; i < prevState.length; i++) {
      let row = "";
      for (let j = 0; j < prevState[0].length; j++) {
        row = row + getNewBugState(i, j);
      }
      newState.push(row);
    }
    return newState;
  }
}

function getNewBugState(i, j) {
  let bugState = state[i][j];
  const neighbours = getNeighboursNum(i, j);
  if (bugState === "#" && neighbours !== 1) return ".";
  if (bugState === "." && (neighbours === 1 || neighbours === 2)) return "#";
  return bugState;
}

function getNeighboursNum(i, j) {
  let neighbours = 0;
  [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0]
  ].forEach(([iShift, jShift]) => {
    if (
      state[i + iShift] !== undefined &&
      state[i + iShift][j + jShift] === "#"
    ) {
      neighbours += 1;
    }
  });
  return neighbours;
}

class ErisBugGrid {
  constructor(intialState) {
    this.state = intialState.split("\n");
  }

  update = updateOuter => {
    const newState = [];
    for (let i = 0; i < prevState.length; i++) {
      let row = "";
      for (let j = 0; j < prevState[0].length; j++) {
        row = row + getNewBugState(i, j);
      }
      newState.push(row);
    }
    return newState;
  };
}
