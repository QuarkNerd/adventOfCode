function findShortestPathLength(startingState, getNeighbors, isFinalState) {
  const shortestDistancesHash = {
    [startingState]: 0,
  };

  const sortedStates = [startingState];

  const completedStatesDistance = {};

  while (true) {
    if (!sortedStates.length) throw new Error("Failed to find path");
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

module.exports = { findShortestPathLength };
