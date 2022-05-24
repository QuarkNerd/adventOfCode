import re

value = "3113322113"

def describe(match): 
    return str(len(match[0])) + match[1]

def look_and_say(inp):
    sections = re.findall(r"((.)\2*)", inp)
    return "".join(map(describe, sections))

for x in range(0, 40):
    value = look_and_say(value)

print(len(value))

for x in range(0, 10):
    value = look_and_say(value)

print(len(value))


