const { getAllNeighbours, to2dArray } = require("../../shared/js/2dcoor");
const i = to2dArray(require(`fs`).readFileSync(`input`).toString`utf8`);

t = 0;
latestRemoved = 0;
while (true) {
    for (let y = 0; y < i.length; y++) {
        for (let x = 0; x < i[0].length; x++) {
            if (i[y][x] !== "@") continue;
            if (getAllNeighbours({y, x}).map(({y, x}) => i[y]?.[x] === "@").reduce((a,b) => a+b, 0) < 4) {
                latestRemoved+=1;
                i[y][x] = "."
            }
        }
    }
    t+=latestRemoved;
    if (latestRemoved === 0) {
        break;
    }
    latestRemoved=0;
}
console.log(t);