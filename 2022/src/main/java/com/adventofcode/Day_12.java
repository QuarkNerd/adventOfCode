package com.adventofcode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

public class Day_12 extends SolverBase {
    public static void main(String[] args) { (new Day_12()).run(); }

    private static Map<Node, Character> map2 = new HashMap<>();

    public SolutionPair solve(String input) {
        String[] map = input.lines().toArray(String[]::new);

        Node start = null;
        Node end = null;
        for (int i = 0; i < map.length; i++) {
            String line = map[i];
            for (int j = 0; j < line.length(); j++) {
                char c = line.charAt(j);
                Node n = new Node(j, i);
                map2.put(n, c);
                if (c == 'S') start = n;
                if (c == 'E') end = n;
            }
        }

        long sol = ShortestPathBFS.find(
                start,
                x -> map2.get(x) == 'E',
                this::getNextStatesPartOne
                ,true
        ).dist;

        // Done in reverse
        Node finalStart = start;
        long sol2 = ShortestPathBFS.find(
                end,
                x -> map2.get(x) == 'a' || x == finalStart,
                this::getNextStatesPartTwo
                ,true
        ).dist;

        return new SolutionPair(sol, sol2);
    }

    private Stream<Node> getNextStatesPartOne(Node n, long _dist) {
        char current = map2.get(n);
        return getConnected(n).stream().filter(connected -> {
            Character next = map2.get(connected);
            return next != null && (next - current <= 1 || next == 'E' || current == 'S');
        });
    }

    private Stream<Node> getNextStatesPartTwo(Node n, long _dist) {
        char current = map2.get(n);
        return getConnected(n).stream().filter(connected -> {
            Character next = map2.get(connected);
            return next != null && (current - next <= 1 || next == 'S' || current == 'E');
        });
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
        return connected;
    }
}
