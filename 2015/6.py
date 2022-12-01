import itertools
import re

def convert_to_num(coor):
    return coor[0] + coor[1] * 1000

def get_light_nums(x_min, x_max, y_min, y_max):
    return map(convert_to_num, itertools.product(range(x_min, x_max + 1), range(y_min, y_max + 1)))

input = open("input/6", "r").read().strip()
lines = input.splitlines()

lights_part_one = [False] * 1000000
lights_part_two = [0] * 1000000

for instruction in lines:
    match = re.search('([a-z]+)\W(\d+),(\d+)\Wthrough\W(\d+),(\d+)', instruction.strip())
    action, x_min, y_min, x_max, y_max = match.group(1), match.group(2), match.group(3), match.group(4), match.group(5)
    lights = get_light_nums(int(x_min), int(x_max), int(y_min), int(y_max))
    match action:
        case "on":
            for num in lights:
                lights_part_one[num] = True
                lights_part_two[num] += 1
        case "off":
            for num in lights:
                lights_part_one[num] = False
                lights_part_two[num] = 0 if lights_part_two[num] == 0 else lights_part_two[num] - 1
        case "toggle":
            for num in lights:
                lights_part_one[num] = not lights_part_one[num]
                lights_part_two[num] += 2

on = filter(None, lights_part_one)
print(len(list(on)))
print(sum(lights_part_two))
