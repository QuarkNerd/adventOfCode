// call this file with `node ./runner.js 05` replacing 05 with the day

// load
const fs = require("fs");
const day = process.argv[2];
const useSample = !!process.argv[3];
const dayString = day.length === 1 ? "0" + day : day;
const folder = `./Day${dayString}`;
const solve = require(`${folder}/index.js`);
const inputFileName = useSample ? 'sample' : 'input';
const input = fs.readFileSync(`${folder}/${inputFileName}`).toString("utf8");

console.time();
const solution = solve(input);
console.timeEnd();

console.log("Part one:", solution[0]);
console.log("Part two:", solution[1]);
