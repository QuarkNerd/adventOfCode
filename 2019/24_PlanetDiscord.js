const input = `#.#..
.....
.#.#.
.##..
.##.#`;

solvePartOne();
function solvePartOne() {
  let state = input.split("\n");
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
        const neighborsCount = getNeighborsCount(i, j, prevState);
        row = row + getNewBugState(prevState[i][j], neighborsCount);
      }
      newState.push(row);
    }
    return newState;
  }

  function getNeighborsCount(i, j, prevState) {
    let neighbors = 0;
    [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ].forEach(([iShift, jShift]) => {
      if (
        prevState[i + iShift] !== undefined &&
        prevState[i + iShift][j + jShift] === "#"
      ) {
        neighbors += 1;
      }
    });
    return neighbors;
  }

}

function getNewBugState(currentState, neighborsCount) {
  let newState = currentState;
  if (newState === "#" && neighborsCount !== 1) return ".";
  if (newState === "." && (neighborsCount === 1 || neighborsCount === 2)) return "#";
  return newState;
}
