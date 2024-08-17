import scala.collection.mutable
import scala.collection.mutable.Set
import scala.collection.mutable.Map
import scala.io.Source

// Fairly slow on part 2, could maybe be sped up by pruning nodes based on recentCount
// i.e, node x,y where you have been going for 8 blocks, is worse than going for 4 blocks

//// Part One
//val MAXIMUM_DISTANCE = 3;
//val MINIMUM_DISTANCE = 1;

// Part Two
val MAXIMUM_DISTANCE = 10;
val MINIMUM_DISTANCE = 4;

enum Direction:
  def opposite: Direction =
    this match
      case Up => Direction.Down
      case Down => Direction.Up
      case Right => Direction.Left
      case Left => Direction.Right
  case Up, Right, Down, Left

class Node(val x: Int, val y: Int, val recentDir: Direction, val recentCount: Int) {
  def getConnected(height: Int, width: Int): Array[Node] =
    var dirs = Direction.values
      .filter(dir =>
        (dir != recentDir.opposite || recentCount == 0)
          && !(recentCount == MAXIMUM_DISTANCE && dir == this.recentDir)
      )

    if (recentCount == 0) {
      dirs = Direction.values
    } else if (recentCount < MINIMUM_DISTANCE) {
      dirs = Array(recentDir)
    }


    dirs
      .map(dir => {
        val newRecentCount = if (dir == this.recentDir) this.recentCount + 1 else 1
        dir match
          case Direction.Up => new Node(this.x, this.y + 1, dir, newRecentCount)
          case Direction.Down => new Node(this.x, this.y - 1, dir, newRecentCount)
          case Direction.Right => new Node(this.x + 1, this.y, dir, newRecentCount)
          case Direction.Left => new Node(this.x - 1, this.y, dir, newRecentCount)
      }).filter(node => {
        0 <= node.x && node.x < width && 0 <= node.y && node.y < height
      })

  override def equals(that: Any): Boolean =
    that match
    {
      case that: Node => x == that.x && y == that.y &&
        recentCount == that.recentCount && recentDir == that.recentDir
      case _ => false
    }
  override def hashCode: Int = {
    val prime = 31
    var result = 1
    result = prime * result + x;
    result = prime * result + y;
    result = prime * result + recentCount;
    result = prime * result + recentDir.ordinal;

    return result
  }
}

@main def run() =
  val worldMap = Source.fromResource("inp").mkString.split("\r\n").map(line => line.toArray.map(x => x.toInt - '0'))
  val getConnectedNodes = (startNode: Node) => {
    startNode.getConnected(worldMap.length, worldMap(0).length)
      .map(node => (worldMap(node.y)(node.x), node))
  }

  val isEnd = (node: Node) => node.x == worldMap(0).length - 1 && node.y == worldMap.length - 1 && node.recentCount >= MINIMUM_DISTANCE

  val start = new Node(0, 0, Direction.Left, 0)
  println(getShortestPath(start, getConnectedNodes, isEnd))


def getShortestPath(startNode: Node, getConnectedNodes: Node => Array[(Int, Node)], isEnd: Node => Boolean): Int =
  val workingNodes = mutable.Set(startNode)
  val distMap = mutable.Map(startNode -> 0)
  var currentDist = 0
  var current = startNode;

  while(!isEnd(current)) {
    val before = System.currentTimeMillis();
    current = workingNodes.minBy(distMap)
    workingNodes -= current

//    if /

    currentDist = distMap(current)
    for ((dist, node) <- getConnectedNodes(current)) {
      val totalDistance = currentDist + dist
      if (totalDistance < distMap.getOrElse(node, Int.MaxValue)) {
        workingNodes += node
        distMap += (node -> totalDistance)
      }
    }
  }
  currentDist

// def keyword is interesting
// whitespace
// https://stackoverflow.com/questions/14672064/returning-in-a-scala-for-loop
// https://www.baeldung.com/scala/for-comprehension