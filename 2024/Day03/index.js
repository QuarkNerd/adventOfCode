function solve(inputString) {
  const regex = /(\w+'?t?)\(((\d{1,3}),(\d{1,3}))?\)/g;
  const matches = inputString.matchAll(regex);

  let shouldDo = true;
  let valid = 0;
  let invalid = 0;

  [...matches].forEach((x) => {
    shouldDo = x[0] === "do()" ? true : x[0] == "don't()" ? false : shouldDo;
    if (x[1] == "mul") {
      const product = parseInt(x[3]) * parseInt(x[4]);
      if (shouldDo) {
        valid += product;
      } else {
        invalid += product;
      }
    }
  })

  return [valid + invalid, valid];
}

module.exports = solve;
