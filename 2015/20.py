import math
from functools import reduce
import time
from sympy.ntheory import factorint

INPUT = 29000000

def sum_of_powers_upto(x, pow):
    return int((math.pow(x, pow+1) - 1)/(x-1))

def get_factor_sum(inp):
    xxxx = [sum_of_powers_upto(x, pow) for x, pow in factorint(inp).items()]
    return reduce((lambda x, y: x * y), xxxx)

def part_two_gifts(inp):
    sum = 0
    for i in range(1,51):
        if inp%i == 0:
            sum += 11*(inp/i)
    return sum

def print_factors(x):
    factors = []

    i = 1
    while i * i < x:
        if x%i==0:
            factors.append(i)
            if x//i != i:
                factors.append(x//i)
        i = i+1
    return factors


x = math.floor(2 * math.sqrt(INPUT/10))
start = time.time()
while True:
    x += 1
    if get_factor_sum(x) >= INPUT/10:
        break
print(x)
print(time.time() - start)

x = math.floor(2 * math.sqrt(INPUT/10))
start = time.time()
while True:
    x += 1
    if sum(print_factors(x)) >= INPUT/10:
        break
print(x)
print(time.time() - start)

while True:
    x += 1
    if part_two_gifts(x) >= INPUT:
        break
print(x)
