import org.javatuples.Pair;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {

    public static void main(String[] args) throws IOException {
        Tile[][] map = getInput();
        List<Path> paths = new ArrayList<>();
        Path firstPath = new Path(new Pair<>(0, 1));
        paths.add(firstPath);

        int largest = 0;
        while (!paths.isEmpty()) {
            List<Path> nextPaths = new ArrayList<>();
            for(var path: paths) {
                var last = path.getMostRecent();

                var y = last.getValue0();
                var x = last.getValue1();

                if (y == map.length) {
                    largest = path.getLength();
                    System.out.println(largest);
                    continue;
                }

                if(x < 0 || y < 0) {
                    continue;
                }

                var tile = map[last.getValue0()][last.getValue1()];

                List<Pair<Integer, Integer>> potentialNext = null;
                switch (tile) {
                    case Forest:
                        continue;
                    case NorthSlope:
                        potentialNext = List.of(
                             new Pair<>(y - 1, x)
                        );
                        break;
                    case EastSlope:
                        potentialNext = List.of(
                             new Pair<>(y, x + 1)
                        );
                        break;
                    case WestSlope:
                        potentialNext = List.of(
                             new Pair<>(y, x - 1)
                        );
                        break;
                    case SouthSlope:
                        potentialNext = List.of(
                             new Pair<>(y + 1, x)
                        );
                        break;
                    case Path:
                        potentialNext = List.of(
                             new Pair<>(y - 1, x), new Pair<>(y + 1, x), new Pair<>(y, x - 1), new Pair<>(y, x + 1)
                        );
                        break;
                }
                for(var nx: potentialNext) {
                   if (path.canAddNode(nx)) {
                        var a = path.clone();
                        a.addNode(nx);
                        nextPaths.add(a);
                   }
                }
            }
            paths = nextPaths;
        }
        System.out.println(largest);
    }



    static public Tile[][] getInput() throws IOException {
        String inp = new String(Files.readAllBytes(Paths.get("input")));
        return Arrays.stream(inp.split("\\R"))
                .map(String::chars)
                .map(charArray -> charArray.mapToObj(Tile::fromValue).toArray(Tile[]::new))
                .toArray(Tile[][]::new);
    }

//    static public HashMap<HashMap<Pair<Integer, Integer>, Integer>> getGraph(Tile[][] map) {
//        new Pair<>(0, 1)
//    }
}
