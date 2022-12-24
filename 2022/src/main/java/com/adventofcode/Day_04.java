package com.adventofcode;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Day_04 extends SolverBase {
    public static void main(String[] args) { (new Day_04()).run(); }

    public SolutionPair solve(String input) {
        List<String> lines = Util.split(input, System.lineSeparator());

        int partOne = 0;
        int partTwo = 0;
        for (String line : lines) {
            List<Integer> parsed = parseLine(line);

            if (
                    (parsed.get(2) <= parsed.get(1) && parsed.get(3) >= parsed.get(0)) ||
                    (parsed.get(0) <= parsed.get(3) && parsed.get(1) >= parsed.get(2))
            ) {
                partTwo++;
                if (
                        (parsed.get(0) <= parsed.get(2) && parsed.get(3) <= parsed.get(1)) ||
                        (parsed.get(2) <= parsed.get(0) && parsed.get(1) <= parsed.get(3))
                ) {
                    partOne++;

                }
            }
        }
        return new SolutionPair(partOne, partTwo);
    }

    private static List<Integer> parseLine(String a) {
        String[] split = a.split("[,-]");
        return Arrays.stream(split).map(Integer::valueOf).collect(Collectors.toList());
    }
}
