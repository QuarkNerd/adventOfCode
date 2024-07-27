import java.io.File
import kotlin.random.Random

class SuperNode(initial: String) {
    val inner = mutableSetOf(initial);
    val edges = arrayListOf<Edge>();
}

class Edge(var one: SuperNode, var two: SuperNode) {
    fun redirect(from: SuperNode, to: SuperNode) {
        if (one === from) {
            one = to;
        } else if (two === from) {
            two = to;
        } else {
          throw Exception("Invalid operation");
        }
    }
}

class Graph(scheme: String) {
    val allEdges = arrayListOf<Edge>();

    val superNodes: List<SuperNode>
        get() = allEdges.flatMap { listOf(it.one, it.two) }.toSet().toList();

    init {
        val nodes = hashMapOf<String, SuperNode>();
        scheme.lines().forEach {
            val spl = it.split(": ");
            val node1name = spl[0];
            val superNode1 = nodes.getOrPut(node1name) { SuperNode(node1name) };
            spl[1].split(' ').forEach {
                node2name ->
                val superNode2 = nodes.getOrPut(node2name) { SuperNode(node2name) };
                var edge = Edge(superNode1, superNode2);
                allEdges.add(edge);
                superNode1.edges.add(edge);
                superNode2.edges.add(edge);
            }
        }
    }

    fun removeRandomEdge() {
        val edge = removeRandomElement(allEdges);
        edge.one.edges.remove(edge);
        edge.two.edges.remove(edge);

        edge.one.inner.addAll(edge.two.inner);
        edge.two.edges.forEach {
            edgeConnectedToTwo ->
            if (edge.one.edges.contains(edgeConnectedToTwo)) {
                edge.one.edges.remove(edgeConnectedToTwo);
                allEdges.remove(edgeConnectedToTwo);
            } else {
                edgeConnectedToTwo.redirect(edge.two, edge.one);
                edge.one.edges.add(edgeConnectedToTwo);
            }
        }
    }
}

fun main(args: Array<String>) {
    val input = File("input").readText();

    var k = 1468;
    while (true) {
        val graph = Graph(input);

        while (graph.superNodes.size > 2) {
            graph.removeRandomEdge();
        }
        val superNodes = graph.superNodes;
        k = superNodes[0].inner.size * superNodes[1].inner.size;

        // basically trial and error here, probably should determine number of edged that connect the nodes
        if (superNodes[0].inner.size > 500 && superNodes[1].inner.size > 500) {
            break;
        }
    }
     print(k);
}

fun <T> removeRandomElement(list: ArrayList<T>): T {
    val randomIndex = Random.nextInt(list.size);
    return list.removeAt(randomIndex);
}