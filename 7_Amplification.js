// the code in this solution can 100% be cleaned up
const input =
  "3,8,1001,8,10,8,105,1,0,0,21,34,51,64,81,102,183,264,345,426,99999,3,9,102,2,9,9,1001,9,4,9,4,9,99,3,9,101,4,9,9,102,5,9,9,1001,9,2,9,4,9,99,3,9,101,3,9,9,1002,9,5,9,4,9,99,3,9,102,3,9,9,101,3,9,9,1002,9,4,9,4,9,99,3,9,1002,9,3,9,1001,9,5,9,1002,9,5,9,101,3,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99";
const B = input.split(",");
const intcode = B.map(entry => parseInt(entry));
solvePartOne();
solvePartTwo();

// both can be abstracted into using one function, but it took too long to solve this
function solvePartOne() {
  const allThrusterPhases = getAllPermutations([0, 1, 2, 3, 4]);
  let highestThrusterOutput = 0;
  let output;
  allThrusterPhases.forEach(thrusterPhase => {
    output = getThrusterOutputInNormalMode([...intcode], thrusterPhase);
    highestThrusterOutput = Math.max(output, highestThrusterOutput);
  });
  console.log(highestThrusterOutput);
}

function solvePartTwo() {
  const allThrusterPhases = getAllPermutations([9, 8, 7, 6, 5]);
  let highestThrusterOutput = 0;
  let output;
  allThrusterPhases.forEach(thrusterPhase => {
    output = getThrusterOutputInFeedbackMode([...intcode], thrusterPhase);
    highestThrusterOutput = Math.max(output, highestThrusterOutput);
  });
  console.log(highestThrusterOutput);
}

function getThrusterOutputInNormalMode(intcode, phaseOrder) {
  let input = 0;
  let result;
  for (let i = 0; i < phaseOrder.length; i++) {
    result = computeIntcode([...intcode], phaseOrder[i], input);
    input = result.value;
  }
  return input;
}

function getThrusterOutputInFeedbackMode(intcode, phaseOrder) {
  const intcodesList = Array.apply(null, Array(5)).map(_ => [...intcode]);
  let input = 0;
  let i = 0;
  const startingPos = [0, 0, 0, 0, 0];
  while (true) {
    // yes this is not good
    result = computeIntcode(
      intcodesList[i % 5],
      phaseOrder[i % 5],
      input,
      i > 4,
      startingPos[i % 5]
    );
    if (result.halted) {
      break;
    } else {
      startingPos[i % 5] = result.i;
      input = result.value;
      i++;
    }
  }
  return input;
}

function computeIntcode(
  C,
  phaseSetting,
  inputFromPrev,
  phaseGiven = false,
  startingPos = 0
) {
  let i = startingPos;
  let opcode;
  let instruction;
  let parameterModes = { 1: undefined, 2: undefined };
  while (i < C.length) {
    instruction = C[i];
    leave = false;
    opcode = instruction % 100;
    parameterModes = {
      1: parseInt(Math.round(instruction / 100)) % 10,
      2: parseInt(Math.round(instruction / 1000)) % 10
    };
    switch (opcode) {
      case 1:
        C[C[i + 3]] =
          getValue(C, i + 1, parameterModes[1]) +
          getValue(C, i + 2, parameterModes[2]);
        i += 4;
        break;
      case 2:
        C[C[i + 3]] =
          getValue(C, i + 1, parameterModes[1]) *
          getValue(C, i + 2, parameterModes[2]);
        i += 4;
        break;
      case 3:
        C[C[i + 1]] = phaseGiven ? inputFromPrev : phaseSetting;
        phaseGiven = true;
        i += 2;
        break;
      case 4:
        return {
          halted: false,
          value: getValue(C, i + 1, parameterModes[1]),
          i: i + 2
        };
      case 5:
        if (getValue(C, i + 1, parameterModes[1]) !== 0) {
          i = getValue(C, i + 2, parameterModes[2]);
        } else {
          i += 3;
        }
        break;
      case 6:
        if (getValue(C, i + 1, parameterModes[1]) === 0) {
          i = getValue(C, i + 2, parameterModes[2]);
        } else {
          i += 3;
        }
        break;
      case 7:
        if (
          getValue(C, i + 1, parameterModes[1]) <
          getValue(C, i + 2, parameterModes[2])
        ) {
          C[C[i + 3]] = 1;
        } else {
          C[C[i + 3]] = 0;
        }
        i += 4;
        break;
      case 8:
        if (
          getValue(C, i + 1, parameterModes[1]) ==
          getValue(C, i + 2, parameterModes[2])
        ) {
          C[C[i + 3]] = 1;
        } else {
          C[C[i + 3]] = 0;
        }
        i += 4;
        break;
      case 99:
        return { halted: true };
    }
  }
  return C;
}

function getValue(intcode, ID, parameterMode) {
  if (parameterMode == 0) {
    return intcode[intcode[ID]];
  } else if (parameterMode == 1) {
    return intcode[ID];
  } else {
    console.log("error", ID, parameterMode);
  }
}

function getAllPermutations(array) {
  if (array.length < 2) {
    return [array];
  }
  const permutations = [];
  getAllPermutations(array.slice(1)).forEach(perm => {
    permutations.push(...insertEveryWhere(perm, array[0]));
  });
  return permutations;
}
function insertEveryWhere(array, element) {
  const result = [];
  let newArray = [...array];
  for (let i = 0; i < newArray.length + 1; i++) {
    newArray.splice(i, 0, element);
    result.push(newArray);
    newArray = [...array];
  }
  return result;
}
