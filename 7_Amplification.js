//const input =
//  "3,8,1001,8,10,8,105,1,0,0,21,34,51,64,81,102,183,264,345,426,99999,3,9,102,2,9,9,1001,9,4,9,4,9,99,3,9,101,4,9,9,102,5,9,9,1001,9,2,9,4,9,99,3,9,101,3,9,9,1002,9,5,9,4,9,99,3,9,102,3,9,9,101,3,9,9,1002,9,4,9,4,9,99,3,9,1002,9,3,9,1001,9,5,9,1002,9,5,9,101,3,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99";
const input =
  "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";
const B = input.split(",");
const intcode = B.map(entry => parseInt(entry));

const allThrusterPhases = getAllPermutations([0, 1, 2, 3, 4]);
let highestThrusterOutput = 0;
let output;
allThrusterPhases.forEach(thrusterPhase => {
  output = getThrusterOutputInNormalMode([...intcode], thrusterPhase);
  highestThrusterOutput = Math.max(output, highestThrusterOutput);
});

//console.log(highestThrusterOutput);

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

function getThrusterOutputInNormalMode(intcode, phaseOrder) {
  let input = 0;
  for (let i = 0; i < phaseOrder.length; i++) {
    input = computeAmp([...intcode], phaseOrder[i], input);
  }
  return input;
}

console.log(getThrusterOutputInFeedbackMode(intcode, [9, 8, 7, 6, 5]));

function getThrusterOutputInFeedbackMode(intcode, phaseOrder) {
  let input = 0;
  for (let i = 0; i < phaseOrder.length; i++) {
    input = computeAmp(intcode, phaseOrder[i], input);
  }
  return input;
}

function computeAmp(C, phaseSetting, inputFromPrev) {
  let i = 0;
  let leave;
  let opcode;
  let instruction;
  let parameterModes = { 1: undefined, 2: undefined };
  let isAfterFirstInputForAmp = false;
  while (i < C.length) {
    instruction = C[i];
    leave = false;
    opcode = instruction % 100;
    parameterModes = {
      1: parseInt(instruction / 100) % 10,
      2: parseInt(instruction / 1000) % 10,
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
        console.log("AAAAAAA");
        C[C[i + 1]] = isAfterFirstInputForAmp ? inputFromPrev : phaseSetting;
        isAfterFirstInputForAmp = true;
        i += 2;
        break;
      case 4:
        return getValue(C, i + 1, 0);
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
        console.log("halt");
        leave = true;
        break;
    }
    if (leave) {
      break;
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
