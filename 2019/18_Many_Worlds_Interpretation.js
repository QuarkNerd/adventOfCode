const { getIndexToInsertInSortedArray } = require("./utilities.js");

const STARTING_POSITION = "@";
const input = getInput();

// positions, doors, keys, starting, point and spaces. ConnectedPositionHash shows direct one-step neighbors.
// Node = doors keys and starting point.
// State = "{NODE}-{keys}"

console.time();
solvePartOne();
console.timeEnd();
//solvePartTwo();

function solvePartOne() {
  const [connectedPositionsHash, doors, keys] = parseMap(input);
  const nodes = [...doors, ...keys];
  const connectedNodesHash = getConnectedNodesHash(
    connectedPositionsHash,
    [...nodes, STARTING_POSITION],
    nodes
  );

  const getNeighbors = (state) => {
    const node = state.split("-")[0];
    const keys = state.split("-")[1] ?? "";
    const keysArray = keys.split("");

    const neighbors = connectedNodesHash[node].map(({ neighbor, distance }) => {
      if (isDoor(neighbor)) {
        if (!keysArray.includes(neighbor.toLowerCase())) return;
        neighbor = `${neighbor}-${keys}`;
      } else if (isKey(neighbor)) {
        const newKeysArray = [...new Set([...keysArray, neighbor])].sort();
        neighbor = `${neighbor}-${newKeysArray.join("")}`;
      } else throw new Error("Unidentified node", neighbor);

      return { neighbor, distance };
    });
    return neighbors.filter((n) => n !== undefined);
  };

  const isFinalState = (state) => state.split("-")[1].length === keys.length;

  const steps = findShortestPathLength(
    `${STARTING_POSITION}-`,
    getNeighbors,
    isFinalState
  );
  console.log("Part one: ", steps);
}

function solvePartTwo() {
  const map = getModifiedMap(input);
  const [connectedPositionsHash, doors, keys] = parseMap(map);
  const nodes = [...doors, ...keys];
  const connectedNodesHash = getConnectedNodesHash(
    connectedPositionsHash,
    [...nodes, 0, 1, 2, 3],
    nodes
  );

  const getNeighbors = (state) => {
    const nodesArray = state.split("-")[0].split(",");
    const keys = state.split("-")[1] ?? "";
    const keysArray = keys.split("");
    const allNeighbors = [];    

    for (let i = 0; i < nodesArray.length; i++) {
      const subMapNeighbors = connectedNodesHash[nodesArray[i]].map(
        ({ neighbor, distance }) => {
          const newNodesArray = [...nodesArray];
          newNodesArray[i] = neighbor;
          const newNodes = newNodesArray.join(',');
          if (isDoor(neighbor)) {
            if (!keysArray.includes(neighbor.toLowerCase())) return;
            neighbor = `${newNodes}-${keys}`;
          } else if (isKey(neighbor)) {
            const newKeysArray = [...new Set([...keysArray, neighbor])].sort();
            neighbor = `${newNodes}-${newKeysArray.join("")}`;
          } else throw new Error("Unidentified node", neighbor);

          return { neighbor, distance };
        }
      );
      allNeighbors.push(subMapNeighbors.filter((n) => n !== undefined));
    }
    return allNeighbors.flat();
  };

  let aaaa = 0;
  const isFinalState = (state) => {
    if (state.split("-")[1].length > aaaa) {
      console.log(state.split("-")[1]);
      aaaa = state.split("-")[1].length;
    }
    return state.split("-")[1].length === keys.length;
  }

  const steps = findShortestPathLength(
    `0,1,2,3-`,
    getNeighbors,
    isFinalState
  );
  console.log("Part Two: ", steps);
}

function findShortestPathLength(startingState, getNeighbors, isFinalState) {
  const shortestDistancesHash = {
    [startingState]: 0,
  };

  const sortedStates = [startingState];

  const completedStatesDistance = {};

  while (true) {
    if (!sortedStates.length) throw new Error("Failed to find path");
    const stateValue = sortedStates.shift();
    const shortestDistance = shortestDistancesHash[stateValue];

    if (shortestDistancesHash[stateValue] === undefined) continue;

    const neighbors = [];
    if (isFinalState(stateValue)) return shortestDistance;
    getNeighbors(stateValue).forEach(({ neighbor, distance }) => {
      if (completedStatesDistance[neighbor] !== undefined) return;
      const oldDistance = shortestDistancesHash[neighbor] ?? Infinity;
      if (oldDistance > distance + shortestDistance) {
        shortestDistancesHash[neighbor] = distance + shortestDistance;
        neighbors.push(neighbor);
      }
    });

    neighbors.sort((a, b) =>
      shortestDistancesHash[a] < shortestDistancesHash[b] ? -1 : 1
    );

    neighbors.forEach((a) => {
      const index = getIndexToInsertInSortedArray(
        sortedStates,
        shortestDistancesHash[a],
        shortestDistancesHash
      );

      sortedStates.splice(index, 0, a);

      completedStatesDistance[stateValue] = shortestDistance;
      delete shortestDistancesHash[stateValue];
    });
  }
}

