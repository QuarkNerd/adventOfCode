function solve(inputString) {
  const [startingValues, instructionString] = inputString.split(/\r?\n\r?\n/);
  let [A, B, C] = [...startingValues.matchAll(/\d+/g)].map((a) => BigInt(a[0]));
  const instructions = [...instructionString.matchAll(/\d+/g)].map((a) =>
    BigInt(a[0])
  );

  const partOne = solvePartOne([A, B , C], instructions);

  let i = 0n;
  let d = 1;
  let out = [];
  while (out.join(",") != instructions.join(",")) {
    out = solvePartOne([i, 0n, 0n], instructions);
    if (out.join(",") == instructions.join(",")) {
      break;
    }

    if (
      out.slice(out.length - d).join(",") ==
      instructions.slice(instructions.length - d).join(",")
    ) {
      d++;
      i *= 8n;
      i--;
    }
    i++;
  }

  return [partOne.join(','), i];
}

function solvePartOne([A, B, C], instructions) {
  let out = [];

  let i = 0n;
  while (i < instructions.length) {
    const [opcode, operand] = [instructions[i], instructions[i + 1n]];
    switch (opcode) {
      case 0n:
        A = A >> getComboOperandValue(operand);
        break;
      case 1n:
        B = B ^ operand;
        break;
      case 2n:
        B = getComboOperandValue(operand) & 0b111n;
        break;
      case 3n:
        if (A === 0n) {
          break;
        }
        i = operand;
        continue;
      case 4n:
        B = B ^ C;
        break;
      case 5n:
        out.push(getComboOperandValue(operand) % 8n);
        break;
      case 6n:
        B = A >> getComboOperandValue(operand);
        break;
      case 7n:
        C = A >> getComboOperandValue(operand);
        break;
    }
    i += 2n;
    if (out.length > instructions.length) {
      break;
    }
  }

  function getComboOperandValue(operand) {
    switch (operand) {
      case 0n:
      case 1n:
      case 2n:
      case 3n:
        return operand;
      case 4n:
        return A;
      case 5n:
        return B;
      case 6n:
        return C;
      default:
        throw new Error("Invalid combo operand");
    }
  }
  return out;
}

module.exports = solve;
