// const directions = [
//   { x: -1, y: 0 },
//   { x: 1, y: 0 },
//   { x: 0, y: 1 },
//   { x: 0, y: -1 },
// ];

// function solve(inputString) {
//   const map = inputString
//     .split(/\r?\n/)
//     .map((line) => line.split("").map((x) => parseInt(x)));

//   let nodes = {};
//   for (let y = 0; y < map.length; y++) {
//     for (let x = 0; x < map[0].length; x++) {
//       if (map[y][x] === 0) {
//         nodes[`${y},${x}`] = 1;
//       }
//     }
//   }
//   let total = 0;
//   Object.keys(nodes).forEach((node) => {
//     const [y, x] = node.split(",").map((x) => parseInt(x));
//     let nodes = [[y, x]];
//     for (let i = 0; i < 9; i++) {
//       let nextNodes = [];
//       nodes.forEach(([currY, currX]) => {
//         directions.forEach((dir) => {
//           const newX = currX + dir.x;
//           const newY = currY + dir.y;
//           // console.log(newX, newY);
//           if (map[newY]?.[newX] === i + 1) {
//             nextNodes.push([newY, newX]);
//           }
//         });
//       });
//       nodes = nextNodes;
//     }
//     const set = new Set(nodes.map((n) => n.toString()));
//     total += set.size;
//   });
//   //   let newNodes = {};
//   //   Object.entries(nodes).map(([node, count]) => {
//   //     // console.log({ node, count });
//   //     const [y, x] = node.split(",").map((x) => parseInt(x));
//   //     directions.forEach((dir) => {
//   //       const newX = x + dir.x;
//   //       const newY = y + dir.y;
//   //       // console.log(newX, newY);
//   //       if (map[newY]?.[newX] === i + 1) {
//   //         if (!newNodes[`${newY},${newX}`]) newNodes[`${newY},${newX}`] = 0;
//   //         newNodes[`${newY},${newX}`] += count;
//   //       }
//   //     });
//   //   });
//   //   nodes = newNodes;
//   //   console.log(nodes);
//   // }

//   return [total, 0];
// }

// module.exports = solve;

const directions = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function solve(inputString) {
  const map = inputString
    .split(/\r?\n/)
    .map((line) => line.split("").map((x) => parseInt(x)));

  let nodes = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 9) {
        nodes[`${y},${x}`] = 1;
      }
    }
  }

  for (let i = 8; i >= 0; i--) {
    let newNodes = {};
    Object.entries(nodes).map(([node, count]) => {
      // console.log({ node, count });
      const [y, x] = node.split(",").map((x) => parseInt(x));
      directions.forEach((dir) => {
        const newX = x + dir.x;
        const newY = y + dir.y;
        // console.log(newX, newY);

        if (map[newY]?.[newX] === i) {
          if (!newNodes[`${newY},${newX}`]) newNodes[`${newY},${newX}`] = 0;
          newNodes[`${newY},${newX}`] += count;
        }
      });
    });
    nodes = newNodes;
    console.log(nodes);
  }

  return [Object.values(nodes).reduce((a, b) => a + b, 0), 0];
}

module.exports = solve;