// startingNodes and endingNodes exist to remove @ from ending nodes so its ignored
// later on
function getConnectedNodesHash(
  connectedPositionsHash,
  startingNodes,
  endingNodes
) {
  const connectedNodesHash = {};

  for (let i = 0; i < startingNodes.length; i++) {
    const node = startingNodes[i];
    const visitedPositions = { [node]: true };
    let currentPositions = [node];
    connectedNodesHash[node] = [];
    let steps = 0;

    while (currentPositions.length) {
      steps++;
      currentPositions = currentPositions
        .flatMap((pos) => connectedPositionsHash[pos])
        .filter((pos) => !visitedPositions[pos]);
      currentPositions = [...new Set(currentPositions)];
      for (let j = currentPositions.length - 1; j >= 0; j--) {
        const neighbor = currentPositions[j];
        visitedPositions[neighbor] = true;
        if (endingNodes.includes(neighbor)) {
          connectedNodesHash[node].push({ distance: steps, neighbor });
          currentPositions.splice(j, 1);
        }
      }
    }
  }
  return connectedNodesHash;
}

function parseMap(map) {
  const doors = [];
  const keys = [];

  const connectedPositionsHash = {};

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      const position = getPositionIdentifier(map, i, j);
      //console.log(position);
      if (position === null) continue;
      if (isDoor(position)) doors.push(position);
      if (isKey(position)) keys.push(position);
      connectedPositionsHash[position] = [];
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].forEach(([iShift, jShift]) => {
        const neighbor = getPositionIdentifier(map, i + iShift, j + jShift);
        if (neighbor !== null) {
          connectedPositionsHash[position].push(neighbor);
        }
      });
    }
  }

  return [connectedPositionsHash, doors, keys];
}

// returns array of submaps that are used for part two of the puzzle.
function getModifiedMap(map) {
   let initialStartingCoors;
   for (let i = 0; i < map.length; i++) {
     for (let j = 0; j < map[0].length; j++) {
       if (map[i][j] === "@") {
         initialStartingCoors = { i, j };
       }
     }
   }

   [
     [1, 0],
     [-1, 0],
     [0, 1],
     [0, -1],
     [0, 0],
   ].forEach(
     ([iShift, jShift]) =>
       (map[initialStartingCoors.i + iShift][
         initialStartingCoors.j + jShift
       ] = "#")
   );

   [
     [1, 1],
     [-1, 1],
     [1, -1],
     [-1, -1],
   ].forEach(
     ([iShift, jShift], i) =>
       (map[initialStartingCoors.i + iShift][
         initialStartingCoors.j + jShift
       ] = i.toString())
   );

   return map;
}

function getPositionIdentifier(map, i, j) {
  const node = map[i]?.[j];
  if (node === "#" || node === undefined) return null;
  if (node === ".") return `${i},${j}`;
  return node;
}

function isDoor(node) {
  return (
    node.length === 1 && node.charCodeAt(0) >= 65 && node.charCodeAt(0) <= 90
  );
}

function isKey(node) {
  return (
    node.length === 1 && node.charCodeAt(0) >= 97 && node.charCodeAt(0) <= 122
  );
}

