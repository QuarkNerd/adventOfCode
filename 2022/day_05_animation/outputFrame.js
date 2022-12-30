const {EOL} = require('os');
const { AOC_GREY_BACKGROUND_ANSI, DEFAULT_BACKGROUND_ANSI, DEFAULT_BOT_Y, DEFAULT_FOREGROUND_ANSI, AOC_YELLOW_FOREGROUND_ANSI, AOC_WHITE_FOREGROUND_ANSI } = require('./constants');
const { wait, txtColour } = require('./utils');
let period = 75;

const head = `${txtColour('[', 'GREEN')}${txtColour('@.@', 'RED')}${txtColour(']', 'GREEN')}`;
const torso = AOC_GREY_BACKGROUND_ANSI + '|   |' + DEFAULT_BACKGROUND_ANSI;
const foot = txtColour('o', 'GREEN');

module.exports = function outputFrame(baseRows, robot) {
    let outputString = '';
    for (let i = 0; i < robot.y - 1; i++) {
        outputString += displayLine(baseRows[i]);
    }

    if (robot.motionState.type === 'HORIZONTOL') { 
        outputString += getRestOfFrameForHorizontol(baseRows, robot);
    } else if (robot.motionState.type === 'VERTICAL') {
        outputString += getBodyStringForVertical(baseRows, robot);
        outputString += getStringForBelowBodyForRaisedPlatform(baseRows, robot);
    } else if (robot.motionState.type === 'MOVE_BOX') {
        outputString += getBodyStringForMovebox(baseRows, robot);
        outputString += getStringForBelowBodyForRaisedPlatform(baseRows, robot);
    }
    // else if (robot.motionState.type === 'DODGY') { 
    //     outputString += getRestOfFrameForDodgy(baseRows, robot);
    // }
    
    wait(period);
    console.clear();
    console.log(outputString);
}

function getRestOfFrameForHorizontol(baseRows, robot) {
    let outputString = '';
    if (robot.carrying === null) {
        outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1]);
    } else {
        outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 2));
    }
    outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 2) + head + baseRows[DEFAULT_BOT_Y].substring(robot.x + 3));
    outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 3) + txtColour(`/${torso}\\`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 4));
    outputString += displayLine(baseRows[DEFAULT_BOT_Y + 2].substring(0, robot.x - 2) 
        + foot
        + baseRows[DEFAULT_BOT_Y + 2].substring(robot.x-1, robot.x+2)
        + foot
        + baseRows[DEFAULT_BOT_Y + 2].substring(robot.x+3)
    );

    outputString += displayLine(baseRows[DEFAULT_BOT_Y + 3]);
    outputString += displayLine(baseRows[DEFAULT_BOT_Y + 4]);
    
    return outputString;
}

// function getRestOfFrameForDodgy(baseRows, robot) {
//     period = 250;
//     let outputString = '';
//     if (robot.carrying === null) {
//         throw new Error('Invalid State');
//     }
//     const shockedHead = `${txtColour('[', 'GREEN')}${txtColour('O.O', 'RED')}${txtColour(']', 'GREEN')}`;
//     const shiftyHeadOne = `${txtColour('[', 'GREEN')}${txtColour('>.>', 'RED')}${txtColour(']', 'GREEN')}`;
//     const shiftyHeadTwo = `${txtColour('[', 'GREEN')}${txtColour('<.<', 'RED')}${txtColour(']', 'GREEN')}`;

