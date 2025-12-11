const { stringToNode } = require("../../shared/js/2dcoor");

const input = require(`fs`).readFileSync(`input`).toString`utf8`.split(/\r?\n/).map(stringToNode);
const getBetween = (coor1, coor2) => {
    if (coor1.x === coor2.x) {
        return getRange(coor1.y, coor2.y).map(y => ({y, x: coor1.x}))
    } else {
        return getRange(coor1.x, coor2.x).map(x => ({y: coor1.y, x}))
    }
}
const redGreenHash = new Set();

for (let i = 0; i < input.length; i++) {
    getBetween(input[i], input[(i+1)%input.length]).map(coor => coor.x+","+coor.y).forEach(c => redGreenHash.add(c));
}

const areas = input.flatMap(
    (coor1, i) => input.slice(i+ 1).map(coor2 => ({ area: (Math.abs(coor1.x - coor2.x)+1)*(Math.abs(coor1.y - coor2.y)+1), coors: [coor1, coor2]}))
);
areas.sort((a, b) => - a.area + b.area)
console.log(areas[0]);

for (const a of areas) {
    if (isValid(a)) {
        console.log(a);
        break;
    }
}

function isValid(a) {
    
    return true;
}

function getRange(start, end) {
    if (end <= start) {
        let temp = end;
        end = start;
        start = temp;
    }
    return Array(end - start + 1).fill(null).map(function(v, i, arr) {
        return i + start;
    })
}
