const A =
  "R1008,U428,L339,U16,R910,U221,R53,D546,L805,U376,L19,U708,R493,D489,L443,D567,R390,D771,R270,U737,R926,U181,L306,D456,L668,D79,L922,U433,L701,U472,R914,U903,L120,U199,L273,D206,L967,U711,R976,U976,R603,U8,L882,U980,R561,D697,L224,D620,L483,U193,R317,D588,L932,D990,R658,U998,L136,U759,R463,U890,L297,U648,R163,U250,R852,U699,R236,D254,L173,U720,L259,U632,L635,U426,R235,D699,R411,U650,L258,D997,L781,D209,L697,D306,L793,U657,L936,U317,R549,D798,L951,D80,R591,D480,R835,U292,L722,U987,L775,U173,R353,U404,L250,U652,L527,D282,L365,D657,L141,D301,R128,D590,L666,U478,L85,D822,L716,U68,R253,D186,R81,U741,L316,D615,L570,U407,L734,D345,L652,U362,L360,D791,R358,U190,L823,U274,L279,D998,L16,D644,L201,D469,R213,D487,L251,D395,R130,U902,L398,U201,L56,D850,R541,D661,R921,U647,R309,D550,L307,D68,R894,U653,L510,D375,R20,U86,R357,D120,L978,D200,L45,D247,R906,U334,L242,D466,R418,U548,R698,D158,R582,U469,L968,U736,R196,U437,R87,D722,R811,U625,L425,D675,L904,D331,R693,D491,R559,U540,L120,D975,R180,U224,R610,U260,L769,D486,R93,D300,L230,U181,L60,U910,L60,D554,L527,U37,R69,D649,R768,D835,L581,U932,L746,U170,L733,U40,L497,D957,R12,U686,R85,D461,R796,D142,R664,U787,R636,D621,R824,D421,R902,D686,L202,D839,R567,D129,L77,D917,L200,D106,R3,D546,L101,D762,R780,U334,L410,D190,R431,D828,L816,D529,R648,D449,L845,U49,R750,U864,L133,D822,R46,U475,L229,U929,L676,D793,R379,U71,L243,U640,L122,U183,R528,U22,R375,D928,R292,U796,R259,U325,L921,U489,L246,D153,L384,D684,L243,U65,L342,U662,R707";
const B =
  "L1008,D243,L602,D497,L395,U81,R589,U94,R640,D965,L397,D781,R464,U642,L130,D740,R938,D260,L106,D323,L626,U869,L495,U450,R640,D675,R602,D449,L542,U917,L244,U702,L644,D809,R902,U163,R118,U982,L867,D795,R546,U194,R397,D877,L354,D255,L477,U45,L707,D624,R806,U642,L926,D233,L800,U691,L990,D979,L431,U999,L423,D794,L238,U25,R986,U595,L167,U480,L555,U831,R496,U799,L897,D895,L993,D11,R486,U176,L90,U842,R499,U792,R787,U859,L100,U169,R170,D89,R297,D944,R362,D460,R147,U831,L45,U972,R582,D90,L934,U284,R555,U235,L138,U837,R965,U915,R928,U982,R157,D566,L953,U653,L629,U460,L335,D912,R355,D683,L710,D562,R392,D44,R707,D979,L749,D223,L776,D723,R735,D356,R49,U567,L563,D220,L868,U223,R448,D505,L411,U662,L188,D536,R55,U718,L108,D289,R435,U98,R775,U933,L127,D84,R253,D523,L2,D905,R266,U675,R758,D331,R122,U988,R215,D500,R89,U306,R833,U763,R570,D818,L985,U127,L87,D210,R355,D532,R870,U196,R695,U633,R170,D540,R506,U708,L663,U566,L633,U306,L452,U180,R463,D21,L220,D268,R608,U986,L493,D598,L957,D116,L454,D584,L405,U651,R352,U681,R807,U767,L988,U692,R474,U710,R607,U313,R711,U12,R371,D561,R72,U522,R270,U904,L49,U525,R562,U895,L232,D319,R902,D236,L601,D816,R836,U419,R610,U644,L733,U355,L836,U228,L895,D39,L44,D848,L965,U475,R56,U62,L458,U99,R236,D763,R912,U295,R515,U179,R20,D777,R511,D906,R903,U855,L507,D512,L63,D630,R442,U595,L701,U654,R238,D35,L31,D469,R6,D222,R132,D837,R921,U838,R986,D441,L950,D530,L397,U41,L81,D60,L245,D75,R620,D455,L937,D180,R215,D684,R724,U561,R479,D353,L501";

