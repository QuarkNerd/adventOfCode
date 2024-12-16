const {
  landscapeToHashmap,
  forEveryPair,
  getHCF,
} = require("../../shared/js/utils");

function solve(inputString) {
  const { height, width, nodes } = landscapeToHashmap(
    inputString,
    (c) => c !== "."
  );

  function solve(P2) {
    const antiNodes = Object.values(nodes)
      .flatMap((ant) => getIntegerAntiNodes(ant, height, width, P2))
      .map((n) => n.x + "," + n.y);

    return new Set([...antiNodes]).size;
  }

  return [solve(), solve(true)];
}

function getIntegerAntiNodes(listOfAntenna, height, width, P2) {
  return forEveryPair(listOfAntenna, (one, two) =>
    P2
      ? getAntiNodesP2(one, two, height, width)
      : getAntiNodes(one, two, height, width)
  ).flat();
}

function getAntiNodes(antennaOne, antennaTwo, height, width) {
  const diffX = antennaOne.x - antennaTwo.x;
  const diffY = antennaOne.y - antennaTwo.y;

  const antiNodes = [
    { x: antennaOne.x + diffX, y: antennaOne.y + diffY },
    { x: antennaTwo.x - diffX, y: antennaTwo.y - diffY },
  ];

  return antiNodes.filter(
    (antiNode) =>
      0 <= antiNode.x &&
      antiNode.x < width &&
      0 <= antiNode.y &&
      antiNode.y < height
  );
}

function getAntiNodesP2(antennaOne, antennaTwo, height, width) {
  const diff = [antennaOne.x - antennaTwo.x, antennaOne.y - antennaTwo.y];
  const hcf = getHCF(diff);
  const diffX = diff[0] / hcf;
  const diffY = diff[1] / hcf;
  const antiNodes = [];

  let i = 0;
  while (true) {
    const newAntiNodes = [
      { x: antennaOne.x + diffX * i, y: antennaOne.y + diffY * i },
      { x: antennaTwo.x - diffX * i, y: antennaTwo.y - diffY * i },
    ].filter(
      (antiNode) =>
        0 <= antiNode.x &&
        antiNode.x < width &&
        0 <= antiNode.y &&
        antiNode.y < height
    );
    if (!newAntiNodes.length) {
      break;
    }
    newAntiNodes.forEach((an) => antiNodes.push(an));
    i++;
  }

  return antiNodes;
}

module.exports = solve;
