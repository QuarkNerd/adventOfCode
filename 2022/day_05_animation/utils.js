const { 
    DEFAULT_FOREGROUND_ANSI, AOC_RED_FOREGROUND_ANSI, AOC_YELLOW_FOREGROUND_ANSI, 
    AOC_GREEN_FOREGROUND_ANSI, AOC_WHITE_FOREGROUND_ANSI} = require('./constants');

function txtColour(string, colour) {
    switch (colour) {
        case 'RED':
            return AOC_RED_FOREGROUND_ANSI + string + DEFAULT_FOREGROUND_ANSI;
        case 'YELLOW':
            return AOC_YELLOW_FOREGROUND_ANSI + string + DEFAULT_FOREGROUND_ANSI;
        case 'GREEN':
            return AOC_GREEN_FOREGROUND_ANSI + string + DEFAULT_FOREGROUND_ANSI;
        case 'WHITE':
            return AOC_WHITE_FOREGROUND_ANSI + string + DEFAULT_FOREGROUND_ANSI;
        case 'DEFAULT':
            return string;
    }
}

function displayBox(code) {
    return code ? 'l' + code + 'r' : '   ';
}

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

module.exports = {
    txtColour, displayBox, wait
}