input = open("input/8", "r").read().strip()
lines = input.splitlines()


print(sum(map(lambda str: len(str) - len(eval(str)), lines)))
print(sum(map(lambda str: len(repr(str)) - len(str), lines)))

lo = lambda str: len(repr(str)) - len(str)

print(lo(lines[0]))
print(lo(lines[1]))
print(lo(lines[2]))
print(lo(lines[3]))