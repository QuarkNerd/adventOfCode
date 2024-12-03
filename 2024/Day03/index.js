function solve(inputString) {
  const regex = /(\w+'?t?)\(((\d{1,3}),(\d{1,3}))?\)/g;
  const matches = inputString.matchAll(regex);

  let g = true;

  const one = matches
    .map((x) => {
      console.log(x[0]);
      if (x[0] === "do()") {
        g = true;
      }
      if (x[0] == "don't()") {
        g = false;
      }
      if (x[1] == "mul" && g) {
        console.log(x[3], "www", x[4]);
        return parseInt(x[3]) * parseInt(x[4]);
      }
      return 0;
    })
    .reduce((a, b) => a + b, 0);
  return [one, 0];
}

module.exports = solve;
