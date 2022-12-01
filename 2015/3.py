f = open("input/3", "r")
inpu = f.read().strip()

def get_next_pos(initial, direction):
	if direction == '>':
		return (initial[0], initial[1] + 1)
	elif direction == '<':
		return (initial[0], initial[1] - 1)
	elif direction == '^':
		return (initial[0] - 1, initial[1])
	elif direction == 'v':
		return (initial[0] + 1, initial[1])

current = (0,0)
myset = set()
myset.add(current)

for direction in inpu:
	current = get_next_pos(current, direction)
	myset.add(current)

print(len(myset))

current = (0,0)
current_ = (0,0)
myset = set()
myset.add(current)
myset.add(current_)

for index, direction in enumerate(inpu):
	if index%2 == 0:
		current = get_next_pos(current, direction)
		myset.add(current)
	else:
		current_ = get_next_pos(current_, direction)
		myset.add(current_)

print(len(myset))


