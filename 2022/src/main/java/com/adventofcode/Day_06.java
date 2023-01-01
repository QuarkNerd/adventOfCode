package com.adventofcode;

public class Day_06 extends SolverBase {
    public static void main(String[] args) { (new Day_06()).run(); }

    public SolutionPair solve(String input) {
        return new SolutionPair(
                getMarkerPosition(input, 4),
                getMarkerPosition(input, 14)
        );
    }

    private static int getMarkerPosition(String msg, int distinctCharCount) {
        int limit = msg.length() - distinctCharCount;
        for (int i = 0; i < limit; i++) {
            if (!Util.doDuplicatesExist(msg.substring(i, i + distinctCharCount))) {
                return i + distinctCharCount;
            }
        }
        throw new RuntimeException("Invalid input");
    }
}
