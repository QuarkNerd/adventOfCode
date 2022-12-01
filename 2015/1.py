f = open("input/1", "r")
inpu = f.read().strip()

floor = 0;

for i, action in enumerate(inpu):
    floor += 1 if action == "(" else -1
    if floor < 0:
        print(i+1)
        break

