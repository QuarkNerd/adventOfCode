import scala.compiletime.ops.boolean 
import scala.collection.mutable.Set
import scala.collection.mutable.Map

enum Direction:
  def opposite = 
    this match
      case Up => Direction.Down
      case Down => Direction.Up
      case Right => Direction.Left
      case Left => Direction.Right 
  case Up, Right, Down, Left

class Node(val x: Int, val y: Int, val recentDir: Direction, val recentCount: Int) {
    def getconnected(height: Int, width: Int): Array[Node] =
      Direction.values
      .filter(dir =>
        dir != recentDir.opposite && 
        !(recentCount == 10 && dir == this.recentDir)
        )
      .map(dir => {
        val newRecentCount = if (dir == this.recentDir) this.recentCount + 1 else 4
        val shift = if (dir == this.recentDir) 1 else 4
        dir match
          case Direction.Up => new Node(this.x, this.y + shift, dir, newRecentCount)
          case Direction.Down => new Node(this.x, this.y - shift, dir, newRecentCount)
          case Direction.Right => new Node(this.x + shift, this.y, dir, newRecentCount)
          case Direction.Left => new Node(this.x - shift, this.y, dir, newRecentCount)
          // this wont count the jumped areas
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

@main def solve: Unit =
  val worldMap = scala.io.Source.fromFile("input").mkString.split("\r\n").map(line => line.toArray.map(x => x.toInt - '0'))
  println("worldMap")
  println(worldMap(0)(0))
  // val uu = Array(3)
  // val ii = Array(3)
  // uu.copyToArray(ii, 0, 4)
  // println(ii(1))

  val getConnectedNodes = (startNode: Node) => {
    startNode.getconnected(worldMap.length, worldMap(0).length)
      .map(node => (worldMap(node.y)(node.x), node))
  }

  val isEnd = (node: Node) => node.x == worldMap(0).length - 1 && node.y == worldMap.length - 1

  val start = new Node(0, 0, Direction.Down, 0)
  println(getShortestPath(start, getConnectedNodes, isEnd))


def getShortestPath[A](startNode: A, getConnectedNodes: A => Array[(Int, A)], isEnd: A => Boolean): Int =
  val workingNodes = Set(startNode)
  // val done: Set[A] = Set()
  val distMap = Map(startNode -> 0)
  var currentDist = 0
  var current = startNode;

  var i = 0
  // before: Long = 1694035209622
  // totalTime: Long = 803
  while(!isEnd(current)) {
    i += 1
    // println(i)
    val before = System.currentTimeMillis(); 
    current = workingNodes.minBy(distMap)
    println("min")
    println(System.currentTimeMillis-before)
    // println(current.asInstanceOf[Node].lastThree.mkString)
    // println("current")
    // // println(current.asInstanceOf[Node].y)
    // // println(distMap.get(current).get)
    workingNodes -= current
    // done += current && !done.contains(node)

    currentDist = distMap.get(current).get
    for ((dist, node) <- getConnectedNodes(current)) {
      // println("dist")
      // println(dist)
      val totalDistance = currentDist + dist
      if (totalDistance < distMap.getOrElse(node, Int.MaxValue)) {
        workingNodes += node
        distMap += (node -> totalDistance)
      }
    }
    println("all")
    println(System.currentTimeMillis-before)
  }
  currentDist

// def keyword is interesting
// whitespace
// https://stackoverflow.com/questions/14672064/returning-in-a-scala-for-loop
// https://www.baeldung.com/scala/for-comprehension