function getInput() {
  return `
#################################################################################
#.........#.............#.....#.....R.#.#.....#...............#.#..v............#
#######.#T#.#######.###.#####.#.###.#.#.#.###.#.#.###.#######.#.#.#####.#######.#
#.....#.#.#.#.......#.#.F...#...#...#...#...#.#.#...#.#.....#.#...#...#...#.....#
#.###.#.#.#.#.#######.#####.###.#.#####.#.#.###.###.###.###.#.#.#####.###.###.###
#.#.#...#.#.#..a..#.......#...#.#.#...#.#.#.......#.......#.#.#.#.....#.#...#...#
#L#.#####.#.#####.#.###.#.###.###.#.###.#.#########.#######.#.#.###.#.#.###.###.#
#.#.......#...#...#...#.#...#...#.#.#...#.....#...#.#.....#.#.#.....#.....#...#.#
#.###########.#.#####.#.###.###.#.#.#.#####.###.#.###.###.#.#.#####.#########.#.#
#.............#.#...#.#.#...#...#.#.#...#.#.#...#.....#...#.#...#...#.........#.#
#.#########.###.###.#.#.#####.###.#.###.#.#.#Z#########.###.###.#.###.#########.#
#...#.....#...#...#...#.......#...#.....#...#...#...#.#...#...#.#...#...#.......#
###.#.###.#######.#.###########.#.#.###########.#.#.#.###.#.#.#.#######.#######.#
#.#.#.#...#.......#.....#.......#.#.....#.......#.#.M.#...#.#.#.#.....#.#.....#.#
#.#.#.#.###.###########.#.#######.#######.#######.#####.#####.#.#.###.#.#.###.###
#.#.#.#.....#...#...G.#.#.....#.#.......#...B.#.#.....#.#..s..#...#.#.#.#.#.#...#
#.#.#.#######.###.#.###.#####.#.#######.#.###.#.#.###.#.#.#########.#.#.#.#.###.#
#...#.#...#.....#.#.#...#.......#.....#.#.#i..#...#.#.....#.....#.....#.....#...#
#.###.#.#.#####.#.#.#.###########.###.#.###.#####.#.#######.###X#.###########.#.#
#.#.#...#.#..c..#.#.....#.......#h#.#...#...#...#.....#..x#...#.#.#.........#.#.#
#.#.#####.#.#####.#####.#.#####.#.#.###W#.###.#Y#######D#.#.###.#.#####.###.#Q###
#...#...#.#.#.....#b..#...#.#...#.#...#.#...#.#....n..#.#...#.#.#.#.....#...#...#
###.#.#.#.#.#.#####.#######.#.###.#.#.#.#.#.#.#######.#.#####.#.#.#.#####.#####.#
#.#.#.#.#.#.......#.....#...#.....#.#.#.#.#.#.#.#.....#...#...#.#.#.#.#...#.....#
#.#.#.#.#.#.###########.###.#######.#.#.###.#.#.#N#######.#E###.#.#.#.#.###.###.#
#...#.#...#.#.#.....#...#.........#.#.#.#pI.#...#......d..#....e#...#.#.....#.#.#
#####.#####.#.#.###.#.###.#########.#.#.#.#####.#####################.#######.#.#
#.....#...#.#.#...#...#.......#.....#.#.#.....#y#.....................#.........#
#.#####.###.#.###.#####.#####.#.#####.#.#####.#.#.###########.###.###.#.#########
#...#.......#...#...#.#.#.#...#.#.....#.#...#.#.#...#.#.....#.#...#...#.........#
#.#.#.#########.###.#.#.#.#.#.#.#.###.#.###.#.#.###.#.#.###.###.###.###########.#
#.#.#.#...........#.#...#.#.#.#.#...#.#.#...#.P.#.....#.#.......#.........#...#.#
#.#.#.#.#####.#####.#.###.#.###.###.#.#.#.###########.#.#.#####.#########.#.#.#C#
#.#.#...#.#...#...#.#.....#...#.#.#.#.#.#.#.........#.#.#.#...#.#.....#.#...#.#.#
#.#.#####.#.###.#.#.#####.###.#.#.#.###.#.#.###.###.###.###.#.###.###.#.#.#####.#
#.#.#.......#.#.#.#.#.....#.#.#.#.#...#.#.#...#...#.....#...#.#...#.#.#.#.#.....#
###.#.#######.#.#.#.#.#####.#.#.#.###.#.#.###.###.###.###.###.#.###.#.#.#.#.#####
#...#.........#.#...#.#.....#...#...#.#.#.....#.#.#...#...#...#...#.#.#..o#...#.#
#.#############.#####.#####.#######.#.#.#.#####.#.#####.###.#####.#.#.#######.#.#
#...........U...#...................#...........#.........#.........#...........#
#######################################.@.#######################################
#.....#.O.#.....#.......#...#.....#...........#.....#.............#...#...#..k..#
#####.#.#.#.#.#.###.###.#.###.#.###.###.#.###.###.#.###.#####.###.#.#.#.#.#.#.#.#
#...#...#...#.#...#...#.#.#...#.....#...#...#...#.#...#.#.....#...#.#.#.#...#.#.#
#.#.#.#######.###.###.#.#.#.#########.#.###.###.#.###.#.#.#.#####.#.#.#######.#.#
#.#.#...#.....#.#...#.#...#...#...#...#.#...#...#.#...#.#.#.#...#.#.#..u#.....#.#
#.#.#####.#####.###.#.#######.###.#.###.#.#####.#.#.###.#.###.#.###.###.#.#####.#
#.#.......#.........#.......#...#.#.#...#.....#...#...#.#.#...#.....#.#.#.#.....#
#.#########.###########.###.###.#.#.#.#######.#######H###.#.#########.#.#.#######
#.....#...#...#.......#...#.......#.#.#.#.....#.....#.#...#.#.........#.#.#.....#
#####.#.#.###.#####.#.###.#########.#.#.#.#####.#.###.#.#.#.###.###.#.#.#.#.###.#
#.....#.#...#....r..#.#.....#...#...#..w#.#.....#.......#.#...#.#...#.#.#.....#.#
#.#####.#############.#######.#.#.#####.#.###.###############.#.#.###.#.#######.#
#.#.....#.....#...............#...#.#...#...#.......#.......#.#.#...#.#...#.....#
#.###.###.#.###.###################.#.###.#.#########.#####.#.#####.#####.#.###.#
#..q#.....#.....#...#.......#...#.....#.#.#...........#.#...#.....#.....#.#.#.#.#
###.#.###########.#.#.#####.#.###.#####.#.#############.#.#.#####.#.#.###.#.#.#.#
#.#.#.......#.....#...#...#.#...#.......#.#...#...#.....#.#.....#z#.#...#.#.#.#.#
#.#.#######.#.#########.#.#.#.#.#######.#.#.#.#.#.#####.#.###.###.#####.#.#.#.#.#
#.#.....#...#.....#.#...#...#.#.......#.#.#.#...#.......#.#...#...#.....#.#.#...#
#.#####.#########.#.#.#########.#######.#.#.#######.#####.#.###.###.###.#.#.###.#
#.....#.#...#.....#.#.#.K.......#.......#.#.#.....#.#.....#.#.#.#...#...#.#...#.#
#.#.###.#.#.#.#####.#####.#.#####.#######.#.###.#.#.#.#######.#.#.###.###.#.#.#.#
#.#...#...#.#.#.....#.....#.#.....#.....#.#...#.#...#.#.....#...#...#...#.#.#.#.#
#.###.#####.#.#.###.#.###.###.#####.#.#.#.###.#####.#.#.###.#####.#.###.#.###.#.#
#...#.#...#...#...#...#...#...#...#.#.#.#...#.#...#.#.....#.....#.#...#.#.J...#.#
###.#.#.#.#######.#####.###.###.#.###.#.###.#.#.#.#########.###.#.###.#########.#
#.#.#...#.........#...#...#.#...#...#.#.#.#.#...#...#.....#.#...#...#.#.........#
#.#.#######.#.#######.###.#.#.#####.#.#.#.#.#.#####.#.###.#.#.###.###.#.#########
#.#.#.....#.#.#.....#...#.#.#.#...#...#.#...#.#...#.#.#.#...#.#...#...#.#.......#
#.#.#.#####V#.#.###.#.###.#.#.#.#.#####.#.#####.#.#.#.#.#####.#.###.###.#.###.#.#
#...#...#...#j#...#.#...#.#...#.#.....#.#...#...#...#.#.......#...#.....#...#.#.#
#.#####.#.#######.#.###.#.#####.###.###.###.#.#####.#.###.#######.###########.#.#
#.......#.......#.#...#.#.#.......#.#...#...#...#...#...#.#...#...#...#.....#.#l#
#######.#####.#.#.###.#.#.#.#####.#.#.###.###.#.#.#####.###.#.#.###.#.#.#.#.#.#.#
#.....#.....#.#.#...#.#.#.#...#...#.#...#...#.#.#.....#.#...#...#...#...#.#...#.#
#.###.#####.#.###.###.#.#.###.#.#######.###.#.#.#######.#.#######.#######.#####.#
#.#..m..#...#.....#...#.....#.#.......#f#...#.#...#.....#.#...........#...#..t#.#
#.#.#####.#########.#########.#######.#.#.#######.#.#####.#############.###.###.#
#.#.......S.......#.....A...........#...#g........#.....................#.......#
#################################################################################`
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}
