def find_all(txt, query):
    list = []
    i = 0
    res = 0
    find = txt.find(query, i)
    while find != -1:
        list.append(find)
        i = find + 1
        find = txt.find(query, i)
    return list
        
def replace_all_seperately(txt, query, replace):
    locations = find_all(txt, query)
    return [txt[:i] + replace + txt[i + len(query):] for i in locations]


input_splt = open("input/19", "r").read().strip().splitlines()

swaps = input_splt[:-2]
inital_string = input_splt[-1]

possible_final_strings = set()
reverse_swaps = {}
for sw in swaps:
    inp, final = sw.split(" => ")
    reverse_swaps[final] = inp
    possible_final_strings.update(replace_all_seperately(inital_string, inp, final))

print(len(possible_final_strings))

seeds = sorted(reverse_swaps.keys(), key=len)
seeds.reverse()

def stepsToE(initial, st = 0):
    if (initial == 'e'):
        raise Exception(st) 
    if (len(initial) == 1):
        return
    for s in seeds:
        for newString in replace_all_seperately(initial, s, reverse_swaps[s]):
            stepsToE(newString, st + 1)

stepsToE(inital_string)