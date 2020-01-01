const utilities = require("./utilities");
const maze = getInput();
const connectedNodes = {};
const connectedPortals = {};

for (let i = 0; i < maze.length; i++) {
  for (let j = 0; j < maze[0].length; j++) {
    if (maze[i][j] === ".") {
      parse(i, j);
    }
  }
}

console.log(connectedPortals);
const portals = Object.entries(connectedPortals);
const matrix = {};
portals.forEach(a => {
  matrix[a[0]] = {};
  portals.forEach(b => {
    if (a[0] === b[0]) return;
    const result = utilities.getMinimumSteps(
      pos => connectedNodes[pos],
      a[1],
      b[1]
    );
    if (result.success) {
      matrix[a[0]][b[0]] = result.steps;
    }
  });
});

console.log(JSON.stringify(matrix));

function parse(i, j) {
  connectedNodes[`${i},${j}`] = [];
  [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ].forEach(([iShift, jShift]) => {
    if (maze[i + iShift] !== undefined) {
      const neighbour = maze[i + iShift][j + jShift];
      if (neighbour === ".") {
        connectedNodes[`${i},${j}`].push(`${i + iShift},${j + jShift}`);
      } else if (neighbour.match(/[A-Z]/)) {
        const portalCode = [
          maze[i + iShift][j + jShift],
          maze[i + 2 * iShift][j + 2 * jShift]
        ];
        if (iShift === -1 || jShift === -1) portalCode.reverse();
        let portal = portalCode.join("");
        if (i > 3 && i < maze.length - 3 && j > 3 && j < maze[0].length - 3) {
          portal += "I";
        } else {
          portal += "O";
        }
        if (connectedPortals[portal] === undefined) {
          connectedPortals[portal] = `${i},${j}`;
        } else console.log("SCREAM!");
      }
    }
  });
}

function getInput() {
  return `             Z   F R                         
             Z   D E                         
  ###########.#.#.#.#######.###############  
  ###########.#.#.....#####.###############  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F                      #.#.#.#  
  #.###.#    D                      #.#.#.#  
  #.#...#                           #...#.#  
  ....#.#                           #......  
  ###.###      R                    #.#.#.#  
  #.....#      E                    #.#.#.#  
  ###.#########.#.###.#######.#########.###  
  #.......#.....#.#...#...............#...#  
  #########.###.#.#.###.###################  
               A                             
               A                             `.split(
    "\n"
  );
}
