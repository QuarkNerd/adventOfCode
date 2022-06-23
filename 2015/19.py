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

for sw in swaps:
    inp, final = sw.split(" => ")
    possible_final_strings.update(replace_all_seperately(inital_string, inp, final))

print(len(possible_final_strings))

i = 0
bbb = set("e")
while True:
    i +=  1
    print(i)
    print(len(bbb))

    new_bbb = set()
    for x in bbb: 
        for sw in swaps:
            inp, final = sw.split(" => ")
            new_bbb.update(replace_all_seperately(x, inp, final))
    bbb = new_bbb

    if inital_string in bbb:
        break
