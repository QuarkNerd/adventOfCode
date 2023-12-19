def calculate_area(instructions):
    verticies = []
    current = (0,0)
    area = 1
    for direction, distance in instructions:
        verticies.append(current)
        area += distance/2
        match direction:
            case "U" | "3":
                current = (current[0], current[1] + distance)
            case "D" | "1":
                current = (current[0], current[1] - distance)
            case "R" | "0":
                current = (current[0] + distance, current[1])
            case "L" | "2":
                current = (current[0] - distance, current[1])
    for (i, coor) in enumerate(verticies):
        prevcoor = verticies[i - 1]
        area -= (prevcoor[1] + coor[1])*(prevcoor[0] - coor[0])/2
    return area

def parse_line_part_one(line):
    direction, distance, _ = line.split(" ")
    return (direction, int(distance))

def parse_line_part_two(line):
    _, _, hexcode = line.split(" ")
    distance = int(hexcode[2:7], 16)
    direction = hexcode[7]
    return (direction, distance)

f = open("input", "r")
inpu = f.read().strip()

partone = [parse_line_part_one(x) for x in inpu.splitlines()]
print("Part one: " + str(int(calculate_area(partone))))

parttwo = [parse_line_part_two(x) for x in inpu.splitlines()]
print("Part two: " + str(int(calculate_area(parttwo))))