//     switch (Math.floor(robot.motionState.index/2)) {
//         case 0:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + `${txtColour('_', 'YELLOW')}${robot.carrying}r` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 2));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 2) + head + baseRows[DEFAULT_BOT_Y].substring(robot.x + 3));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 3) + txtColour(`/${torso}\\`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 4));
//             break;
//         case 1:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + `${txtColour('_', 'YELLOW')}${robot.carrying}${txtColour('_', 'YELLOW')}` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 2));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 2) + shockedHead + baseRows[DEFAULT_BOT_Y].substring(robot.x + 3));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 3) + txtColour(`/${torso}\\`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 4));
//             break;
//         case 2:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + `${txtColour('_', 'YELLOW')}${robot.carrying}${txtColour('_', 'YELLOW')}` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 2));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 2) + shiftyHeadOne + baseRows[DEFAULT_BOT_Y].substring(robot.x + 3));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 3) + txtColour(`/${torso}\\`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 4));
//             break;
//         case 3:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 3) + `${txtColour(`|`, 'WHITE')} ${txtColour('_', 'YELLOW')}${robot.carrying}${txtColour('_', 'YELLOW')} ${txtColour(`|`, 'WHITE')}` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + shiftyHeadTwo + txtColour(`|`, 'WHITE') + baseRows[DEFAULT_BOT_Y].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 2) + txtColour(`${torso}`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 3));
//             break;
//         case 4:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 3) + `${txtColour(`|-`, 'WHITE')}${txtColour('_', 'YELLOW')}${robot.carrying}${txtColour('_', 'YELLOW')}${txtColour(`-|`, 'WHITE')}` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + shiftyHeadTwo + txtColour(`|`, 'WHITE') + baseRows[DEFAULT_BOT_Y].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 2) + txtColour(`${torso}`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 3));
//             break;
//         case 5:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 3) + `${txtColour(`|-`, 'WHITE')}l${robot.carrying}r${txtColour(`-|`, 'WHITE')}` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + shiftyHeadOne + txtColour(`|`, 'WHITE') + baseRows[DEFAULT_BOT_Y].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 2) + txtColour(`${torso}`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 3));
//             break;
//         case 6:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 3) + `${txtColour(`|`, 'WHITE')} l${robot.carrying}r ${txtColour(`|`, 'WHITE')}` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + shiftyHeadTwo + txtColour(`|`, 'WHITE') + baseRows[DEFAULT_BOT_Y].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 2) + txtColour(`${torso}`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 3));
//             break;
//         case 7:
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 2));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + shiftyHeadTwo + txtColour(`|`, 'WHITE') + baseRows[DEFAULT_BOT_Y].substring(robot.x + 4));
//             outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 2) + txtColour(`${torso}`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 3));
//             break;
//     }
    
//     // outputString += displayLine(baseRows[DEFAULT_BOT_Y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r` + baseRows[DEFAULT_BOT_Y - 1].substring(robot.x + 2));
//     // outputString += displayLine(baseRows[DEFAULT_BOT_Y].substring(0, robot.x - 2) + head + baseRows[DEFAULT_BOT_Y].substring(robot.x + 3));
//     // outputString += displayLine(baseRows[DEFAULT_BOT_Y + 1].substring(0, robot.x - 3) + txtColour(`/${torso}\\`, 'WHITE') + baseRows[DEFAULT_BOT_Y + 1].substring(robot.x + 4));
//     // outputString += displayLine(baseRows[DEFAULT_BOT_Y + 2].substring(0, robot.x - 2) 
//     //     + foot
//     //     + baseRows[DEFAULT_BOT_Y + 2].substring(robot.x-1, robot.x+2)
//     //     + foot
//     //     + baseRows[DEFAULT_BOT_Y + 2].substring(robot.x+3)
//     // );
//     outputString += displayLine(baseRows[DEFAULT_BOT_Y + 2].substring(0, robot.x - 2) 
//         + foot
//         + baseRows[DEFAULT_BOT_Y + 2].substring(robot.x-1, robot.x+2)
//         + foot
//         + baseRows[DEFAULT_BOT_Y + 2].substring(robot.x+3)
//     );

//     outputString += displayLine(baseRows[DEFAULT_BOT_Y + 3]);
//     outputString += displayLine(baseRows[DEFAULT_BOT_Y + 4]);
    
//     return outputString;
// }

function getStringForBelowBodyForRaisedPlatform(baseRows, robot) {
    let outputString = displayLine(baseRows[robot.y + 2].substring(0, robot.x - 3) 
        + txtColour('|', 'YELLOW') + foot
        + baseRows[robot.y + 2].substring(robot.x-1, robot.x+2)
        + foot
        + baseRows[robot.y + 2].substring(robot.x+3)
    );

    const movingVertically = robot.motionState.type === 'VERTICAL';
    outputString += displayLine(baseRows[robot.y + 3].substring(0, robot.x - 3) 
        + txtColour('======', movingVertically ? 'RED' : 'DEFAULT')
        + baseRows[robot.y + 3].substring(robot.x + 3)); 
    for (let i = robot.y + 4; i < baseRows.length - 2; i++) {
        const stemColour = (i + robot.y)%2 == 0 ? 'GREEN' : 'RED';
        outputString += displayLine(baseRows[i].substring(0, robot.x - 3) + txtColour('  ||', stemColour) + baseRows[i].substring(robot.x + 1));
    }

    if (robot.y !== DEFAULT_BOT_Y) {
        outputString += displayLine(baseRows[baseRows.length - 2]);
    }
    return outputString + displayLine(baseRows[baseRows.length - 1]);
}

