const utilities = require("./utilities");
const input =
  "109,2050,21101,966,0,1,21102,13,1,0,1105,1,1378,21101,20,0,0,1106,0,1337,21101,0,27,0,1106,0,1279,1208,1,65,748,1005,748,73,1208,1,79,748,1005,748,110,1208,1,78,748,1005,748,132,1208,1,87,748,1005,748,169,1208,1,82,748,1005,748,239,21102,1,1041,1,21102,1,73,0,1105,1,1421,21102,1,78,1,21101,1041,0,2,21102,1,88,0,1105,1,1301,21102,1,68,1,21101,0,1041,2,21102,103,1,0,1106,0,1301,1101,1,0,750,1106,0,298,21101,0,82,1,21102,1041,1,2,21101,0,125,0,1106,0,1301,1101,2,0,750,1105,1,298,21102,1,79,1,21102,1041,1,2,21101,0,147,0,1106,0,1301,21102,1,84,1,21102,1041,1,2,21102,162,1,0,1106,0,1301,1102,3,1,750,1106,0,298,21101,0,65,1,21101,0,1041,2,21102,1,184,0,1106,0,1301,21102,1,76,1,21102,1041,1,2,21101,0,199,0,1105,1,1301,21101,0,75,1,21101,0,1041,2,21102,214,1,0,1105,1,1301,21101,221,0,0,1106,0,1337,21102,10,1,1,21101,0,1041,2,21101,0,236,0,1105,1,1301,1106,0,553,21102,1,85,1,21102,1041,1,2,21101,254,0,0,1105,1,1301,21101,78,0,1,21102,1041,1,2,21102,269,1,0,1106,0,1301,21101,276,0,0,1106,0,1337,21102,1,10,1,21102,1,1041,2,21102,291,1,0,1105,1,1301,1102,1,1,755,1105,1,553,21102,32,1,1,21102,1041,1,2,21102,1,313,0,1105,1,1301,21102,1,320,0,1106,0,1337,21102,327,1,0,1106,0,1279,1201,1,0,749,21101,0,65,2,21101,73,0,3,21101,346,0,0,1105,1,1889,1206,1,367,1007,749,69,748,1005,748,360,1101,1,0,756,1001,749,-64,751,1105,1,406,1008,749,74,748,1006,748,381,1101,-1,0,751,1106,0,406,1008,749,84,748,1006,748,395,1101,-2,0,751,1106,0,406,21102,1,1100,1,21101,406,0,0,1105,1,1421,21101,32,0,1,21101,1100,0,2,21102,421,1,0,1106,0,1301,21102,1,428,0,1105,1,1337,21102,1,435,0,1106,0,1279,2102,1,1,749,1008,749,74,748,1006,748,453,1101,-1,0,752,1105,1,478,1008,749,84,748,1006,748,467,1101,0,-2,752,1106,0,478,21101,1168,0,1,21101,0,478,0,1105,1,1421,21101,0,485,0,1106,0,1337,21101,10,0,1,21102,1,1168,2,21102,500,1,0,1105,1,1301,1007,920,15,748,1005,748,518,21102,1,1209,1,21102,1,518,0,1105,1,1421,1002,920,3,529,1001,529,921,529,1002,750,1,0,1001,529,1,537,1001,751,0,0,1001,537,1,545,1002,752,1,0,1001,920,1,920,1106,0,13,1005,755,577,1006,756,570,21102,1100,1,1,21101,0,570,0,1105,1,1421,21101,987,0,1,1105,1,581,21101,0,1001,1,21102,1,588,0,1105,1,1378,1101,758,0,593,1002,0,1,753,1006,753,654,20102,1,753,1,21101,610,0,0,1105,1,667,21102,1,0,1,21101,0,621,0,1106,0,1463,1205,1,647,21102,1015,1,1,21102,1,635,0,1106,0,1378,21101,1,0,1,21102,1,646,0,1105,1,1463,99,1001,593,1,593,1105,1,592,1006,755,664,1102,1,0,755,1106,0,647,4,754,99,109,2,1102,726,1,757,21202,-1,1,1,21102,9,1,2,21101,697,0,3,21102,1,692,0,1106,0,1913,109,-2,2106,0,0,109,2,102,1,757,706,1202,-1,1,0,1001,757,1,757,109,-2,2106,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,255,63,223,95,159,191,127,0,204,141,188,101,215,47,220,241,247,155,246,202,93,158,39,53,226,248,116,51,182,125,87,123,113,124,153,100,42,205,110,69,167,157,233,114,137,235,140,250,119,170,181,126,84,217,58,77,185,175,201,169,143,206,46,244,78,197,106,173,38,232,187,168,162,49,122,102,183,253,216,98,238,237,199,108,86,200,174,136,239,252,198,139,227,242,231,166,245,103,111,221,57,59,61,79,120,212,117,115,236,43,189,35,196,152,99,177,70,222,121,184,218,138,85,54,251,207,94,71,178,172,76,60,171,68,249,243,254,230,229,109,213,34,62,203,50,55,179,163,190,142,214,156,228,118,186,92,56,107,219,234,154,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,73,110,112,117,116,32,105,110,115,116,114,117,99,116,105,111,110,115,58,10,13,10,87,97,108,107,105,110,103,46,46,46,10,10,13,10,82,117,110,110,105,110,103,46,46,46,10,10,25,10,68,105,100,110,39,116,32,109,97,107,101,32,105,116,32,97,99,114,111,115,115,58,10,10,58,73,110,118,97,108,105,100,32,111,112,101,114,97,116,105,111,110,59,32,101,120,112,101,99,116,101,100,32,115,111,109,101,116,104,105,110,103,32,108,105,107,101,32,65,78,68,44,32,79,82,44,32,111,114,32,78,79,84,67,73,110,118,97,108,105,100,32,102,105,114,115,116,32,97,114,103,117,109,101,110,116,59,32,101,120,112,101,99,116,101,100,32,115,111,109,101,116,104,105,110,103,32,108,105,107,101,32,65,44,32,66,44,32,67,44,32,68,44,32,74,44,32,111,114,32,84,40,73,110,118,97,108,105,100,32,115,101,99,111,110,100,32,97,114,103,117,109,101,110,116,59,32,101,120,112,101,99,116,101,100,32,74,32,111,114,32,84,52,79,117,116,32,111,102,32,109,101,109,111,114,121,59,32,97,116,32,109,111,115,116,32,49,53,32,105,110,115,116,114,117,99,116,105,111,110,115,32,99,97,110,32,98,101,32,115,116,111,114,101,100,0,109,1,1005,1262,1270,3,1262,20101,0,1262,0,109,-1,2106,0,0,109,1,21102,1288,1,0,1105,1,1263,20101,0,1262,0,1102,1,0,1262,109,-1,2106,0,0,109,5,21102,1,1310,0,1106,0,1279,21202,1,1,-2,22208,-2,-4,-1,1205,-1,1332,21202,-3,1,1,21102,1332,1,0,1106,0,1421,109,-5,2106,0,0,109,2,21102,1,1346,0,1105,1,1263,21208,1,32,-1,1205,-1,1363,21208,1,9,-1,1205,-1,1363,1105,1,1373,21102,1370,1,0,1106,0,1279,1105,1,1339,109,-2,2105,1,0,109,5,2101,0,-4,1385,21001,0,0,-2,22101,1,-4,-4,21102,0,1,-3,22208,-3,-2,-1,1205,-1,1416,2201,-4,-3,1408,4,0,21201,-3,1,-3,1106,0,1396,109,-5,2106,0,0,109,2,104,10,22102,1,-1,1,21102,1436,1,0,1106,0,1378,104,10,99,109,-2,2106,0,0,109,3,20002,593,753,-1,22202,-1,-2,-1,201,-1,754,754,109,-3,2106,0,0,109,10,21102,5,1,-5,21102,1,1,-4,21102,0,1,-3,1206,-9,1555,21102,3,1,-6,21102,5,1,-7,22208,-7,-5,-8,1206,-8,1507,22208,-6,-4,-8,1206,-8,1507,104,64,1105,1,1529,1205,-6,1527,1201,-7,716,1515,21002,0,-11,-8,21201,-8,46,-8,204,-8,1106,0,1529,104,46,21201,-7,1,-7,21207,-7,22,-8,1205,-8,1488,104,10,21201,-6,-1,-6,21207,-6,0,-8,1206,-8,1484,104,10,21207,-4,1,-8,1206,-8,1569,21101,0,0,-9,1106,0,1689,21208,-5,21,-8,1206,-8,1583,21101,0,1,-9,1106,0,1689,1201,-5,716,1588,21002,0,1,-2,21208,-4,1,-1,22202,-2,-1,-1,1205,-2,1613,21202,-5,1,1,21101,1613,0,0,1105,1,1444,1206,-1,1634,21201,-5,0,1,21102,1627,1,0,1105,1,1694,1206,1,1634,21102,1,2,-3,22107,1,-4,-8,22201,-1,-8,-8,1206,-8,1649,21201,-5,1,-5,1206,-3,1663,21201,-3,-1,-3,21201,-4,1,-4,1106,0,1667,21201,-4,-1,-4,21208,-4,0,-1,1201,-5,716,1676,22002,0,-1,-1,1206,-1,1686,21101,0,1,-4,1106,0,1477,109,-10,2105,1,0,109,11,21102,1,0,-6,21102,1,0,-8,21101,0,0,-7,20208,-6,920,-9,1205,-9,1880,21202,-6,3,-9,1201,-9,921,1724,21001,0,0,-5,1001,1724,1,1732,21002,0,1,-4,22102,1,-4,1,21101,1,0,2,21102,9,1,3,21101,1754,0,0,1106,0,1889,1206,1,1772,2201,-10,-4,1767,1001,1767,716,1767,20102,1,0,-3,1106,0,1790,21208,-4,-1,-9,1206,-9,1786,21201,-8,0,-3,1105,1,1790,22101,0,-7,-3,1001,1732,1,1796,20102,1,0,-2,21208,-2,-1,-9,1206,-9,1812,22102,1,-8,-1,1106,0,1816,21201,-7,0,-1,21208,-5,1,-9,1205,-9,1837,21208,-5,2,-9,1205,-9,1844,21208,-3,0,-1,1105,1,1855,22202,-3,-1,-1,1106,0,1855,22201,-3,-1,-1,22107,0,-1,-1,1106,0,1855,21208,-2,-1,-9,1206,-9,1869,22101,0,-1,-8,1106,0,1873,21201,-1,0,-7,21201,-6,1,-6,1106,0,1708,22102,1,-8,-10,109,-11,2106,0,0,109,7,22207,-6,-5,-3,22207,-4,-6,-2,22201,-3,-2,-1,21208,-1,0,-6,109,-7,2106,0,0,0,109,5,1201,-2,0,1912,21207,-4,0,-1,1206,-1,1930,21101,0,0,-4,21202,-4,1,1,22102,1,-3,2,21102,1,1,3,21102,1,1949,0,1106,0,1954,109,-5,2105,1,0,109,6,21207,-4,1,-1,1206,-1,1977,22207,-5,-3,-1,1206,-1,1977,22102,1,-5,-5,1106,0,2045,21201,-5,0,1,21201,-4,-1,2,21202,-3,2,3,21101,1996,0,0,1106,0,1954,21201,1,0,-5,21102,1,1,-2,22207,-5,-3,-1,1206,-1,2015,21101,0,0,-2,22202,-3,-2,-3,22107,0,-4,-1,1206,-1,2037,21202,-2,1,1,21101,2037,0,0,105,1,1912,21202,-3,-1,-3,22201,-5,-3,-5,109,-6,2105,1,0";
const B = input.split(",");
const intcode = B.map(entry => parseInt(entry));

solvePartOne();
solvePartTwo();
function solvePartOne() {
  runASpringDroid([
    "NOT A J",
    "OR J T",
    "NOT B J",
    "OR J T",
    "NOT C J",
    "OR J T",
    "NOT D J",
    "NOT J J",
    "AND T J",
    "WALK",
    ""
  ]);
}

function solvePartTwo() {
  runASpringDroid([
    "NOT A J",
    "OR J T",
    "NOT B J",
    "OR J T",
    "NOT C J",
    "OR J T",
    "NOT D J",
    "NOT J J",
    "AND T J",
    "NOT T T",
    "OR E T",
    "OR H T",
    "AND T J",
    "RUN",
    ""
  ]);
}

function runASpringDroid(instructions) {
  const springDroid = new utilities.SpringDroid(instructions);
  utilities.computeIntcode(
    [...intcode],
    springDroid.provideIntcodeInput,
    springDroid.onIntcodeOutput
  );
}
