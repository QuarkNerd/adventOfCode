let startTime = new Date();
const bricks = getBricks();
const locationToBrickMap = {};

bricks.forEach((brick, i) => {
    brick.forEach(cube => {
        locationToBrickMap[cube.join("-")] = i;
    });
});

const supportedBy = Array.from(Array(bricks.length), () => []);
let supports;
// stabalise and determine support
let moved = false;
do {
    supports = Array.from(Array(bricks.length), () => []);
    moved = false;
    bricks.forEach((brick, i) => {
        const potentialNew = brick
            .map(cube => [cube[0], cube[1], cube[2] - 1])
        const stoppedBy = [...new Set(potentialNew.map(cube => locationToBrickMap[cube.join("-")]).filter(x => x!== undefined && x !== i))];
        const canMove = potentialNew
            .every(cube => cube[2] >= 1)
            &&
            stoppedBy.length === 0
        
        if (canMove) {
            brick.forEach(cube => {
                delete locationToBrickMap[cube.join("-")];
                cube[2]-=1;
                locationToBrickMap[cube.join("-")] = i;
            })
            moved = true;
        } else {
            supportedBy[i] = stoppedBy;
            stoppedBy.forEach(x => supports[x].push(i))
        }
    
    });
} while (moved)

const mustRemain = [...new Set(supportedBy.filter(x => x.length === 1).flat())];
console.log("Part one:", bricks.length - mustRemain.length);

let dropCount = mustRemain.map(getDropped).reduce((a, b) => a + b, 0);
let endTime = new Date();
console.log("Part two:", dropCount, endTime - startTime)

function getBricks() {
    const fs = require('fs');
    const input = fs.readFileSync("input").toString('utf8').split("\r\n");
    return input.map(parseBrick);
}

function parseBrick(str) {
    const ends = str.split("~");
    const [start, end] = [parseBrickEnd(ends[0]), parseBrickEnd(ends[1])]
    const all = [];
    for (let x = start[0]; x <= end[0]; x++) {
        for (let y = start[1]; y <= end[1]; y++) {
            for (let z = start[2]; z <= end[2]; z++) {
                all.push([x, y, z]);
            }
        }
    }
    return all;
}

function parseBrickEnd(str) {
    return str.split(",").map(x => parseInt(x));
}

function getDropped(brickIndex) {
    let all = [brickIndex];
    let current = [brickIndex];
    while (current.length) {
        current = [...new Set(current.flatMap(dr => supports[dr]))]
                .filter(potentialNewDrop => supportedBy[potentialNewDrop].every(x => all.includes(x)))
        all = [...all, ...current]
    }
    return all.length - 1;
}
