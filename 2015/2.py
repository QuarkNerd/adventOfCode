f = open("input/2", "r")
input = f.read()
lines = input.splitlines()

area = 0;
ribbon = 0

for line in lines:
	w, h, l = line.split("x")
	w, h, l = int(w), int(h), int(l)
	
	current_area = 2*(w*l + l*h + h*w)
	current_ribbon = w*l*h

	if w >= l and w >= h:
		current_area += l*h
		current_ribbon += 2*(l+h)
	elif l >= w and l >= h:
		current_area += w*h
		current_ribbon += 2*(w+h)
	else:
		current_area += l*w
		current_ribbon += 2*(l+w)

	area += current_area
	ribbon += current_ribbon

print(area)
print(ribbon)

