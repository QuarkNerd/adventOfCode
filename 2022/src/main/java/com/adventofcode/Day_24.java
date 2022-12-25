package com.adventofcode;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

public class Day_24 extends SolverBase {
    public static void main(String[] args) { (new Day_24()).run(); }

    public SolutionPair solve(String input) {
        String[] lines = input.split(System.lineSeparator());
        int height = lines.length - 2;
        int width = lines[0].length() - 2;
        WindState wind = new WindState(input);
        Node start = new Node(0, -1);
        Node end = new Node(width - 1, height);

        int firstJourney = getQuickestPath(start, end, width, height, wind, 0);
        int backAndForth = getQuickestPath(end, start, width, height, wind, firstJourney);
        int total = getQuickestPath(start, end, width, height, wind, backAndForth);

        return new SolutionPair(firstJourney - 1, total -1);
    }

    private int getQuickestPath(Node start, Node end, int width, int height, WindState wind, int timestart) {
        return timestart + (int) ShortestPathBFS.find(
                start,
                node -> node.equals(end),
                (node, time) -> getConnected(node)
                        .stream()
                        .filter(
                            connectedNode -> connectedNode.equals(new Node(0, -1))  || connectedNode.equals(new Node(width - 1, height)) ||
                            (connectedNode.y >= 0 && connectedNode.x >= 0 && connectedNode.x < width && (connectedNode.y < height) &&
                            wind.isFree(connectedNode, (int) time + timestart)
                        )),
                false
        ).dist;
    }

    private List<Node> getConnected(Node node) {
        List<Node> connected = new ArrayList<>();
        int[] pp = new int[]{-1, 1};
        for (int dx : pp) {
            int x = node.x + dx;
            connected.add(new Node(x, node.y));
        }
        for (int dy : pp) {
            int y = node.y + dy;
            connected.add(new Node(node.x, y));
        }
        connected.add(node);
        return connected;
    }

    private class WindState {
        private boolean[][] up;
        private boolean[][] down;
        private boolean[][] right;
        private boolean[][] left;
        private int height;
        private int width;

//        private int minute = 0;

        WindState(String input) {
            String[] lines = input.split(System.lineSeparator());
            height = lines.length - 2;
            width = lines[0].length() - 2;
            up = (IntStream.range(0, width)).mapToObj(_x -> new boolean[height]).toArray(boolean[][]::new);
            down = (IntStream.range(0, width)).mapToObj(_x -> new boolean[height]).toArray(boolean[][]::new);
            right = (IntStream.range(0, width)).mapToObj(_x -> new boolean[height]).toArray(boolean[][]::new);
            left = (IntStream.range(0, width)).mapToObj(_x -> new boolean[height]).toArray(boolean[][]::new);
            for (int i = 0; i < lines.length; i++) {
                String[] line = lines[i].split("");
                for (int j = 0; j < line.length; j++) {
                    switch (line[j]) {
                        case ">":
                            right[j-1][i-1] = true;
                            break;
                        case "<":
                            left[j-1][i-1] = true;
                            break;
                        case "^":
                            up[j-1][i-1] = true;
                            break;
                        case "v":
                            down[j-1][i-1] = true;
                            break;
                    }
                }
            }
        }

        private boolean isFree(Node position, int minute) {
            return !up[position.x][(position.y + minute)%height] &&
                !down[position.x][ Math.floorMod(position.y - minute, height)] &&
                !right[Math.floorMod(position.x - minute, width)][position.y] &&
                !left[(position.x + minute)%width][position.y];
        }

//        private void nextStep() {
//            minute = (minute + 1);
//        }
    }
}
