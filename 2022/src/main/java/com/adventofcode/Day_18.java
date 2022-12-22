package com.adventofcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class Day_18 extends SolverBase {
    public static void main(String[] args) {
        (new Day_18()).run();
    }

    protected SolutionPair solve(String input) {
        Set<Node> boulders = Arrays.stream(input.split(System.lineSeparator())).map(line -> {
            int[] xyz = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();
            return new Node(xyz[0], xyz[1], xyz[2]);
        }).collect(Collectors.toSet());


        Set<Node> bfsVisited = new HashSet<>();
        List<Node> current = new ArrayList<>();
        current.add(new Node(1,1,1));
        bfsVisited.add(new Node(1,1,1));

        // BFS search to find all nodes not in pockets
        while (!current.isEmpty()) {
            List<Node> newCurrent = new ArrayList<>();

            for (Node node: current) {
                List<Node> connected = getConnected(node).stream().filter(
                        x -> {
                            if (
                                node.x < 0 || node.x > 20 ||
                                node.y < 0 || node.y > 20 ||
                                node.z < 0 || node.z > 20
                            ) { return false; }

                            return !bfsVisited.contains(x) && !boulders.contains(x);
                        }).toList();

                bfsVisited.addAll(connected);
                newCurrent.addAll(connected);
            }

            current = newCurrent;
        }

        Set<Node> pocketed = new HashSet<>();

        for (int x = 0; x < 21; x++) {
            for (int y = 0; y < 21; y++) {
                for (int z = 0; z < 21; z++) {
                    Node cube = new Node(x,y,z);
                    if (!bfsVisited.contains(cube) && !boulders.contains(cube)) pocketed.add(cube);
                }
            }
        }

        int externalSides = countExternalSides(boulders);
        return new SolutionPair(externalSides, externalSides - countExternalSides(pocketed));
    }

    private List<Node> getConnected(Node cube) {
        List<Node> connected = new ArrayList<>();
        int[] pp = new int[]{-1, 1};
        for (int dx : pp) {
            int x = cube.x + dx;
            connected.add(new Node(x, cube.y, cube.z));
        }
        for (int dy : pp) {
            int y = cube.y + dy;
            connected.add(new Node(cube.x, y, cube.z));
        }
        for (int dz : pp) {
            int z = cube.z + dz;
            connected.add(new Node(cube.x, cube.y, z));
        }
        return connected;
    }

    public int countExternalSides(Collection<Node> boulders) {
        long touchingSides = boulders.stream().flatMap(b -> getConnected(b).stream()).filter((boulders::contains)).count();
        return (int) (6*boulders.size() - touchingSides);
    }
}
