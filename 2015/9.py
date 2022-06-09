from itertools import permutations
import re

def sliding_window(elements, window_size):
    if len(elements) <= window_size:
        return frozenset()
    for i in range(len(elements) - window_size + 1):
        yield frozenset(elements[i:i+window_size])

input = open("input/9", "r").read().strip()
lines = input.splitlines()

distances = {}
all_locations = set("")

for journey in lines:
    route, distance = journey.split(" = ")
    distances[frozenset(route.split(" to "))] = int(distance)
    all_locations.update(route.split(" to "))


minDistance = 10**10
maxDistance = 0

for route in permutations(all_locations):
    pairs = sliding_window(route, 2)
    dist = sum(map(lambda p: distances[p], pairs))

    if dist < minDistance:
        minDistance = dist

    if dist > maxDistance:
        maxDistance = dist

print(minDistance)
print(maxDistance)