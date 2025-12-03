console.log(
    sumInvalidInRange(
        require("fs")
        .readFileSync(`input`)
        .toString("utf8")
        .split(",")
        .map(mapToIntArray),
        2
    ),
    sumInvalidInRange(
        require("fs")
        .readFileSync(`input`)
        .toString("utf8")
        .split(",")
        .map(mapToIntArray),
        10
    )
)

function sumInvalidInRange(idRanges, maxRep) {
    return [...new Set(getRange(1, 99999)
        .flatMap(repeatStringlyUpToN(maxRep))
        .filter(getIsInSomeRangesFunc(idRanges)))]
        .reduce(sum, 0);
}

function getIsInSomeRangesFunc(ranges) {
    return function(val) {
        return ranges.some(function (ranges) {
            return ranges[0] - 1 < val && val < ranges[1] + 1;
        })
    }
}

function repeatStringlyUpToN(N) {
  return function(inp) {
    return getRange(2, N).map(function (n) {
        return parseInt(Array(n).fill(inp).join(""));
    });
  }
}

function mapToIntArray(str) {
    return str.trim().split("-").map(singleArgParseInt);
}

function getRange(start, end) {
    return Array(end - start + 1).fill(null).map(function(v, i, arr) {
        return i + start;
    })
}

function singleArgParseInt(inp) {
    return parseInt(inp)
}

function sum(a, b) {
    return a + b;
}
