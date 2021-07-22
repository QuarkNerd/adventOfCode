const input = `#.#..
.....
.#.#.
.##..
.##.#`;

const emptyGridString = `.....
.....
..X..
.....
.....`;

const UP = "UP";
const DOWN = "DOWN";
const LEFT = "LEFT";
const RIGHT = "RIGHT";

const directions = {
  [UP]: [-1, 0],
  [DOWN]: [1, 0],
  [LEFT]: [0, -1],
  [RIGHT]: [0, 1],
};

class ErisBugLayer {
  constructor(state) {
    this.state = state;
  }

  calculateNextState(surroundingCells) {
    this.newState = [];
    for (let i = 0; i < this.state.length; i++) {
      let row = [];
      for (let j = 0; j < this.state[0].length; j++) {
        const neighborsObject = this.getNeighborsObject(i, j, surroundingCells);
        const neighborsCount = Object.values(neighborsObject).reduce(
          (a, b) => a + b,
          0
        );
        if (this.state[i][j] === "X" && neighborsCount > 0) {
          this.state[i][j] = ErisBugLayer.getBlank();
        }
        if (this.state[i][j] instanceof ErisBugLayer) {
          this.state[i][j].calculateNextState(neighborsObject);
        }
        row.push(getNewBugState(this.state[i][j], neighborsCount));
      }
      this.newState.push(row);
    }
  }

  // needs to check if neightbour is an instancr
  getNeighborsObject(i, j, surroundingCells) {
    const neighbors = {};
    [UP, DOWN, LEFT, RIGHT].forEach((dir) => {
      const [iShift, jShift] = directions[dir];
      const cell = this.state[i + iShift]?.[j + jShift];
      if (cell === "#") {
        neighbors[dir] = 1;
      } else if (cell === undefined && surroundingCells !== undefined) {
        neighbors[dir] = surroundingCells[dir];
      } else if (cell instanceof ErisBugLayer) {
        let oppositeDir;
        switch (dir) {
          case UP:
            oppositeDir = DOWN;
            break;
          case DOWN:
            oppositeDir = UP;
            break;
          case LEFT:
            oppositeDir = RIGHT;
            break;
          case RIGHT:
            oppositeDir = LEFT;
            break;
        }
        neighbors[dir] = cell.getNeighborsCountOnSide(oppositeDir);
      } else {
        neighbors[dir] = 0;
      }
    });
    return neighbors;
  }

  // Not technically generic , doenst work if side cell has internal layer
  getNeighborsCountOnSide(side) {
    switch (side) {
      case UP:
        return this.state[0].reduce((total, cell) => total + (cell === "#"), 0);
      case DOWN:
        return this.state[this.state.length - 1].reduce(
          (total, cell) => total + (cell === "#"),
          0
        );
      case LEFT:
        return this.state.reduce((total, row) => total + (row[0] === "#"), 0);
      case RIGHT:
        return this.state.reduce(
          (total, row) => total + (row[row.length - 1] === "#"),
          0
        );
    }
  }

  setToNextState() {
    this.state = this.newState ?? this.state;
    this.state.forEach((row) => {
      row.forEach((cell) => {
        if (cell instanceof ErisBugLayer) {
          cell.setToNextState();
        }
      });
    });
  }

  countLiving() {
    return this.state.reduce((total, row) => total + countLivingInRow(row), 0);

    function countLivingInRow(row) {
      return row.reduce((total, cell) => {
        if (cell === "." || cell === "X") return total;
        if (cell === "#") return total + 1;
        return total + cell.countLiving();
      }, 0);
    }
  }

  setMiddle(inner) {
    const middle = (this.state.length - 1) / 2;
    this.state[middle][middle] = inner;
  }

  static getBlank() {
    return new ErisBugLayer(
      emptyGridString.split("\n").map((line) => line.split(""))
    );
  }
}

solvePartOne();
solvePartTwo();

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
      directions.UP,
      directions.DOWN,
      directions.LEFT,
      directions.RIGHT,
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

function solvePartTwo() {
  const depthZeroState = input.split("\n").map(line => line.split(""));
  const middle = (depthZeroState.length - 1) /2
  depthZeroState[middle][middle] = "X";
  
  let state = new ErisBugLayer(depthZeroState);
  //console.log("1");
  //console.log(state.countLiving());

  for (let step = 0; step < 200; step++) {
    const newState = ErisBugLayer.getBlank();
    newState.setMiddle(state);
    newState.calculateNextState();
    newState.setToNextState();
    state = newState;
  }

  console.log(state.countLiving());
}

function getNewBugState(currentState, neighborsCount) {
  if (currentState === "#" && neighborsCount !== 1) return ".";
  if (currentState === "." && (neighborsCount === 1 || neighborsCount === 2)) return "#";
  return currentState;
}
