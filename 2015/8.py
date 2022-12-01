from itertools import count

input = open("input/8", "r").read().strip()
lines = input.splitlines()

print(sum(map(lambda str: len(str) - len(eval(str)), lines)))
print(sum(map(lambda str: len(repr(str)) + str.count('"') - len(str), lines)))
