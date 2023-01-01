const {EOL} = require('os');
const { AOC_GREY_BACKGROUND_ANSI, DEFAULT_BACKGROUND_ANSI, DEFAULT_BOT_Y, DEFAULT_FOREGROUND_ANSI, AOC_YELLOW_FOREGROUND_ANSI, AOC_WHITE_FOREGROUND_ANSI } = require('./constants');
const { wait, txtColour, displayBox } = require('./utils');
let period = 75;

const head = `${txtColour('[', 'GREEN')}${txtColour('@.@', 'RED')}${txtColour(']', 'GREEN')}`;
const torso = AOC_GREY_BACKGROUND_ANSI + '|   |' + DEFAULT_BACKGROUND_ANSI;
const foot = txtColour('o', 'GREEN');

module.exports = function outputFrame(backgroundFrame, robot) {
    const frame = [...backgroundFrame];

    if (robot.motionState.type === 'HORIZONTOL') { 
        mutateFrameForHorizontolMotion(frame, robot);
    } else if (robot.motionState.type === 'VERTICAL') {
        mutateFrameForVerticalMotion(frame, robot);
    } else if (robot.motionState.type === 'MOVE_BOX') {
        mutateFrameForMovingBox(frame, robot);
    }
    
    wait(period);
    console.clear();
    console.log(transformForDisplay(frame.join(EOL)));
}

function mutateFrameForHorizontolMotion(frame, robot) {
    if (robot.carrying !== null) {
        frame[DEFAULT_BOT_Y - 1] = frame[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + displayBox(robot.carrying) + frame[DEFAULT_BOT_Y - 1].substring(robot.x + 2);
    }
    frame[DEFAULT_BOT_Y] = frame[DEFAULT_BOT_Y].substring(0, robot.x - 2) + head + frame[DEFAULT_BOT_Y].substring(robot.x + 3);
    frame[DEFAULT_BOT_Y + 1] = frame[DEFAULT_BOT_Y + 1].substring(0, robot.x - 3) + txtColour(`/${torso}\\`, 'WHITE') + frame[DEFAULT_BOT_Y + 1].substring(robot.x + 4);
    frame[DEFAULT_BOT_Y + 2] = frame[DEFAULT_BOT_Y + 2].substring(0, robot.x - 2) 
        + foot
        + frame[DEFAULT_BOT_Y + 2].substring(robot.x-1, robot.x+2)
        + foot
        + frame[DEFAULT_BOT_Y + 2].substring(robot.x+3);
}

function mutateFrameForVerticalMotion(frame, robot) {
    if (robot.carrying !== null) {
        frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 1) + displayBox(robot.carrying) + frame[robot.y - 1].substring(robot.x + 2);
    }

    const movingButtonColour = robot.motionState.index%2 ? 'GREEN' : 'RED';
    const button = txtColour('O', movingButtonColour);
    
    frame[robot.y] = frame[robot.y].substring(0, robot.x - 4) + txtColour(`__`, movingButtonColour) + head + frame[robot.y].substring(robot.x + 3);
    frame[robot.y + 1] = frame[robot.y + 1].substring(0, robot.x - 3) + button + txtColour(`${torso}\\`, 'WHITE') + frame[robot.y + 1].substring(robot.x + 4);
    mutateFrameForRaisedPlatform(frame, robot, 'RED');
}

function mutateFrameForMovingBox(frame, robot) {
    const head = `${txtColour('[', 'GREEN')}${txtColour('^.^', 'RED')}${txtColour(']', 'GREEN')}`;
    const box = displayBox(robot.carrying);
    switch (robot.motionState.index) {
        case 0:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 1) + box + frame[robot.y - 1].substring(robot.x + 2);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`__`, 'WHITE') + frame[robot.y].substring(robot.x + 5);
            break;
        case -1:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 1) + box + frame[robot.y - 1].substring(robot.x + 2);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 3) + txtColour(`\\`, 'WHITE') + head + txtColour(`__`, 'WHITE') + frame[robot.y].substring(robot.x + 5);
            break;
        case -2:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 3) + `${txtColour('|-', 'WHITE')}${box}` + frame[robot.y - 1].substring(robot.x + 2);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + head + txtColour(`__`, 'WHITE') + frame[robot.y].substring(robot.x + 5);
            break;
        case -3:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 3) + box + frame[robot.y - 1].substring(robot.x);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 3) + txtColour(`\\`, 'WHITE') + head + txtColour(`__`, 'WHITE') + frame[robot.y].substring(robot.x + 5);
            break;
        case 1:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 1) + box + frame[robot.y - 1].substring(robot.x + 2);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`/`, 'WHITE') + frame[robot.y].substring(robot.x + 4);
            break;
        case 2:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x - 1) + `${box}${txtColour('-|', 'WHITE')}` + frame[robot.y - 1].substring(robot.x + 4);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`|`, 'WHITE') + frame[robot.y].substring(robot.x + 4);
            break;
        case 3:
            frame[robot.y - 1] = frame[robot.y - 1].substring(0, robot.x + 1) + box + frame[robot.y - 1].substring(robot.x + 4);
            frame[robot.y] = frame[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`/`, 'WHITE') + frame[robot.y].substring(robot.x + 4);
            break;
        default:
            throw new Error(robot.motionState.index);
    }
    
    const button = txtColour('o', 'YELLOW');
    frame[robot.y + 1] = frame[robot.y + 1].substring(0, robot.x - 3) + button + txtColour(`${torso}`, 'WHITE') + frame[robot.y + 1].substring(robot.x + 3);
    mutateFrameForRaisedPlatform(frame, robot, 'DEFAULT');
}

function mutateFrameForRaisedPlatform(frame, robot, platformColour) {
    frame[robot.y + 2] = frame[robot.y + 2].substring(0, robot.x - 3) 
        + txtColour('|', 'YELLOW') + foot
        + frame[robot.y + 2].substring(robot.x-1, robot.x+2)
        + foot
        + frame[robot.y + 2].substring(robot.x+3);


    frame[robot.y + 3] = frame[robot.y + 3].substring(0, robot.x - 3) 
        + txtColour('======', platformColour)
        + frame[robot.y + 3].substring(robot.x + 3); 
    for (let i = robot.y + 4; i < frame.length - 2; i++) {
        const stemColour = (i + robot.y)%2 == 0 ? 'GREEN' : 'RED';
        frame[i] = frame[i].substring(0, robot.x - 3) + txtColour('  ||', stemColour) + frame[i].substring(robot.x + 1);
    }
}

// Add box ANSII and button ansii at the last step, this allows for easier manipulaton of strings earlier on
function transformForDisplay(line) {
    return line
        .replaceAll('l', `${AOC_YELLOW_FOREGROUND_ANSI}[${AOC_WHITE_FOREGROUND_ANSI}`)
        .replaceAll('r', txtColour(']', 'YELLOW'))
        .replaceAll('b', txtColour('o', 'YELLOW'))
        .replaceAll('h', txtColour('|', 'YELLOW'));
}
