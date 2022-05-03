type Fish = (number | Fish)[]
var explosionOccured = false;
let inp = getInput();
let current = inp[0];

for (let i = 1; i < inp.length; i++) {
    current = add(current, inp[i]);
  } 

  console.log(getMagnitude(current));



//   let inpa = otherIn();
// let currenta = inpa[0];

// for (let i = 1; i < inpa.length; i++) {
//     currenta = add(currenta, inpa[i]);
//   } 

//   console.log(JSON.stringify(currenta));
//   console.log(getMagnitude(currenta));

// let a =  [[[[0,7],4],[15,[0,13]]],[1,1]];
// console.log(attemptSplit(a));
// console.log(JSON.stringify(add(
//     [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
//     [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// )));

let b = getInput();
let max = 0;
for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < b.length; j++) {
        if (i === j) continue;
        let sum = add(b[i],b[j]);
        let mad = getMagnitude(sum);
        max = Math.max(mad, max);
    }
}

console.log(max);


function add (a: Fish, b: Fish): Fish {
    // console.log("\r\n\r");
    // console.log(JSON.stringify(a));
    // console.log("+ " + JSON.stringify(b));
    let newFish = [JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b))];

    while (true) {
        explosionOccured = false;
        attemptExplode(newFish)
        if (attemptExplode(newFish) !== "CONTINUE") {
            continue;
        }

        if (attemptSplit(newFish)) {
            continue;
        }

        break;
    }

    // console.log(JSON.stringify(newFish));
    return newFish;
}

function getMagnitude(f: Fish| number): number {
    if (typeof f === "number") {
        return f as number;
    }

    return getMagnitude(f[0]) *3 + (getMagnitude(f[1]) * 2);
}

function attemptExplode(f: Fish, depth: number = 0): "COMPLETE" | "CONTINUE" | ({indexOfExplosion: 0 | 1, num: number}) {
    if (depth === 3) {
        if (typeof f[0] === 'object') {
            let a = f[0];
            f[0] = 0;
            let tempF = f as any;
            if (typeof f[1] === 'object') {
                tempF[1][0] += a[1];
            } else {
                tempF[1] += a[1];
            }
            // explosionOccured = true;
            return {
                indexOfExplosion: 0,
                num: a[0] as number
            };
        }
        
        if (typeof f[1] === 'object') {
            let a = f[1];
            f[1] = 0;
            let tempF = f as any;
            tempF[0] += a[0];
            // explosionOccured = true;
            return {
                indexOfExplosion: 1,
                num: a[1] as number
            };
        }

        return "CONTINUE";
    }

    if (depth > 3) {
        console.log("FAIL")!
    }
    

    for (let i = 0; i < 2; i++) {
        if (typeof f[i] === 'object') {
            let attempt = attemptExplode(f[i] as Fish, depth + 1);

            if (attempt === "COMPLETE") {
                return "COMPLETE";
            }

            if (attempt === "CONTINUE") {
                continue;
            }

            if (attempt.indexOfExplosion != i) {
                if (typeof f[attempt.indexOfExplosion] === 'object') {
                    setEdgeValue(f[attempt.indexOfExplosion] as Fish, i, attempt.num);
                }
                else {
                    let tempF = f as any;
                    tempF[attempt.indexOfExplosion] += attempt.num;
                }
                // do things
                return "COMPLETE";
            }

            return attempt;
            
        }
    } 
    return "CONTINUE";
}

function attemptSplit(f: Fish): boolean {
    for (let i = 0; i < 2; i++) {
        if (typeof f[i] === "number") {
            if (f[i] >= 10) {
                // console.log(f[i])
                let tempF = f as any;
                let prev = tempF[i];
                f[i] = [parseInt(prev/2 as any), prev - parseInt(prev/2 as any)];
                // console.log(f);
                return true;
            }
        } else {
            let b = attemptSplit(f[i] as Fish);
            if (b) return true;
        }
    }
    return false;
}

function setEdgeValue(f: any, i: number, val: number) {
    if (typeof f[i] === "number") {
        f[i] += val;
        return;
    }
    setEdgeValue(f[i], i, val);
}

