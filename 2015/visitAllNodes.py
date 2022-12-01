from itertools import permutations

def sliding_window(elements, window_size):
    if len(elements) <= window_size:
        return frozenset()
    for i in range(len(elements) - window_size + 1):
        yield frozenset(elements[i:i+window_size])

def getWeightForRoute(route, weights, return_to_start): 
    if return_to_start:
        route += (route[0],)

    pairs = sliding_window(route, 2)
    return sum(map(lambda p: weights[p], pairs))

def getWeight(weights, return_to_start = False):
    nodes_list = set()
    for node_pair in weights.keys():
        nodes_list.update(node_pair)

    weights_list = list(map(lambda route: getWeightForRoute(route, weights, return_to_start), permutations(nodes_list)))
    return (min(weights_list), max(weights_list))
