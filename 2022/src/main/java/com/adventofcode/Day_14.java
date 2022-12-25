package com.adventofcode;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

public class Day_14 extends SolverBase {
    public static void main(String[] args) { (new Day_14()).run(); }

    static int lowest = 0;
    static Set<Node> walls = new HashSet<>();
    public SolutionPair solve(String input) {
        parseInput(input);
        return new SolutionPair(solvePartOne(), solvePartTwo());
    }
    private int solvePartOne() {
        Set<Node> sand = new HashSet<>();
        Node entry = new Node(500, 0);
        while (true) {
            Node position = entry;
            boolean moving = true;
            while (moving) {
                if (position.y > lowest) return sand.size();
                Node[] options = new Node[]{
                        new Node(position.x, position.y + 1),
                        new Node(position.x - 1, position.y + 1),
                        new Node(position.x + 1, position.y + 1)
                    };

                moving = false;
                for (Node option: options) {
                    if (!walls.contains(option) && !sand.contains(option)) {
                        moving = true;
                        position = option;
                        break;
                    }
                }
            }
            sand.add(position);
        }
    }

    private int solvePartTwo() {
        Node entry = new Node(500, 0);
        return ShortestPathBFS.find(
                entry,
                null,
                (node, _t) -> Stream.of(
                        new Node(node.x - 1, node.y + 1),
                        new Node(node.x, node.y + 1),
                        new Node(node.x + 1, node.y + 1)
                ).filter(n -> !walls.contains(n) && n.y < lowest + 2),
                true
        ).visited.size();
    }

    private void parseInput(String input) {
        for (String line: input.split(System.lineSeparator())) {
            Node[] corners = Arrays.stream(line.split(" -> ")).map(st -> {
                String[] xy = st.split(",");
                return new Node(Integer.parseInt(xy[0]), Integer.parseInt(xy[1]));
            }).toArray(Node[]::new);

            for (int i = 0; i < corners.length - 1; i++) {
                Node from = corners[i];
                Node to = corners[i+1];

                if (from.y > lowest) {
                    lowest = from.y;
                }

                int xDiff = (int) Math.signum(to.x - from.x);
                int yDiff = (int) Math.signum(to.y - from.y);

                Node current = from;

                while (!current.equals(to)) {
                    walls.add(current);
                    current = new Node(current.x + xDiff, current.y + yDiff);
                }
            }
            Node remaining = corners[corners.length-1];
            walls.add(remaining);
            if (remaining.y > lowest) {
                lowest = remaining.y;
            }
        }
    }
}
