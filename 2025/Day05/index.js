const input = require(`fs`).readFileSync(`input`).toString`utf8`;
const [rangeString, ingredientsString] = input.split(/\r?\n\r?\n/);
const ranges = rangeString.split(/\r?\n/).map(r => r.split("-").map(i => parseInt(i)));
const ingredients = ingredientsString.split(/\r?\n/).map(i => parseInt(i));

const isValInRange = (val, range) => range[0] <= val && val <= range[1];

const mergedRanges = [];
for (const ran of ranges) {
    for (let i = mergedRanges.length - 1; i >= 0; i--) {
        const mergedRan = mergedRanges[i];
        if (isValInRange(ran[0], mergedRan) || isValInRange(mergedRan[0], ran)) {
            mergedRanges.splice(i, 1)
            ran[0] = Math.min(mergedRan[0], ran[0]);
            ran[1] = Math.max(mergedRan[1], ran[1]);
        }
    }
    mergedRanges.push(ran);
}

const isInOneOfRanges = i => mergedRanges.some(r => r[0] <= i && i <= r[1]);
console.log(ingredients.filter(isInOneOfRanges).length);
console.log(mergedRanges.map(r => r[1] + 1 - r[0]).reduce((a, b) => a + b, 0))
