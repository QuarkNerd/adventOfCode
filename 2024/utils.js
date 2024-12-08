/**
 * Takes a landscape (map) as a string and returns the locations of nodes based on filter.
 * y is positive in down and x is positive in right
 * @param  {String} landscape The string representation of the landscape
 * @param  {String => boolean} shouldMap Function to show if a char should be mapped.
 * @return {{
 *      height: number
 *      width: number
 *      nodes: {
 *          [key: String]: {
 *              x: number
 *              y: number
 *          }[] // maps string to locations
 *      }
 * }}
 */
function landscapeToHashmap(landscape, shouldMap) {
  const split = landscape.split(/\r?\n/).map((x) => x.split(""));
  const height = split.length;
  const width = split[0].length;
  const nodes = {};

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const char = split[y][x];
      if (shouldMap(char)) {
        nodes[char] ? null : (nodes[char] = []);
        nodes[char].push({ x, y });
      }
    }
  }
  return { nodes, height, width };
}

function forEveryPair(list, func) {
  const ret = [];
  for (let i = 0; i < list.length; i++) {
    const itemOne = list[i];
    for (let j = i + 1; j < list.length; j++) {
      const itemTwo = list[j];
      ret.push(func(itemOne, itemTwo));
    }
  }
  return ret;
}

function getHCF(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  const limit = Math.min(a, b);
  let currentHighest = 1;
  for (let i = 2; i <= limit; i++) {
    if (a % i == 0 && b % i == 0) {
      currentHighest = i;
    }
  }
  return currentHighest;
}

module.exports = { forEveryPair, landscapeToHashmap, getHCF };
