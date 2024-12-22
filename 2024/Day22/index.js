const totalBananas = {};
function solve(inputString) {
  const generated = inputString
    .split(/\r?\n/)
    .map((x) => BigInt(x))
    .map(generate);

  return [
    generated.reduce((a, b) => a + b.secret, BigInt(0)),
    Math.max(...Object.values(totalBananas)),
  ];
}

function generate(secret) {
  const changesToBananas = {};
  const diffs = [];
  for (let i = 0; i < 2000; i++) {
    const next = step(secret);

    const bananas = next % BigInt(10);
    const diff = bananas - (secret % BigInt(10));
    diffs.unshift(diff);
    if (diffs.length >= 4) {
      const key = diffs.slice(0, 4).join(",");
      if (!changesToBananas[key]) {
        changesToBananas[key] = true;
        totalBananas[key] = totalBananas[key]
          ? totalBananas[key] + parseInt(bananas)
          : parseInt(bananas);
      }
    }

    secret = next;
  }
  return { secret, changesToBananas };
}

function step(secret) {
  secret = mixAndPrune(secret, secret * BigInt(64)); //6
  secret = mixAndPrune(secret, secret / BigInt(32)); //5
  secret = mixAndPrune(secret, secret * BigInt(2048)); //11
  // console.log(secret);
  return secret;
}

function mixAndPrune(secret, value) {
  const mixed = secret ^ value;
  return mixed % BigInt(16777216); //24
}

module.exports = solve;
