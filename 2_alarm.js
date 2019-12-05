const A =
  "1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,6,19,2,19,6,23,1,23,5,27,1,9,27,31,1,31,10,35,2,35,9,39,1,5,39,43,2,43,9,47,1,5,47,51,2,51,13,55,1,55,10,59,1,59,10,63,2,9,63,67,1,67,5,71,2,13,71,75,1,75,10,79,1,79,6,83,2,13,83,87,1,87,6,91,1,6,91,95,1,10,95,99,2,99,6,103,1,103,5,107,2,6,107,111,1,10,111,115,1,115,5,119,2,6,119,123,1,123,5,127,2,127,6,131,1,131,5,135,1,2,135,139,1,139,13,0,99,2,0,14,0";
const B = A.split(",");
const intcode = B.map(entry => parseInt(entry));
////////////////////////////Part 1
// intcode[1] = 12;
// intcode[2] = 2;
// finalCode = computeAlarm(intcode);
// console.log(C[0]);
///////////////////////////////Part 1 end

for (let i = 0; i < 99; i++) {
  for (let j = 0; j < 99; j++) {
    intcode[1] = i;
    intcode[2] = j;
    if (computeAlarm(intcode)[0] == 19690720) {
      console.log(i * 100 + j);
    }
  }
}

function computeAlarm(intcode) {
  C = [...intcode];
  for (let i = 0; i < C.length; i += 4) {
    let leave = false;
    switch (C[i]) {
      case 1:
        C[C[i + 3]] = C[C[i + 1]] + C[C[i + 2]];
        break;
      case 2:
        C[C[i + 3]] = C[C[i + 1]] * C[C[i + 2]];
        break;
      case 99:
        // console.log("halt");
        leave = true;
        break;
      default:
        console.log(i);
    }
    if (leave) {
      break;
    }
  }
  return C;
}
