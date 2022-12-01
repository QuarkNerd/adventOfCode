import json

input = open("input/12", "r").read().strip()

obj = json.loads(input)

def sum_deep(input):
    if type(input) is int:
        return input
    if type(input) is str:
        return 0
    if type(input) is dict:
        vals = input.values()
        if "red" in vals:
            return 0
        return(sum_deep(vals))
    return sum(map(
        sum_deep,
        input
    ))

print(sum_deep(obj))