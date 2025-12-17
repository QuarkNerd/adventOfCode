const input = require(`fs`).readFileSync(`input`).toString`utf8`.split(
  /\r?\n\r?\n/
);

const areas = input
  .slice(0, 6)
  .map((piece) => piece.split("").filter((ch) => ch === "#").length);

console.log(input[6].split(/\r?\n/).filter(fits).length);

function fits(line) {
  const [area, numbers] = line.split(": ");
  return (
    eval(area.replace("x", "*")) >=
    numbers
      .split(" ")
      .map((number, i) => number * areas[i])
      .reduce((a, b) => a + b, 0)
  );
}