// function attemptExplodeRecursive(f: Fish)

function otherIn(): Fish[] {
    return [
        [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]],
[[[5,[2,8]],4],[5,[[9,9],0]]],
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]],
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]],
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]],
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]],
[[[[5,4],[7,7]],8],[[8,3],8]],
[[9,3],[[9,9],[6,[4,9]]]],
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]],
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]],
    ]
}

function o(): Fish[] {
    return [
        [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
[7,[5,[[3,8],[1,4]]]],
[[2,[2,2]],[8,[8,1]]],
[2,9],
[1,[[[9,3],9],[[9,0],[0,7]]]],
[[[5,[7,4]],7],1],
[[[[4,2],2],6],[8,7]],
    ]
}

function getInput() : Fish[] {
    return [
        [[[[7,7],2],[[9,2],4]],[[[9,1],5],[[9,6],[6,4]]]],
        [[[2,0],[8,[9,4]]],[[1,0],0]],
        [8,[[[9,5],7],[9,7]]],
        [[[[1,3],[1,8]],[[8,8],5]],[[7,[4,0]],2]],
        [[[[7,8],3],[9,3]],5],
        [[5,[[9,3],4]],[[[0,1],7],[6,[8,3]]]],
        [[[[1,6],[4,1]],[0,3]],[9,[[4,3],[3,2]]]],
        [[[[7,9],8],4],[[[9,0],1],[[9,8],[0,5]]]],
        [[[8,7],[6,1]],[[[1,3],[6,6]],[5,[4,5]]]],
        [[[[9,8],[2,1]],[[2,3],2]],5],
        [6,3],
        [[[9,1],6],[[[7,1],[6,8]],[[8,3],[6,4]]]],
        [4,[[8,[7,1]],[8,[7,2]]]],
        [[[1,6],[9,[0,8]]],[[6,7],[2,[4,5]]]],
        [[[[1,8],[9,2]],5],[[[8,6],[2,1]],[0,6]]],
        [[[[0,2],4],[4,[3,6]]],7],
        [[[[7,5],5],7],[[[6,0],4],[5,0]]],
        [[2,1],[[[3,0],[1,4]],7]],
        [[[[9,4],[2,8]],9],[[[9,1],[7,3]],[1,[2,1]]]],
        [[[[4,2],3],[6,4]],[[6,0],[1,5]]],
        [2,6],
        [[4,6],[[2,2],[3,0]]],
        [[[[6,4],[0,7]],[0,8]],[[[6,7],2],7]],
        [[8,[[4,0],[8,4]]],1],
        [[3,[6,6]],[[[6,4],[1,5]],[4,0]]],
        [[[9,5],[5,[4,0]]],[[1,[0,6]],[[5,8],0]]],
        [[[[6,1],8],[3,7]],[[[6,4],0],[[4,8],4]]],
        [[[[3,1],3],[[3,6],[3,8]]],[[[6,7],0],2]],
        [[4,1],[[[4,8],7],[3,0]]],
        [[[[0,6],[1,3]],[[0,8],[1,9]]],3],
        [[0,[3,1]],[[[0,0],6],[[7,6],3]]],
        [[6,[[5,4],7]],[8,[5,5]]],
        [[[6,3],[[8,9],6]],2],
        [9,[[8,3],7]],
        [[[1,[3,0]],[[3,7],5]],[[5,8],[[3,7],[8,6]]]],
        [[[[6,1],2],[[7,8],[3,9]]],[[[3,6],[6,8]],[5,5]]],
        [[[[6,8],[7,1]],[8,1]],[[[1,6],9],[[3,3],[7,9]]]],
        [[[[6,9],0],[5,6]],3],
        [[[9,6],[[0,5],[2,0]]],[[[6,7],7],[2,6]]],
        [[0,[5,8]],[[1,[4,6]],[4,6]]],
        [[[[3,3],4],[0,1]],[[[6,5],0],[2,3]]],
        [0,4],
        [[5,5],[[[6,5],8],7]],
        [[[[7,3],[9,1]],[[9,0],2]],[[7,[8,3]],[[9,5],[7,3]]]],
        [[[[1,2],[7,7]],[9,0]],[0,7]],
        [[[0,[8,6]],[1,3]],[[6,6],9]],
        [[[0,2],[4,7]],0],
        [[[9,[9,6]],1],[[[1,5],[1,7]],[[5,1],[8,1]]]],
        [[[6,9],4],0],
        [[[[4,9],6],5],[7,[3,[9,8]]]],
        [[6,[6,[5,7]]],[0,[[7,4],8]]],
        [[4,[5,0]],[2,3]],
        [[[[8,6],9],[3,[1,2]]],[1,[8,[3,8]]]],
        [[[8,4],[7,2]],9],
        [[[[6,3],[6,2]],[2,[0,0]]],[[[6,4],[1,6]],[[3,5],6]]],
        [7,[[[2,4],0],[9,[9,9]]]],
        [[[9,2],8],[[2,[9,9]],[9,[7,4]]]],
        [1,[[0,7],[[1,6],0]]],
        [[[[5,5],4],8],[[9,[6,5]],[[7,4],7]]],
        [[[[7,6],4],[8,4]],[2,[1,[5,1]]]],
        [[[2,[1,2]],7],[7,[[9,9],3]]],
        [1,[[3,[9,9]],[5,6]]],
        [[3,[[1,8],4]],[[9,[6,9]],2]],
        [[[2,[4,5]],[1,[9,0]]],[4,1]],
        [[[7,[5,9]],[7,7]],[[3,[4,0]],[2,[0,0]]]],
        [[[0,[9,8]],0],[8,[7,1]]],
        [[[6,6],[0,[4,8]]],3],
        [[1,[[8,2],[9,9]]],3],
        [[2,[5,[6,7]]],[[5,3],3]],
        [[2,[[5,0],[8,5]]],[[7,[0,5]],[[5,7],3]]],
        [[[[9,4],[4,0]],[6,[7,8]]],[[7,6],1]],
        [[0,2],6],
        [[[7,5],[[7,4],[4,1]]],[3,[[6,6],[5,5]]]],
        [[3,[[0,7],8]],[[1,7],[5,0]]],
        [[9,[[9,7],[3,0]]],6],
        [[[[7,9],2],[3,[5,4]]],[[[9,4],[5,8]],[[5,0],[4,2]]]],
        [[[[4,3],6],7],[[2,6],[5,[0,1]]]],
        [[1,[3,5]],[[4,[5,0]],1]],
        [[[9,[3,9]],8],[9,[[2,9],[2,2]]]],
        [[[0,[5,0]],[[4,4],3]],6],
        [[[9,3],[[2,4],[8,4]]],[[[6,8],[3,6]],[[4,6],[1,2]]]],
        [[[[8,2],[3,2]],[4,[1,1]]],[[[7,2],1],[[9,9],[0,5]]]],
        [[[6,3],[[3,6],9]],[6,5]],
        [8,[[[8,7],3],[4,3]]],
        [[[[8,3],3],[[6,1],9]],[[[2,4],[5,9]],[[9,7],1]]],
        [[[2,[6,4]],[[0,1],3]],[[[1,2],9],[4,7]]],
        [7,9],
        [[[3,[1,4]],5],[[4,[5,1]],8]],
        [[[[7,6],4],0],[5,5]],
        [[4,[[5,2],5]],[[[0,4],[6,1]],[[3,0],[4,9]]]],
        [[[[8,6],[6,1]],9],[[[4,1],2],[[9,2],3]]],
        [[[6,1],[[8,9],[9,0]]],[[[4,4],[3,0]],[[4,2],[9,9]]]],
        [1,[[[8,8],3],7]],
        [[1,[4,[6,8]]],[1,[7,0]]],
        [6,[[3,[2,4]],[[4,5],[5,3]]]],
        [8,[[9,[6,0]],[[2,5],0]]],
        [[5,[0,8]],[[7,1],[[5,9],2]]],
        [[[5,8],[[1,1],4]],[[0,1],[4,3]]],
        [[3,[1,[7,3]]],[[[6,4],9],[[2,8],[0,1]]]],
        [[[6,[2,5]],5],[0,[[5,3],[4,2]]]]
    ];
}