const wireA = A.split(",");
const wireB = B.split(",");

let Asteps;
let Bsteps; // number of steps taken to get to the corrosponding coordinate on wire B, first value is 0
let wireAcoor;
let wireBcoor;

[Asteps, wireAcoor] = makeCoorList(wireA);
[Bsteps, wireBcoor] = makeCoorList(wireB);

// while wireB is horizontaly
const intersections = []; // location of intersections
let distances = []; // mnahattan distance to intersections
let steps = []; // total steps taken to get to intersection
for (let i = 0; i < wireBcoor.length - 1; i += 2) {
  const B1 = wireBcoor[i];
  const B2 = wireBcoor[i + 1];
  for (let j = 1; j < wireAcoor.length - 1; j += 2) {
    const A1 = wireAcoor[j];
    const A2 = wireAcoor[j + 1];

    const intersection = getIntersection(A1, A2, B1, B2);
    if (intersection.length != 0) {
      intersections.push(intersection);
      distances.push(Math.abs(intersection[0]) + Math.abs(intersection[1]));
      steps.push(
        Bsteps[i] +
          Asteps[j] +
          Math.abs(intersection[0] - B1[0]) +
          Math.abs(intersection[1] - A1[1])
      );
    }
  }
}

// while wireB is going vertically
for (let i = 1; i < wireBcoor.length - 1; i += 2) {
  const B1 = wireBcoor[i];
  const B2 = wireBcoor[i + 1];
  for (let j = 0; j < wireAcoor.length - 1; j += 2) {
    const A1 = wireAcoor[j];
    const A2 = wireAcoor[j + 1];

    const intersection = getIntersection(B1, B2, A1, A2);
    if (intersection.length != 0) {
      intersections.push(intersection);
      distances.push(Math.abs(intersection[0]) + Math.abs(intersection[1]));
      steps.push(
        Bsteps[i] +
          Asteps[j] +
          Math.abs(intersection[1] - B1[1]) +
          Math.abs(intersection[0] - A1[0])
      );
    }
  }
}

function getIntersection(
  verticalLine1,
  verticalLine2,
  horizontolLine1,
  horizontolLine2
) {
  const A =
    horizontolLine1[0] <= verticalLine1[0] &&
    verticalLine1[0] <= horizontolLine2[0];
  const B =
    horizontolLine1[0] >= verticalLine1[0] &&
    verticalLine1[0] >= horizontolLine2[0];
  const C =
    verticalLine1[1] <= horizontolLine1[1] &&
    horizontolLine1[1] <= verticalLine2[1];
  const D =
    verticalLine1[1] >= horizontolLine1[1] &&
    horizontolLine1[1] >= verticalLine2[1];
  if ((A || B) && (C || D)) {
    return [verticalLine1[0], horizontolLine1[1]];
  } else {
    return [];
  }
}

function makeCoorList(directions) {
  const coors = [[0, 0]];
  const steps = [0];

  for (let i = 0; i < directions.length; i++) {
    const prevCor = coors[i];
    const distance = parseInt(directions[i].substring(1));
    let newCoor;
    switch (directions[i][0]) {
      case "R":
        newCoor = [prevCor[0] + distance, prevCor[1]];
        break;
      case "U":
        newCoor = [prevCor[0], prevCor[1] + distance];
        break;
      case "D":
        newCoor = [prevCor[0], prevCor[1] - distance];
        break;
      case "L":
        newCoor = [prevCor[0] - distance, prevCor[1]];
        break;
    }
    steps.push(steps[i] + Math.abs(distance));
    coors.push(newCoor);
  }
  return [steps, coors];
}

console.log(Math.min(...distances));
console.log(Math.min(...steps));