function getBodyStringForVertical(baseRows, robot) {
    let outputString = '';
    if (robot.carrying === null) {
        outputString += displayLine(baseRows[robot.y - 1]);
    } else {
        outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r` + baseRows[robot.y - 1].substring(robot.x + 2));
    }

    const movingButtonColour = robot.motionState.index%2 ? 'GREEN' : 'RED';
    outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 4) + txtColour(`__`, movingButtonColour) + head + baseRows[robot.y].substring(robot.x + 3));
    const button = txtColour('O', movingButtonColour);
    return outputString + displayLine(baseRows[robot.y + 1].substring(0, robot.x - 3) + button + txtColour(`${torso}\\`, 'WHITE') + baseRows[robot.y + 1].substring(robot.x + 4));
}

function getBodyStringForMovebox(baseRows, robot) {
    let outputString = '';

    const box = robot.carrying ? `l${robot.carrying}r` : '   ';
    const head = `${txtColour('[', 'GREEN')}${txtColour('^.^', 'RED')}${txtColour(']', 'GREEN')}`;
    switch (robot.motionState.index) {
        case 0:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 1) + box + baseRows[robot.y - 1].substring(robot.x + 2));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`__`, 'WHITE') + baseRows[robot.y].substring(robot.x + 5));
            break;
        case -1:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r` + baseRows[robot.y - 1].substring(robot.x + 2));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 3) + txtColour(`\\`, 'WHITE') + head + txtColour(`__`, 'WHITE') + baseRows[robot.y].substring(robot.x + 5));
            break;
        case -2:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 3) + `${txtColour('|-', 'WHITE')}l${robot.carrying}r` + baseRows[robot.y - 1].substring(robot.x + 2));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 3) + txtColour(`|`, 'WHITE') + head + txtColour(`__`, 'WHITE') + baseRows[robot.y].substring(robot.x + 5));
            break;
        case -3:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 3) + `l${robot.carrying}r` + baseRows[robot.y - 1].substring(robot.x));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 3) + txtColour(`\\`, 'WHITE') + head + txtColour(`__`, 'WHITE') + baseRows[robot.y].substring(robot.x + 5));
            break;
        case 1:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r` + baseRows[robot.y - 1].substring(robot.x + 2));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`/`, 'WHITE') + baseRows[robot.y].substring(robot.x + 4));
            break;
        case 2:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x - 1) + `l${robot.carrying}r${txtColour('-|', 'WHITE')}` + baseRows[robot.y - 1].substring(robot.x + 4));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`|`, 'WHITE') + baseRows[robot.y].substring(robot.x + 4));
            break;
        case 3:
            outputString += displayLine(baseRows[robot.y - 1].substring(0, robot.x + 1) + `l${robot.carrying}r` + baseRows[robot.y - 1].substring(robot.x + 4));
            outputString += displayLine(baseRows[robot.y].substring(0, robot.x - 4) + txtColour(`__`, 'WHITE') + head + txtColour(`/`, 'WHITE') + baseRows[robot.y].substring(robot.x + 4));
            break;
        default:
            throw new Error(robot.motionState.index);
    }

    
    
    
    const button = txtColour('o', 'YELLOW');
    return outputString + displayLine(baseRows[robot.y + 1].substring(0, robot.x - 3) + button + txtColour(`${torso}`, 'WHITE') + baseRows[robot.y + 1].substring(robot.x + 3));
}

// Add box ANSII and button ansii at the last step, this allows for easier manipulaton of strings earlier on
function displayLine(line) {
    return line
        .replaceAll('l', `${AOC_YELLOW_FOREGROUND_ANSI}[${AOC_WHITE_FOREGROUND_ANSI}`)
        .replaceAll('r', txtColour(']', 'YELLOW'))
        .replaceAll('b', txtColour('o', 'YELLOW'))
        .replaceAll('h', txtColour('|', 'YELLOW')) + EOL;
}
