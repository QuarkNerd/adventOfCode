import visitAllNodes

input = open("input/9", "r").read().strip()
lines = input.splitlines()

distances = {}

for journey in lines:
    route, distance = journey.split(" = ")
    distances[frozenset(route.split(" to "))] = int(distance)

print(visitAllNodes.getWeight(distances))