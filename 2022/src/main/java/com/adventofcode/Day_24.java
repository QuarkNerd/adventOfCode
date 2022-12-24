package com.adventofcode;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

        int firstJourney = getQuickestPath(start, end, width, height, wind);
        int journeyBack = getQuickestPath(end, start, width, height, wind);
        int finalJourney = getQuickestPath(start, end, width, height, wind);

        return new SolutionPair(firstJourney,firstJourney + journeyBack + finalJourney + 2);
    }

    private int getQuickestPath(Node start, Node end, int width, int height, WindState wind) {
        Set<Node> current = new HashSet<>();
        current.add(start);

        int minute = 0;
        while (true) {
            minute++;
            Set<Node> newCurrent = new HashSet<>();

            for (Node node : current) {
                for (Node conNode : getConnected(node)) {
                    if (conNode.equals(new Node(0, -1))  || conNode.equals(new Node(width - 1, height)) ||
                            (conNode.y >= 0 && conNode.x >= 0 && conNode.x < width && (conNode.y < height) &&
                            wind.isFree(conNode))
                    ) {
                        newCurrent.add(conNode);
                    }
                }

                if (newCurrent.contains(end)) {
                    wind.nextStep();
                    return minute - 1;
                }
            }

            current = newCurrent;
            wind.nextStep();
        }
    }

    private List<Node> getConnected(Node cube) {
        List<Node> connected = new ArrayList<>();
        int[] pp = new int[]{-1, 1};
        for (int dx : pp) {
            int x = cube.x + dx;
            connected.add(new Node(x, cube.y));
        }
        for (int dy : pp) {
            int y = cube.y + dy;
            connected.add(new Node(cube.x, y));
        }
        connected.add(cube);
        return connected;
    }

    private class WindState {
        private boolean[][] up;
        private boolean[][] down;
        private boolean[][] right;
        private boolean[][] left;
        private int height;
        private int width;

        private int minute = 0;

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

        private boolean isFree(Node position) {
            return !up[position.x][(position.y + minute)%height] &&
                !down[position.x][ Math.floorMod(position.y - minute, height)] &&
                !right[Math.floorMod(position.x - minute, width)][position.y] &&
                !left[(position.x + minute)%width][position.y];
        }

        private void nextStep() {
            minute = (minute + 1)%(height*width);
        }
    }
}
