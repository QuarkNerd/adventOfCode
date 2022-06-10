from itertools import permutations

def sliding_window(elements, window_size):
    if len(elements) <= window_size:
        return frozenset()
    for i in range(len(elements) - window_size + 1):
        yield frozenset(elements[i:i+window_size])

def getWeight(weights, return_to_start = False):
    nodes_list = set()
    for node_pair in weights.keys():
        nodes_list.update(node_pair)

    minWeight = 10**10
    maxWeight = -10**10

    for route in permutations(nodes_list):
        if return_to_start:
            route += (route[0],)

        pairs = sliding_window(route, 2)
        weight = sum(map(lambda p: weights[p], pairs))

        if weight < minWeight:
            minWeight = weight

        if weight > maxWeight:
            maxWeight = weight
    
    return (minWeight, maxWeight)
