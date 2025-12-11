const input = require(`fs`).readFileSync(`input`).toString`utf8`
  .split(/\r?\n/)
  .map((line) => line.split(": "))
  .map(([ins, outs]) => [ins, outs.split(" ")]);
const inToOut = Object.fromEntries(input);

console.log(solve("you", "out"));
console.log(
  solve("svr", "dac") * solve("dac", "fft") * solve("fft", "out") +
    solve("svr", "fft") * solve("fft", "dac") * solve("dac", "out")
);

function solve(start, end) {
  const partOneNodes = new Set([start]);
  let size = 0;
  while (partOneNodes.size > size) {
    size = partOneNodes.size;
    [...partOneNodes]
      .flatMap((n) => inToOut[n])
      .filter((x) => x !== undefined)
      .forEach(partOneNodes.add, partOneNodes);
  }

  const outToIn = {};
  for (const [inPath, outs] of input) {
    if (!partOneNodes.has(inPath)) continue;
    for (const out of outs) {
      if (!partOneNodes.has(out)) continue;
      if (!outToIn[out]) outToIn[out] = [];
      outToIn[out].push(inPath);
    }
  }
  // need to ignore ones that arent reached
  const outToWays = { [start]: 1 };
  while (!outToWays[end]) {
    if (!Object.keys(outToIn).length) return 0;
    for (const out in outToIn) {
      const ways = outToIn[out]
        .map((l) => outToWays[l])
        .reduce((a, b) => a + b, 0);
      if (!isNaN(ways)) {
        delete outToIn[out];
      }
      outToWays[out] = ways;
    }
  }
  return outToWays[end];
}
