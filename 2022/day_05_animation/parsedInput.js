const fs = require('fs');
const {EOL} = require('os');

const file = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});

function parseInput(txt) {
  const [stacksText, instructionsText] = txt.split(EOL + EOL);

  const stackLines = stacksText.split(EOL);
  const stacks = (new Array(9)).fill(0).map((x,i) => i).map(
    stackNum => {
        const stack = [];
        for (let i = stackLines.length - 2; i >= 0;  i--) {
            const box = stackLines[i][4*stackNum + 1];
            if (box === ' ') break;
            stack.push(box);
        }
        return stack
    }
  );

    const instructionList = instructionsText.split(EOL).flatMap(line => {
        const splitInstruction = line.split(' ');
        return (new Array(parseInt(splitInstruction[1]))).fill({
            from: parseInt(splitInstruction[3]),
            to: parseInt(splitInstruction[5])
        })
    });

    return {stacks, instructionList};
}

module.exports = parseInput(file);
