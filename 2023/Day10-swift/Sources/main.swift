import Foundation

enum Direction {
    case north
    case south
    case east
    case west
}

struct Location: Hashable {
    let i: Int
    let j: Int

    func next(direction: Direction) -> Location {
        switch direction {
            case .north:
                return Location(i: i - 1, j: j)
            case .east:
                return Location(i: i, j: j + 1)
            case .south:
                return Location(i: i + 1, j: j)
            case .west:
                return Location(i: i, j: j - 1)
        }
    }
}

extension StringProtocol {
    var lines: [SubSequence] { split(whereSeparator: \.isNewline) }
}

extension Collection where Indices.Iterator.Element == Index {
    subscript (safe index: Index) -> Iterator.Element? {
        return indices.contains(index) ? self[index] : nil
    }
}

let input = try String( contentsOf: URL( fileURLWithPath: "input" )  )  
let world: [[Character]] =  input.lines.map({ Array($0) })

var start: Location = Location(i: 0, j: 0)
var direction = Direction.north
allLoop: for i in stride(from: 0, to: world.count, by: 1) {
    for j in stride(from: 0, to: world[0].count, by: 1) {
        if (world[i][j] == "S") {
            start = Location(i: i, j: j)

            let east = world[i][safe: j+1]
            if(east == "-" || east == "7" || east == "J") {
                direction = Direction.east
            } else if (world[safe: i+1] != nil) {
                let south = world[i+1][j]
                if(south == "|" || south == "L" || south == "J") {
                    direction = Direction.south
                }
            }
            
            break allLoop
        }
    }
}

var count = 0
var location = start
var verticalWall: [Location] = []
var allPipes: Set = [location]
repeat {
    location = location.next(direction: direction)
    let new = world[location.i][location.j];
    if (new != "-" && new != "7" && new != "F") {
        verticalWall.append(location)
    }
    allPipes.insert(location)
    switch direction {
        case .north:
            if (new == "F") {
                direction = .east
            } else if (new == "7") {
                direction = .west
            }
            break
        case .east:
            if (new == "J") {
                direction = .north
            } else if (new == "7") {
                direction = .south
            }
            break
        case .south:
            if (new == "L") {
                direction = .east
            } else if (new == "J") {
                direction = .west
            }
            break
        case .west:
            if (new == "F") {
                direction = .south
            } else if (new == "L") {
                direction = .north
            }
            break
    }
        
    count+=1
} while (location != start)
print(count/2)

let verticalWallIndicators = Set(verticalWall)
var partTwoCount = 0
for i in stride(from: 0, to: world.count, by: 1) {
    for j in stride(from: 0, to: world[0].count, by: 1) {
         if (!allPipes.contains(Location(i: i, j: j))) {

            if (start.i == i && start.j > j) {
                let left = (0...j).map( {Location(i: i, j: $0)} )
                let leftWallsInLoop = verticalWallIndicators.intersection(Set(left)).count
                partTwoCount += leftWallsInLoop%2
            } else {
                let right = ((j+1)...world[0].count).map( {Location(i: i, j: $0)} )
                let rightWallsInLoop = verticalWallIndicators.intersection(Set(right)).count
                partTwoCount += rightWallsInLoop%2
            }
         }
    }
}
print(partTwoCount)
