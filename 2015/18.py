def getNextStep(grid):
    height = len(grid)
    width = len(grid[0])

    newGrid = [[None for i in range(width)] for j in range(height)]
    for i in range(height):
        for j in range(width):
            neighbors = list(filter(
                lambda coor: coor[0] > -1 and coor[0] < height and coor[1] > -1 and coor[1] < width,
                [
                [i-1, j-1],[i-1, j], [i-1, j+1],
                [i, j-1], [i, j+1],
                [i+1, j-1],[i+1, j], [i+1, j+1]
                ]))
            live_count = sum(grid[coor[0]][coor[1]] for coor in neighbors)

            newGrid[i][j] = 1 if (
                live_count == 3 or (live_count == 2 and grid[i][j] == 1)
            ) else 0
    return newGrid

input = open("input/18", "r").read().strip()
grid = [[1 if char == "#" else 0 for char in list(line)] for line in input.splitlines()]

for i in range(100):
    grid = getNextStep(grid)
print(sum(sum(line) for line in grid))

grid = [[1 if char == "#" else 0 for char in list(line)] for line in input.splitlines()]

for i in range(100):
    grid[0][0] = grid[0][99] = grid[99][0] = grid[99][99] = 1
    grid = getNextStep(grid)
grid[0][0] = grid[0][99] = grid[99][0] = grid[99][99] = 1
print(sum(sum(line) for line in grid))


