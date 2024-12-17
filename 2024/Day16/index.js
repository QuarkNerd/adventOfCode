const { findShortestPathLength } = require("../../shared/js/algorithims");

const {
  to2dArray,
  createCharToCoor,
  directions,
  directionCoors,
  applyDirection,
  getOppositeDirectionString,
} = require("../../shared/js/2dcoor");

function solve(inputString) {
  const map = to2dArray(inputString);
  const charToCoor = createCharToCoor(map);
  const sn = {
    ...charToCoor.S[0],
    dir: directions.RIGHT,
    distance: 0,
    history: "",
  };
  const end = charToCoor.E[0];

  const startString = `${sn.x},${sn.y}-${sn.dir}`;
  const isEnd = (n) => n.split("-")[0] === `${end.x},${end.y}`;
  const getNeighbors = (n) => {
    const [locString, dirString] = n.split("-");
    const locSplit = locString.split(",");
    const loc = {
      x: parseInt(locSplit[0]),
      y: parseInt(locSplit[1]),
    };

    return [directions.UP, directions.LEFT, directions.RIGHT, directions.DOWN]
      .map((newDirString) => {
        if (newDirString === getOppositeDirectionString(dirString)) return;
        const coor = applyDirection(loc, directionCoors[newDirString]);
        if (map[coor.y][coor.x] !== "E" && map[coor.y][coor.x] !== ".") return;
        return {
          neighbor: `${coor.x},${coor.y}-${newDirString}`,
          distance: newDirString === dirString ? 1 : 1001,
        };
      })
      .filter((x) => x);
  };
  const shortestPathScore = findShortestPathLength(
    startString,
    getNeighbors,
    isEnd
  );

  const set = new Set();
  const shortest = {};
  let currentStates = [sn];
  while (currentStates.length) {
    const newStates = [];
    for (const state of currentStates) {
      const hash = `${state.x},${state.y}-${state.dir}`;
      if (map[state.y][state.x] === "E") {
        state.history.split("_").forEach((m) => set.add(m));
        continue;
      }
      if (shortest[hash] && shortest[hash] < state.distance) {
        continue;
      }
      shortest[hash] = state.distance;

      const opo = getOppositeDirectionString(state.dir);
      const states = [
        directions.UP,
        directions.LEFT,
        directions.RIGHT,
        directions.DOWN,
      ]
        .filter((st) => st !== opo)
        .map((newDirString) => {
          const coor = applyDirection(state, directionCoors[newDirString]);
          if (map[coor.y][coor.x] !== "E" && map[coor.y][coor.x] !== ".") {
            return;
          }

          return {
            ...coor,
            dir: newDirString,
            distance: state.distance + (newDirString === state.dir ? 1 : 1001),
            history: state.history + "_" + state.x + "," + state.y,
          };
        })
        .filter((st) => !!st && st.distance <= shortestPathScore);
      newStates.push(states);
    }
    currentStates = newStates.flat();
  }
  return [shortestPathScore, set.size];
}

module.exports = solve;
