import org.javatuples.Pair;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// Yeah this code is just awful
public class Main2 {

    private static HashMap<Coor, List<Pair<Coor, Integer>>> graph = new HashMap<>();
    private static Tile[][] map = getInput();
    private static List<Coor> todo = new ArrayList<>(Arrays.asList(new Coor(1, 0)));

    public static void main(String[] args) throws IOException {

        var start = new Coor(1, 0);
        var target = new Coor(map[0].length - 2, map.length - 1);

        while (todo.size() > 0) {
            var node = todo.remove(0);
            if (graph.containsKey(node)) continue;
            System.out.println(node.x + "--" + node.y);
            updateFor(node);
        }

        var paths = new HashSet<Path>();
        paths.add(new Path(start));
        var dist = 0;

        per_path_loop:
        while (!paths.isEmpty()) {
            var path = paths.iterator().next();
            paths.remove(path);

            var nexts = graph.get(path.getMostRecent());

            var newPaths = new HashSet<Path>();
            for (var next: nexts) {
                Coor n = next.getValue0();

                if (n.equals(target)) {
                                if (path.getLength() + next.getValue1() > dist) {
                                    dist = path.getLength() + next.getValue1();
                                    System.out.println(dist);
                                }
                                 continue per_path_loop;
                }

                if (path.canAddNode(n)) {
                    newPaths.add(path.getNewWith(n, next.getValue1()));
                }
            }
            paths.addAll(newPaths);
        }

        System.out.println(dist);

    }

    static private void updateFor(Coor coor) {
        graph.put(coor, new ArrayList<>());
        getPossibleDirections(coor).forEach(dir -> {
            var connected = getConnectedInDirection(coor, dir);
            graph.get(coor).add(connected);
            todo.add(connected.getValue0());
        });
    }

    static private Pair<Coor, Integer> getConnectedInDirection(Coor coor, Direction direction) {
        int dist = 0;
        while (true) {
            coor = new Coor(coor.x + direction.xChange, coor.y + direction.yChange);
            dist++;
            Direction finalDirection = direction;
            List<Direction> options = getPossibleDirections(coor).filter(x -> finalDirection.getOpposite() != x).collect(Collectors.toList());

            if (options.size() != 1) {
                return new Pair<>(coor, dist);
            }
            direction = options.get(0);
        }
    }

    static private Stream<Direction> getPossibleDirections(Coor coor) {
        if (coor.y == 0) return Stream.of(Direction.South);
        if (coor.y == map.length - 1) return Stream.of(Direction.North);
        if (map[coor.y][coor.x] != Tile.Path) {
            // Comment in for part one
//            switch (map[coor.y][coor.x]) {
//                case NorthSlope:
//                    return Stream.of(Direction.North);
//                case SouthSlope:
//                    return Stream.of(Direction.South);
//                case EastSlope:
//                    return Stream.of(Direction.East);
//                case WestSlope:
//                    return Stream.of(Direction.West);
//            }
        }
        return Stream.of(Direction.North, Direction.East, Direction.South, Direction.West).filter(
                dir -> map[coor.y + dir.yChange][coor.x + dir.xChange] != Tile.Forest
                );
    }

    static private Tile[][] getInput() {
        try {
            String inp = new String(Files.readAllBytes(Paths.get("input")));
            return Arrays.stream(inp.split("\\R"))
                    .map(String::chars)
                    .map(charArray -> charArray.mapToObj(Tile::fromValue).toArray(Tile[]::new))
                    .toArray(Tile[][]::new);
        } catch (Exception exception) {
            throw new RuntimeException();
        }
    }
}
