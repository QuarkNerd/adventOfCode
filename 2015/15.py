import numpy as np

input = open("input/15", "r").read().strip()
lines = input.splitlines()


def getProperties(description):
    split = description.replace(",", "").split(" ")
    return [int(split[2]), int(split[4]), int(split[6]), int(split[8]), int(split[10])]

properties = np.array(list(map(getProperties, lines)))

max_score = 0
max_diet_score = 0

for i in range(101):
    for j in range(101 - i):
        for k in range(101 - (i+ j)):
            l = 100 - (i + j +k)
            if l < 1:
                break
            values = np.matmul(np.array([i,j,k,l]), properties)
            if True in (ele < 0 for ele in values):
                break
            score = np.prod(values[:-1])

            if score > max_score:
                max_score = score
            
            if values[-1] == 500 and score > max_diet_score:
                max_diet_score = score

print(max_score)
print(max_diet_score)