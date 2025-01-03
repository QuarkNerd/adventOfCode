function findShortestPathLength(startingState, getNeighbors, isFinalState) {
  const shortestDistancesHash = {
    [startingState]: 0,
  };

  const sortedStates = [startingState];

  const completedStatesDistance = {};

  while (true) {
    if (!sortedStates.length) return null;
    const stateValue = sortedStates.shift();
    const shortestDistance = shortestDistancesHash[stateValue];

    if (shortestDistancesHash[stateValue] === undefined) continue;

    const neighbors = [];
    if (isFinalState(stateValue)) return shortestDistance;
    getNeighbors(stateValue).forEach(({ neighbor, distance }) => {
      if (completedStatesDistance[neighbor] !== undefined) return;
      const oldDistance = shortestDistancesHash[neighbor] ?? Infinity;
      if (oldDistance > distance + shortestDistance) {
        shortestDistancesHash[neighbor] = distance + shortestDistance;
        neighbors.push(neighbor);
      }
    });

    neighbors.sort((a, b) =>
      shortestDistancesHash[a] < shortestDistancesHash[b] ? -1 : 1
    );

    neighbors.forEach((a) => {
      const index = getIndexToInsertInSortedArray(
        sortedStates,
        shortestDistancesHash[a],
        shortestDistancesHash
      );

      sortedStates.splice(index, 0, a);

      completedStatesDistance[stateValue] = shortestDistance;
      delete shortestDistancesHash[stateValue];
    });
  }
}

function getIndexToInsertInSortedArray(
  sortedArray,
  valueToInsert,
  itemToValueHash
) {
  let lowerBound = 0;
  let upperBound = sortedArray.length - 1;
  if (valueToInsert <= itemToValueHash[sortedArray[0]]) return 0;
  if (valueToInsert >= itemToValueHash[sortedArray[upperBound]])
    return upperBound + 1;
  while (true) {
    const index = parseInt((lowerBound + upperBound) / 2);
    if (valueToInsert < itemToValueHash[sortedArray[index]]) upperBound = index;
    else if (valueToInsert > itemToValueHash[sortedArray[index + 1]])
      lowerBound = index;
    else return index + 1;
  }
}

function binaryIntSearch(min, max, func) {
  while (min !== max) {
    let mid = Math.floor((min + max) / 2);
    const result = func(mid);
    switch (result) {
      case "MATCH":
        return mid;
      case "TOO_HIGH":
        max = mid;
        break;
      case "TOO_LOW":
        min = mid;
        break;
    }
  }
  return func(min) === "MATCH" ? min : null;
}

module.exports = { findShortestPathLength, binaryIntSearch };
