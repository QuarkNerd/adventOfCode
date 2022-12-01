from functools import reduce
import itertools

# This solution is overly simplified, it works on my input and seemingly
# many other people's but it doesnt check evrything
input = [int(x) for x in open("input/24", "r").read().strip().splitlines()]
compartment_weight_one = sum(input)//3
compartment_weight_two = sum(input)//4

for i in range(len(input)):
    for x in itertools.combinations(input, i):
        # comment in for part 2
        # if sum(x) == compartment_weight_two:
        #     prod = reduce((lambda x, y: x * y), x)
        #     raise Exception(prod) 
        if sum(x) != compartment_weight_one:
            continue
        remaining = [*filter(lambda ele: ele not in x, input)]
        for j in range(len(remaining)):
            for y in itertools.combinations(remaining, j):    
                if sum(y) != compartment_weight_one:
                    continue
                found = True
                prod = reduce((lambda x, y: x * y), x)
                raise Exception(prod)                
