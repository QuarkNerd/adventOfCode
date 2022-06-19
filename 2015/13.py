import visitAllNodes

input = open("input/13", "r").read().strip()
lines = input.splitlines()

people = set()
happiness_pairs = {}

for line in lines:
    split = line.split(" ")

    pair = frozenset([split[0], split[10][0:-1]])
    people.update([split[0], split[10][0:-1]])

    change = int(split[3]) if split[2] == "gain" else -1*int(split[3]) 

    if pair not in happiness_pairs:
         happiness_pairs[pair] = change
    else:
        happiness_pairs[pair] += change

print(visitAllNodes.getWeight(happiness_pairs, True)[1])

for p in people:
    happiness_pairs[frozenset(["ME", p])] = 0

print(visitAllNodes.getWeight(happiness_pairs, True)[1])