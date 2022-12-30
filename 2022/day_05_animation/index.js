const {stacks, instructionList} = require('./parsedInput')
const { DEFAULT_FOREGROUND_ANSI, DEFAULT_BOT_Y, FRAME_HEIGHT } = require('./constants');
const { txtColour, getBoxDisplay, getBoxFromState } = require('./utils');
const outputFrame = require('./outputFrame');

console.log(DEFAULT_FOREGROUND_ANSI);

// x,y defined from top left corner of screen, as position of the robots nose .
//
// Motion States
// HORIZONTOL: index = null
// VERTICAL: index is 0 if currently moving, > 0 if about to move
// MOVE_BOX: index 0 for box `securely`,  1,2,3 for progressively closer to right stack and negatives for left

// MOVE_BOX: index 0 for box `securely`,  1,2,3 for progressively closer to right stack and negatives for left

const bot = {
    x: 37, y: DEFAULT_BOT_Y, carrying: null, motionState: {
        type: 'HORIZONTOL',
        index: null
    }
}

let base = getBaseRows(stacks);
for(let i = 0; i < instructionList.length; i++) {
    const instruction = instructionList[i];
    moveToTopOfStack(base, bot, instruction.from);
    bot.motionState.type = 'MOVE_BOX';
    bot.carrying = stacks[instruction.from - 1].pop();
    base = getBaseRows(stacks);
    const indexMultiplier = instruction.from%2 ? -1 : 1;
    for (let j = 3; j > -1; j--) {
        bot.motionState.index = indexMultiplier*j;
        outputFrame(base, bot);
    }
    outputFrame(base, bot);
    outputFrame(base, bot);

    moveToTopOfStack(base, bot, instruction.to, -1);
    bot.motionState.type = 'MOVE_BOX';
    const toIndexMultiplier = instruction.to%2 ? -1 : 1;
    for (let j = 0; j < 4; j++) {
        bot.motionState.index = toIndexMultiplier*j;
        outputFrame(base, bot);
    }
    bot.motionState.index = 0;
    stacks[instruction.to - 1].push(bot.carrying);
    bot.carrying = null;
    base = getBaseRows(stacks);
    outputFrame(base, bot);
    outputFrame(base, bot);
    outputFrame(base, bot);
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

        // if (bot.carrying && signDiff == -1 && Math.random() < 0.99) {
        //     bot.motionState.type = 'DODGY';
        //     for(let i = 0; i < 16; i++) {
        //         // bot.x += signDiff;
        //         bot.motionState.index = i;
        //         outputFrame(base, bot);
        //     }
        // }
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

function getBaseRows(stacks) {
  const rows = [];
  for (let height = FRAME_HEIGHT - 6; height > -1; height--) {
    let line = '';
    for (let j = 0; j < 4; j++) {
      const leftBox = getBoxFromState(stacks, 2*j, height);
      const rightBox = getBoxFromState(stacks, 2*j + 1, height);
      line += getBoxDisplay(leftBox) + '         ' + getBoxDisplay(rightBox);
    }

    const rightMost = getBoxFromState(stacks, 8, height);
    line +=  getBoxDisplay(rightMost)+ '      ';
    rows.push(line);
  }

  rows.push('===]       [======]       [======]       [======]       [======]     ');

  for(let i = 0; i < 2; i++) rows.push('|             ||             ||             ||             ||        ');

  rows.push('|   b         ||   b         ||   b         ||   b         ||   b    ');
  rows.push('|   h         ||   h         ||   h         ||   h         ||   h    ');
  rows.push('==========================================================================');

  const topBoxes = stacks.map(stack => stack.length ? `l${stack[stack.length - 1]}r`: txtColour(` # `, 'RED')).join('');

  rows.push(topBoxes);
  return rows;
}
