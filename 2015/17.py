import itertools

input = open("input/17", "r").read().strip()
buckets = [int(x) for x in input.splitlines()]

count = 0
part_two_done = False

for i in range(len(buckets)):
    count_for_i_containers = 0
    for collection in itertools.combinations(buckets, i):
        if sum(collection) == 150:
            count_for_i_containers +=1
    
    count += count_for_i_containers

    if count_for_i_containers > 0 and not part_two_done:
        print("Part two: " + str(count_for_i_containers))
        part_two_done = True

print(count)