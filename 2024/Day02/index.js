const FULLY_SAFE = "FULLY_SAFE";
const BASICALLY_SAFE = "BASICALLY_SAFE";
const UNSAFE = "UNSAFE";

function solve(inputString) {
  const results = inputString
    .split(/\r?\n/)
    .map((x) => x.split(" ").map((x) => parseInt(x)))
    .map(isSafeP2);

  const fullySafe = results.filter((x) => x === FULLY_SAFE).length;
  const basicallySafe = results.filter((x) => x === BASICALLY_SAFE).length;

  return [fullySafe, fullySafe + basicallySafe];
}

function isSafeP1(report) {
  let isDecreasing = true;
  let isIncreasing = true;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i + 1] - report[i];
    if (!diff || Math.abs(diff) > 3) return false;
    if (diff < 0) isIncreasing = false;
    if (diff > 0) isDecreasing = false;
  }

  return isIncreasing || isDecreasing;
}

function isSafeP2(report) {
  if (isSafeP1(report)) return FULLY_SAFE;
  if (isSafeP1(report.slice(1))) return BASICALLY_SAFE;
  if (isSafeP1(report.toSpliced(1, 1))) return BASICALLY_SAFE;
  if (report[0] === report[1]) return UNSAFE;

  let isIncreasing = report[1] > report[0];
  let alreadyViolated = false;

  let prevValue = report[0];
  let i = 0;
  while (i < report.length - 1) {
    i++;
    const currentValue = report[i];
    const diff = currentValue - prevValue;
    const isStepIncreasing = currentValue > prevValue;
    if (!diff || Math.abs(diff) > 3 || isIncreasing !== isStepIncreasing) {
      if (alreadyViolated) return UNSAFE;
      alreadyViolated = true;
      continue;
    }
    prevValue = currentValue;
  }
  return BASICALLY_SAFE;
}

module.exports = solve;
