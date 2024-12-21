// Button A: X+(X_A), Y+(Y_A)
// Button B: X+(X_B), Y+(Y_B)
// Prize: X=(X_T), Y=(Y_T)

function solve(inputString) {
  const stringDefs = inputString.split(/\r?\n\r?\n/);
  const coefficents = stringDefs.map(getCoefficents);
  const P1 = coefficents.map(calcTokens).reduce((a, b) => a + b, 0);
  coefficents.forEach((coef) => {
    coef.Y_T += 10000000000000;
    coef.X_T += 10000000000000;
  });
  const P2 = coefficents.map(calcTokens).reduce((a, b) => a + b, 0);

  return [P1, P2];
}

function getCoefficents(machine) {
  const [X_A, Y_A, X_B, Y_B, X_T, Y_T] = [...machine.matchAll(/\d+/g)].map(
    (a) => parseInt(a)
  );
  return { X_A, Y_A, X_B, Y_B, X_T, Y_T };
}

function calcTokens({ X_A, Y_A, X_B, Y_B, X_T, Y_T }) {
  const a = (Y_T * X_A - Y_A * X_T) / (Y_B * X_A - X_B * Y_A);
  const b = (Y_T * X_B - Y_B * X_T) / (Y_A * X_B - X_A * Y_B);

  if (a % 1 === 0 && b % 1 === 0) return a + 3 * b;
  return 0;
}

module.exports = solve;
