// call this file with `node ./runner.js 05` replacing 05 with the day

// load
const fs = require("fs");
const day = process.argv[2];
const dayString = day.length === 1 ? "0" + day : day;
const folder = `./Day${dayString}`;
const solve = require(`${folder}/index.js`);
const input = fs.readFileSync(`${folder}/input`).toString("utf8");

console.time();
const solution = solve(input);
console.timeEnd();

console.log("Part one:", solution[0]);
console.log("Part two:", solution[1]);
