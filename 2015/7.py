import re

input = open("input/7", "r").read().strip()
lines = input.splitlines()

signal_cache = {}
input_steps = {}

def calculate_signal(wire):
    split = input_steps[wire].split(" ")
    if len(split) == 1:
        return get_wire_signal(split[0])
    if len(split) == 2:
        return ~get_wire_signal(split[1])
    match split[1]:
        case "AND":
            return get_wire_signal(split[0])  & get_wire_signal(split[2])
        case "OR":
            return get_wire_signal(split[0])  | get_wire_signal(split[2])
        case "LSHIFT":
            return get_wire_signal(split[0])  << get_wire_signal(split[2])
        case "RSHIFT":
            return get_wire_signal(split[0])  >> get_wire_signal(split[2])

def get_wire_signal(wire):
    if wire.isdigit():
        return int(wire)
    if wire in signal_cache:
        return signal_cache[wire]
    signal_cache[wire] = calculate_signal(wire)
    return signal_cache[wire]

for instruction in lines:
    steps, wire = instruction.split(" -> ")
    input_steps[wire] = steps

wire_a = get_wire_signal("a")
print(wire_a)

signal_cache = {"b": wire_a}
print(get_wire_signal("a"))
