const {stacks, instructionList} = require('./parsedInput')
const { DEFAULT_FOREGROUND_ANSI, DEFAULT_BOT_Y, FRAME_HEIGHT } = require('./constants');
const { txtColour, displayBox } = require('./utils');
const outputFrame = require('./outputFrame');

console.log(DEFAULT_FOREGROUND_ANSI);

// x,y defined from top left corner of screen, as position of the robots nose .
//
// Motion States
// HORIZONTOL: index = null
// VERTICAL: index is 0 if currently moving, > 0 if about to move
// MOVE_BOX: index 0 for box `securely` on robot head,  1,2,3 for progressively closer to the stack on the right and negatives for left

const bot = {
    x: 37, y: DEFAULT_BOT_Y, carrying: null, motionState: {
        type: 'HORIZONTOL',
        index: null
    }
}

let backgroundFrame = getFrameBackground(stacks);
for(let i = 0; i < instructionList.length; i++) {
    const instruction = instructionList[i];
    moveToTopOfStack(backgroundFrame, bot, instruction.from);
    bot.motionState.type = 'MOVE_BOX';
    bot.carrying = stacks[instruction.from - 1].pop();
    backgroundFrame = getFrameBackground(stacks);
    const indexMultiplier = instruction.from%2 ? -1 : 1;
    for (let j = 3; j > -1; j--) {
        bot.motionState.index = indexMultiplier*j;
        outputFrame(backgroundFrame, bot);
    }
    outputFrame(backgroundFrame, bot);
    outputFrame(backgroundFrame, bot);

    moveToTopOfStack(backgroundFrame, bot, instruction.to, -1);
    bot.motionState.type = 'MOVE_BOX';
    const toIndexMultiplier = instruction.to%2 ? -1 : 1;
    for (let j = 0; j < 4; j++) {
        bot.motionState.index = toIndexMultiplier*j;
        outputFrame(backgroundFrame, bot);
    }
    bot.motionState.index = 0;
    stacks[instruction.to - 1].push(bot.carrying);
    bot.carrying = null;
    backgroundFrame = getFrameBackground(stacks);
    outputFrame(backgroundFrame, bot);
    outputFrame(backgroundFrame, bot);
    outputFrame(backgroundFrame, bot);
};

function moveToTopOfStack(base, bot, stackNum, Yoffset = 0) {
    const targetX = 7 + 15*Math.ceil(stackNum/2 - 1);

    if (targetX !== bot.x) {

        outputFrame(base, bot);
        if (bot.y !== DEFAULT_BOT_Y) {
            moveToY(base, bot, DEFAULT_BOT_Y);
        }
        
        bot.motionState.type = 'HORIZONTOL';
        const signDiff = Math.sign(targetX - bot.x);
        while(targetX !== bot.x) {
            bot.x += signDiff;
            outputFrame(base, bot);
        }
        bot.motionState.type = 'HORIZONTOL';
    }

    const targetY = (FRAME_HEIGHT - 5 - stacks[stackNum - 1].length) + Yoffset;

    if (targetY !== bot.y) {
        moveToY(base, bot, targetY);
    }
}

function moveToY(base, bot, y) {
    bot.motionState.type = 'VERTICAL';

    for (let i = 0; i < 6; i++) {
        bot.motionState.index = 6 - i;
        outputFrame(base, bot);
    }
    bot.motionState.index = 0;

    while (bot.y !== y) {
        bot.y += Math.sign(y - bot.y);
        outputFrame(base, bot);
    }
}

// Returns the background of the frame as an array of strings, 
// each string represneting a row of the frame.
// No colours are added here, this is because colour characters 
// affect the calculations of modifying the frames later on
// transformForDisplay is used to add colour
function getFrameBackground(stacks) {
  const frame = [];
  for (let height = FRAME_HEIGHT - 6; height > -1; height--) {
    let line = '';
    for (let j = 0; j < 4; j++) {
      const leftBox = stacks[2*j][height];
      const rightBox = stacks[2*j + 1][height];
      line += displayBox(leftBox) + '         ' + displayBox(rightBox);
    }

    const rightMost = stacks[8][height];
    line +=  displayBox(rightMost)+ '      ';
    frame.push(line);
  }

  frame.push('===]       [======]       [======]       [======]       [======]     ');

  for(let i = 0; i < 2; i++) frame.push('|             ||             ||             ||             ||        ');

  frame.push('|   b         ||   b         ||   b         ||   b         ||   b    ');
  frame.push('|   h         ||   h         ||   h         ||   h         ||   h    ');
  frame.push('==========================================================================');

  const topBoxes = stacks.map(stack => stack.length ? `l${stack[stack.length - 1]}r`: txtColour(` # `, 'RED')).join('');

  frame.push(topBoxes);
  return frame;
}
